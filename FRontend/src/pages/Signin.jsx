import React, { useState } from "react";
import API from "../Utils/API"; // Your API utility

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [view, setView] = useState("signin");
  const [otp, setOtp] = useState(""); // OTP input for reset password
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Signup Fields
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [role, setRole] = useState("user");

  // Handle Sign-In
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage("Please enter both email and password.");
      return;
    }
    try {
      const resp = await API.post("/api/auth/user/signin", { email, password });
      setMessage("Sign In Successful! 🎉");
      // Optionally handle redirect or state changes after successful login
    } catch (error) {
      console.error("Error:", error);
      setMessage("Sign In Failed! Please check your credentials.");
    }
  };

  // Forgot Password: Request OTP
  const handleForgotPassword = async () => {
    if (!email) {
      setMessage("Please enter your email.");
      return;
    }
    try {
      const response = await API.post("/api/auth/user/forgot", { email });
      setMessage(`OTP sent to ${email}.`);
      setView("reset"); // Directly go to reset view
    } catch (error) {
      setMessage("Error sending OTP. Please try again.");
    }
  };

  // Reset Password: Handle OTP verification and password update
  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    if (!newPassword || !confirmPassword || !otp) {
      setMessage("Please enter OTP, new password, and confirm it.");
      return;
    }
    try {
      const response = await API.post("/api/auth/user/reset", { email, otp, password: newPassword });
      setMessage("Password Reset Successful! 🎉");
      setView("signin"); // Go back to signin after successful reset
    } catch (error) {
      console.error("Error during password reset:", error);
      setMessage("Password Reset Failed. Please try again.");
    }
  };

  // Handle Sign-Up
  const handleSignup = async (e) => {
    e.preventDefault();
    if (!fname || !lname || !email || !password || !role) {
      setMessage("Please fill in all fields.");
      return;
    }
    try {
      const response = await API.post("/api/auth/user/signup", { fname, lname, email, password, role });
      setMessage("Sign Up Successful! 🎉");
      setView("signin"); // Go back to signin after successful signup
    } catch (error) {
      console.error("Error during sign-up:", error);
      setMessage("Sign Up Failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {/* SignIn Form */}
      {view === "signin" && (
        <div className="bg-white p-8 rounded-lg shadow-md w-full sm:w-96">
          <h2 className="text-2xl font-semibold text-center mb-6">Sign In</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-6">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Sign In
            </button>
          </form>
          <p
            className="text-center text-blue-500 cursor-pointer mt-4"
            onClick={() => setView("forgot")}
          >
            Forgot Password?
          </p>
          
          {/* Added Sign Up Button */}
          <p
            className="text-center text-green-500 cursor-pointer mt-4"
            onClick={() => setView("signup")}
          >
            Don't have an account? Sign Up here
          </p>

          {message && (
            <p
              className={`text-center mt-4 text-sm ${
                message.includes("Successful") ? "text-green-500" : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      )}

      {/* Forgot Password Form */}
      {view === "forgot" && (
        <div className="bg-white p-8 rounded-lg shadow-md w-full sm:w-96">
          <h2 className="text-2xl font-semibold text-center mb-6">Forgot Password</h2>
          <div className="mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleForgotPassword}
            className="w-full p-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            Send OTP
          </button>
          <p
            className="text-center text-blue-500 cursor-pointer mt-4"
            onClick={() => setView("signin")}
          >
            Back to Sign In
          </p>
          {message && (
            <p
              className={`text-center mt-4 text-sm ${
                message.includes("Successful") ? "text-green-500" : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      )}

      {/* Reset Password Form */}
      {view === "reset" && (
        <div className="bg-white p-8 rounded-lg shadow-md w-full sm:w-96">
          <h2 className="text-2xl font-semibold text-center mb-6">Reset Password</h2>
          <div className="mb-4">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleResetPassword}
            className="w-full p-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Reset Password
          </button>
          <p
            className="text-center text-blue-500 cursor-pointer mt-4"
            onClick={() => setView("signin")}
          >
            Back to Sign In
          </p>
          {message && (
            <p
              className={`text-center mt-4 text-sm ${
                message.includes("Successful") ? "text-green-500" : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      )}

      {/* Sign Up Form */}
      {view === "signup" && (
        <div className="bg-white p-8 rounded-lg shadow-md w-full sm:w-96">
          <h2 className="text-2xl font-semibold text-center mb-6">Sign Up</h2>
          <form onSubmit={handleSignup}>
            <div className="mb-4">
              <input
                type="text"
                value={fname}
                onChange={(e) => setFname(e.target.value)}
                placeholder="First Name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                value={lname}
                onChange={(e) => setLname(e.target.value)}
                placeholder="Last Name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-6">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="user">User</option>
                
              </select>
            </div>
            <button
              type="submit"
              className="w-full p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Sign Up
            </button>
          </form>
          <p
            className="text-center text-blue-500 cursor-pointer mt-4"
            onClick={() => setView("signin")}
          >
            Already have an account? Sign In here
          </p>
          {message && (
            <p
              className={`text-center mt-4 text-sm ${
                message.includes("Successful") ? "text-green-500" : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Signin;
