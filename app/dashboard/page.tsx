"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.push("/"); // not logged in → go back
      return;
    } 

    setUser(JSON.parse(storedUser));
  }, []);

  if (!user) return <p className="p-10">Loading...</p>;
    
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">
        Welcome {user.name} 👋
      </h1>

      <p className="mt-4 text-gray-600">
        Email: {user.email}
      </p>

      {/* Logout button */}
      <button
        onClick={() => {
          localStorage.removeItem("user");
          router.push("/");
        }}
        className="mt-6 px-5 py-2 bg-red-500 text-white rounded-lg"
      >
        Logout
      </button>
    </div>
  );
}