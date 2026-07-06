"use client";

import { useEffect, useState, useRef } from "react";
import { Bell, Check } from "lucide-react";
import { useRouter } from "next/navigation";


type Notification = {
  id: string;
  type: string;
  notifiable_type: string;
  notifiable_id: number;
  data: {
    message: string;
    submission_id: number;
    title: string;
    owner_name?: string;
    status?: string;
  };
  read_at: string | null;
  created_at: string;
  updated_at: string;
};

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    fetchNotifications();

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/next-api/notifications", {
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        const json = await res.json();
        setNotifications(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };


  const markAsRead = async (id: string, submissionId: number) => {
    try {
      await fetch(`/next-api/notifications/${id}/read`, {
        method: "POST",
        credentials: "include",
      });

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
      );
      setIsOpen(false);
      router.refresh();
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch(`/next-api/notifications/mark-all-read`, {
        method: "POST",
        credentials: "include",
      });

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read_at: new Date().toISOString() }))
      );
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };


  const unreadCount = notifications.filter((n) => !n.read_at).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 ring-2 ring-white text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white shadow-lg z-50 overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 bg-slate-50">
            <h3 className="font-semibold text-slate-800">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Mark all as read
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-center text-sm text-slate-500">No notifications.</p>
            ) : (
              <div className="flex flex-col">
                {notifications.map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => markAsRead(notification.id, notification.data.submission_id)}
                    className={`flex flex-col gap-1 border-b border-slate-100 p-4 text-left transition-colors hover:bg-slate-50 ${
                      !notification.read_at ? "bg-indigo-50/30" : ""
                    }`}
                  >
                    <p className={`text-sm ${!notification.read_at ? "font-semibold text-slate-900" : "text-slate-600"}`}>
                      {notification.data.message}
                    </p>
                    <span className="text-xs text-slate-400">
                      {new Date(notification.created_at).toLocaleDateString()}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
