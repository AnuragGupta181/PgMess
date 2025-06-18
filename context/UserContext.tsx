// "use client";
// import React, { createContext, useState, useContext, useEffect } from "react";

// interface StudentUser {
//   name: string;
//   college: string;
//   course: string;
//   foodPreference?: string;
//   roomType?: string;
// }

// interface UserContextType {
//   user_student: StudentUser | null;
//   setUser_student: (user: StudentUser | null) => void;
// }

// const UserContext = createContext<UserContextType | undefined>(undefined);

// export const UserProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user_student, setUser_student] = useState<StudentUser | null>(null);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user_student");
//     if (storedUser) {
//       setUser_student(JSON.parse(storedUser));
//     }
//   }, []);

//   return (
//     <UserContext.Provider value={{ user_student, setUser_student }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = (): UserContextType => {
//   const context = useContext(UserContext);
//   if (!context) {
//     throw new Error("useUser must be used within a UserProvider");
//   }
//   return context;
// };
// // check for user context and write code for owner context 









"use client";
import React, { createContext, useState, useContext, useEffect } from "react";

// Student Interface
interface StudentUser {
  name: string;
  college: string;
  course: string;
  foodPreference?: string;
  roomType?: string;
}

// Owner Interface
interface OwnerUser {
  name: string;
  companyName: string;
  address: string;
  type: "PG" | "Mess";
}

// Extended Context Type
interface UserContextType {
  user_student: StudentUser | null;
  setUser_student: (user: StudentUser | null) => void;
  user_owner: OwnerUser | null;
  setUser_owner: (user: OwnerUser | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user_student, setUser_student] = useState<StudentUser | null>(null);
  const [user_owner, setUser_owner] = useState<OwnerUser | null>(null);

  useEffect(() => {
    const storedStudent = localStorage.getItem("user_student");
    if (storedStudent) {
      setUser_student(JSON.parse(storedStudent));
    }

    const storedOwner = localStorage.getItem("user_owner");
    if (storedOwner) {
      setUser_owner(JSON.parse(storedOwner));
    }
  }, []);

  return (
    <UserContext.Provider
      value={{ user_student, setUser_student, user_owner, setUser_owner }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
