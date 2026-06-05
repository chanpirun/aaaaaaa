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
    <div className="w-full h-screen flex flex-col">
      <div className="flex-1 overflow-auto p-8 md:p-12">
        <div className="w-full rounded-2xl border border-gray-200 bg-white shadow-sm p-8">
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
            className="mt-6 px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}