import React from "react";
import { useNavigate } from "react-router-dom";

const Error = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <p className="text-xl text-gray-600 mt-4">Oops! The page you're looking for doesn't exist.</p>
      <button 
        onClick={() => navigate("/")}
        className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition"
      >
        Go Home
      </button>
    </div>
  );
};

export default Error;
