"use client";
// CHALLENGE (Session 8) — Core Challenge: halaman /profile (protected)
import { useEffect, useState } from "react";
import RouteGuard from "@/app/components/RouteGuard";
import { getMe } from "@/services/authService";
import type { AuthUser } from "@/types/user";

function ProfileContent() {
  const [profile, setProfile] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe()
      .then(setProfile)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !profile) {
    return <p className="text-gray-500">Loading profile...</p>;
  }

  return (
    <div className="border rounded-xl p-6 bg-white">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-gray-500">NAME</p>
          <p className="font-medium">{profile.name}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">EMAIL</p>
          <p className="font-medium">{profile.email}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">TOTAL TRIPS GENERATED</p>
          <p className="font-medium">{profile.total_trips ?? 0}</p>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <RouteGuard>
      <main className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>
        <ProfileContent />
      </main>
    </RouteGuard>
  );
}