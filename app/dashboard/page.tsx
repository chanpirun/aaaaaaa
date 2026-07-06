"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Try localStorage first (set on login), fallback to server check
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Cookie is HttpOnly — ask our own route if we're authed
      fetch("/api/me", { credentials: "include" })
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data?.user) setUser(data.user);
          else router.push("/");
        })
        .catch(() => router.push("/"));
    }
  }, []);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST", credentials: "include" }).catch(() => {});
    localStorage.clear();
    sessionStorage.clear();
    router.push("/");
  };

  if (!user) return <p className="p-10">Loading...</p>;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">
        Welcome {user.name} 👋
      </h1>
      <p className="mt-4 text-gray-600">Email: {user.email}</p>
      <button
        onClick={handleLogout}
        className="mt-6 px-5 py-2 bg-red-500 text-white rounded-lg"
      >
        Logout
      </button>
    </div>
  );
}