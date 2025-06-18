"use client";

import { useState } from "react";
import { account } from "@/lib/appwrite";

interface StudentFormData {
  name: string;
  college: string;
  course: string;
  foodPreference?: string;
  roomType?: string;
  role: "student";
}

interface OwnerFormData {
  name: string;
  companyName: string;
  address: string;
  role: "owner";
  type: "PG" | "Mess";
}

type FormData = StudentFormData | OwnerFormData;

export default function RegisterPage() {
  const [role, setRole] = useState<"student" | "owner" | "">("");
  const [name, setName] = useState("");
  const [college, setCollege] = useState("");
  const [course, setCourse] = useState("");
  const [foodPreference, setFoodPreference] = useState("");
  const [roomType, setRoomType] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [type, setType] = useState<"Mess" | "PG" | "">("");

  const isStudentValid = name && college && course;
  const isOwnerValid = name && companyName && address && type;
  const isFormValid =
    (role === "student" && isStudentValid) ||
    (role === "owner" && isOwnerValid);

  const handleGoogleRegister = () => {
    if (!isFormValid || !role) {
      alert("Please fill all required fields before continuing.");
      return;
    }

    let formData: FormData;

    if (role === "student") {
      formData = {
        name,
        college,
        course,
        foodPreference,
        roomType,
        role: "student",
      };
      localStorage.setItem("user_student", JSON.stringify(formData));
    } else {
      const ownerData: OwnerFormData = {
        name,
        companyName,
        address,
        role: "owner",
        type: type as "PG" | "Mess",
      };
      formData = ownerData;
      localStorage.setItem("user_owner", JSON.stringify(formData));
    }

    account.createOAuth2Session(
      "google" as any,
      "http://localhost:3000/dashboard", // success
      "http://localhost:3000/auth/register" // failure
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        {/* Role Selection */}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as "student" | "owner")}
          className="w-full px-4 py-2 rounded bg-gray-700 text-white mb-4"
        >
          <option value="">Select Role</option>
          <option value="student">Student</option>
          <option value="owner">Owner</option>
        </select>

        {/* Common name field */}
        {role && (
          <>
            <input
              type="text"
              placeholder={role === "student" ? "Name" : "Owner Name"}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-700 text-white mb-3"
              required
            />

            {role === "student" && (
              <>
                <input
                  type="text"
                  placeholder="College"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full px-4 py-2 rounded bg-gray-700 text-white mb-3"
                  required
                />
                <input
                  type="text"
                  placeholder="Course"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full px-4 py-2 rounded bg-gray-700 text-white mb-3"
                  required
                />
                <select
                  value={foodPreference}
                  onChange={(e) => setFoodPreference(e.target.value)}
                  className="w-full px-4 py-2 rounded bg-gray-700 text-white mb-3"
                >
                  <option value="">Select Food Preference</option>
                  <option value="veg">Veg</option>
                  <option value="non-veg">Non-Veg</option>
                  <option value="both">Both</option>
                </select>
                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  className="w-full px-4 py-2 rounded bg-gray-700 text-white mb-3"
                >
                  <option value="">Select Room Type</option>
                  <option value="single">Single</option>
                  <option value="double">Double</option>
                  <option value="triple">Triple</option>
                </select>
              </>
            )}

            {role === "owner" && (
              <>
                <input
                  type="text"
                  placeholder="Company Name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-4 py-2 rounded bg-gray-700 text-white mb-3"
                  required
                />
                <input
                  type="text"
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2 rounded bg-gray-700 text-white mb-3"
                  required
                />
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as "PG" | "Mess")}
                  className="w-full px-4 py-2 rounded bg-gray-700 text-white mb-3"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="PG">PG</option>
                  <option value="Mess">Mess</option>
                </select>
              </>
            )}

            <button
              onClick={handleGoogleRegister}
              disabled={!isFormValid}
              className={`w-full px-6 py-3 rounded text-lg transition-colors ${
                isFormValid
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-600 cursor-not-allowed"
              }`}
            >
              Continue with Google
            </button>
          </>
        )}
      </div>
    </div>
  );
}

