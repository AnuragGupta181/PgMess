"use client";

import { useState } from "react";
import { account } from "@/lib/appwrite";

export default function LoginPage() {

  const [name, setName] = useState("");
  const [college, setCollege] = useState("");
  const [course, setCourse] = useState("");
  const [foodPreference, setFoodPreference] = useState("");
  const [roomType, setRoomType] = useState("");
  const isFormValid = name && college && course;

  const handleGoogleLogin = () => {
        if (!isFormValid){
          alert("please fill the mandatory details first");
          return;
        };

         // Save form data to localStorage temporarily
    const formData = {
      name,
      college,
      course,
      foodPreference,
      roomType,
    };
    localStorage.setItem("user_student", JSON.stringify(formData));

    account.createOAuth2Session(
      "google" as any,
      "http://localhost:3000/dashboard",  // success URL
      "http://localhost:3000/login"       // failure URL
    );
  };

  

  return (
   <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Student Login</h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            placeholder="College"
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            placeholder="Course"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          {/* Optional Preferences */}
          <select
            value={foodPreference}
            onChange={(e) => setFoodPreference(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white"
          >
            <option value="">Select Food Preference</option>
            <option value="veg">Veg</option>
            <option value="non-veg">Non-Veg</option>
            <option value="both">Both</option>
          </select>

          <select
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white"
          >
            <option value="">Select Room Type</option>
            <option value="single">Single</option>
            <option value="double">Double</option>
          </select>

          <button
            onClick={handleGoogleLogin}
            disabled={!isFormValid}
            className={`w-full px-6 py-3 rounded text-lg transition-colors ${
              isFormValid
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-600 cursor-not-allowed"
            }`}
          >
            Login with Google
          </button>
        </div>
      </div>
    </div>
  );
}