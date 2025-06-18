import { Client, Account, Databases, ID } from "appwrite";

export const appwriteConfig = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '',
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '',
  storageId: process.env.NEXT_PUBLIC_APPWRITE_STORAGE_ID || '',
  userStudentCollectionId: process.env.NEXT_PUBLIC_APPWRITE_USER_STUDENT_COLLECTION_ID || '',
  userOwnerCollectionId: process.env.NEXT_PUBLIC_APPWRITE_USER_OWNER_COLLECTION_ID || '',
};

const client = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

export const account = new Account(client);
export const databases = new Databases(client);

export const DB_ID = appwriteConfig.databaseId;
export const userStudentCollectionId = appwriteConfig.userStudentCollectionId;
export const userOwnerCollectionId = appwriteConfig.userOwnerCollectionId;

export { ID };




"use client";

import { useEffect, useState } from "react";
import { account, databases, DB_ID } from "@/lib/appwrite";
import { useRouter } from "next/navigation";

import { useUser } from "@/context/UserContext";




export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
    const { user_student, setUser_student } = useUser();


  useEffect(() => {
    // This only runs on client-side
    const localUserStr = localStorage.getItem("user_student");
    if (localUserStr) {
      const parsedUser = JSON.parse(localUserStr);
      setUser(parsedUser);
      setUser_student(parsedUser);
    }

    const fetchAndStore = async () => {
      try {
        const userAccount = await account.get();

        if (!localUserStr) {
          console.error("Form data missing");
          return;
        }

        const formData = JSON.parse(localUserStr);

        const studentData = {
          ...formData,
          email: userAccount.email,
          role: "student",
        };

        await databases.createDocument(
          DB_ID,
          "682c9f4d0031798ddd51",
          "unique()",
          studentData
        );
      } catch (error) {
        console.error("Error in dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndStore();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user_student");
    setUser_student(null)
    
    router.push("/login");
  };

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-xl p-10 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome, <span className="text-amber-500">{user?.name}</span>
          {user?.course && <span className="text-gray-600"> ({user.course})</span>}
          {user?.college && <span className="text-gray-500"> - {user.college}</span>}
          {user?.roomType && <span className="text-gray-500"> - {user.roomType}</span>}
          {user?.foodPreference && <span className="text-gray-500"> - {user.foodPreference}</span>}
        </h1>

        <p className="text-green-600 font-medium mb-6">
          ✅ You are logged in and your data is stored securely.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <strong>College:</strong> {user?.college || "N/A"}
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <strong>Course:</strong> {user?.course || "N/A"}
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <strong>Room Type:</strong> {user?.roomType || "N/A"}
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <strong>Food Preference:</strong> {user?.foodPreference || "N/A"}
          </div>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="mt-6 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-xl shadow-md transition-all duration-300 ease-in-out hover:scale-105"
      >
        Logout
      </button>
    </div>
  );
}