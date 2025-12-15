import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer } from 'react-toastify'
import { handleError } from "../utils/ApiError";
import axios from "axios";
import { navigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload


    // Call your API here
    const { email, password } = formData;
    console.log("Emial: ", email, "Password: ", password);

    if (!email || !password) {
      return handleError("All fields are required");
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/login",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      localStorage.setItem("user", JSON.stringify(response.data.data));

    } catch (error) {
      handleError(error.response?.data?.message || error.message);
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg font-semibold transition-all duration-300"
          >
            Login
          </button>
        </form>

        <ToastContainer />

        <p className="text-center text-gray-500 mt-4">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-purple-500 font-medium cursor-pointer hover:underline"
          >
            Sign Up
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
