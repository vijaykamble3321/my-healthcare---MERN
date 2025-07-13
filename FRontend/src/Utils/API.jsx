import axios from "axios";

// Create an Axios instance
const API = axios.create({
  baseURL: import.meta.env.VITE_BASEURL || "", // Replace with your API base URL
  timeout: 10000,
});
console.log("url", import.meta.env.VITE_BASEURL);

// Utility functions for token storage
const getAccessToken = () => localStorage.getItem("accessToken");
const getRefreshToken = () => localStorage.getItem("refreshToken");
const saveAccessToken = (token) => localStorage.setItem("accessToken", token);
const saveRefreshToken = (token) => localStorage.setItem("refreshToken", token);
const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

// Request interceptor to add the `accessToken` to the headers
API.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Fix the extra closing bracket here
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 and refresh tokens
API.interceptors.response.use(
  (response) => {
    console.log("api-response", response.data.data);

    // Save tokens on sign-in response
    if (
      response.config.url.includes("/api/auth/user/signin") &&
      response.data.data?.accessToken &&
      response.data.data?.refreshToken
    ) {
      console.log("api-response", response.data.data);
      saveAccessToken(response.data.data.accessToken);
      saveRefreshToken(response.data.data.refreshToken);
      
      window.location.href = response.data.data.redirectPath; 
      // window.location.href = `/${response.data.data.redirect}`;
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/api/auth/refreshtoken")
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          clearTokens();
          window.location.href = "/signin"; 
          return Promise.reject(error);
        }

        // Call the refresh endpoint to get new access and refresh tokens
        const { data } = await API.post("/api/auth/refreshtoken", {
          refreshToken,
        });
        const newAccessToken = data.data.accessToken;
        const newRefreshToken = data.data.refreshToken;

        // Save new tokens
        saveAccessToken(newAccessToken);
        saveRefreshToken(newRefreshToken);

        // Retry the original request with the new access token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return API(originalRequest);
      } catch (refreshError) {
        clearTokens(); // Clear all tokens if refresh fails
        window.location.href = "/signin"; // Redirect to signin page if refresh fails
        return Promise.reject(refreshError);
      }
    }
    // In case of any other errors, return the error response
    return Promise.reject(error.response || error);
  }
);

export default API;
