// "use client";

// import { useEffect, useState } from "react";
// import { account, databases, DB_ID } from "@/lib/appwrite";
// import { useRouter } from "next/navigation";

// import { useUser } from "@/context/UserContext";




// export default function Dashboard() {
//   const [loading, setLoading] = useState(true);
//   const [user, setUser] = useState<any>(null);
//   const router = useRouter();
//     const { user_student, setUser_student } = useUser();


//   useEffect(() => {
//     // This only runs on client-side
//     const localUserStr = localStorage.getItem("user_student");
//     if (localUserStr) {
//       const parsedUser = JSON.parse(localUserStr);
//       setUser(parsedUser);
//       setUser_student(parsedUser);
//     }

//     const fetchAndStore = async () => {
//       try {
//         const userAccount = await account.get();

//         if (!localUserStr) {
//           console.error("Form data missing");
//           return;
//         }

//         const formData = JSON.parse(localUserStr);

//         const studentData = {
//           ...formData,
//           email: userAccount.email,
//           role: "student",
//         };

//         await databases.createDocument(
//           DB_ID,
//           "682c9f4d0031798ddd51",
//           "unique()",
//           studentData
//         );
//       } catch (error) {
//         console.error("Error in dashboard:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAndStore();
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("user_student");
//     setUser_student(null)
    
//     router.push("/login");
//   };

//   if (loading) return <div className="p-10">Loading...</div>;

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
//       <div className="bg-white shadow-xl rounded-xl p-10 max-w-2xl w-full">
//         <h1 className="text-3xl font-bold text-gray-800 mb-4">
//           Welcome, <span className="text-amber-500">{user?.name}</span>
//           {user?.course && <span className="text-gray-600"> ({user.course})</span>}
//           {user?.college && <span className="text-gray-500"> - {user.college}</span>}
//           {user?.roomType && <span className="text-gray-500"> - {user.roomType}</span>}
//           {user?.foodPreference && <span className="text-gray-500"> - {user.foodPreference}</span>}
//         </h1>

//         <p className="text-green-600 font-medium mb-6">
//           ✅ You are logged in and your data is stored securely.
//         </p>

//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
//           <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
//             <strong>College:</strong> {user?.college || "N/A"}
//           </div>
//           <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
//             <strong>Course:</strong> {user?.course || "N/A"}
//           </div>
//           <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
//             <strong>Room Type:</strong> {user?.roomType || "N/A"}
//           </div>
//           <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
//             <strong>Food Preference:</strong> {user?.foodPreference || "N/A"}
//           </div>
//         </div>
//       </div>

//       <button
//         onClick={handleLogout}
//         className="mt-6 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-xl shadow-md transition-all duration-300 ease-in-out hover:scale-105"
//       >
//         Logout
//       </button>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { account, databases, DB_ID, appwriteConfig, ID } from "@/lib/appwrite";
import { useUser } from "@/context/UserContext";

const STUDENT_COLLECTION_ID = appwriteConfig.userStudentCollectionId;
const OWNER_COLLECTION_ID =  appwriteConfig.userOwnerCollectionId;

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  const { user_student, setUser_student } = useUser();
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      try {
        const sessionUser = await account.get();
        const localRole = localStorage.getItem("role");
        const localUserStr = localStorage.getItem(
          localRole === "student" ? "user_student" : "user_owner"
        );

        if (!localRole || !localUserStr) {
          console.error("Missing role or user data.");
          router.push("/auth/register");
          return;
        }

        const parsedUser = JSON.parse(localUserStr);
        setUserData({ ...parsedUser, email: sessionUser.email });

        // Set context for student
        if (localRole === "student") {
          setUser_student(parsedUser);
        }

        // Write to Appwrite DB (only if not already stored)
        const collectionId =
          localRole === "student" ? STUDENT_COLLECTION_ID : OWNER_COLLECTION_ID;

        const docId = `user-${sessionUser.$id}`; // to avoid duplicates

        try {
          // Try fetching to avoid duplicate
          await databases.getDocument(DB_ID, collectionId, docId);
        } catch {
          // Doesn't exist — create new
          await databases.createDocument(
            DB_ID,
            collectionId,
            docId,
            {
              ...parsedUser,
              email: sessionUser.email,
              role: localRole,
            }
          );
        }

        // Redirect based on role
        if (localRole === "student") {
          router.push("/student-dashboard");
        } else if (localRole === "owner") {
          router.push("/owner-dashboard");
        } else {
          console.warn("Unknown role.");
          router.push("/auth/register");
        }
      } catch (err) {
        console.error("Error in dashboard init:", err);
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      localStorage.clear();
      setUser_student(null);
      router.push("/auth/login");
    }
  };

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-xl p-10 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome, <span className="text-amber-500">{userData?.name}</span>
        </h1>

        <p className="text-green-600 font-medium mb-6">
          ✅ You are logged in as a{" "}
          <span className="font-semibold text-blue-600">
            {localStorage.getItem("user_role")}
          </span>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
          {userData?.college && (
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <strong>College:</strong> {userData.college}
            </div>
          )}
          {userData?.course && (
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <strong>Course:</strong> {userData.course}
            </div>
          )}
          {userData?.roomType && (
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <strong>Room Type:</strong> {userData.roomType}
            </div>
          )}
          {userData?.foodPreference && (
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <strong>Food Preference:</strong> {userData.foodPreference}
            </div>
          )}
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
