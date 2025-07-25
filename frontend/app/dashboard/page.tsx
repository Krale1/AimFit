  "use client";
  import { signOut, useSession } from "next-auth/react";

  export default function DashboardPage() {
    const { data: session, status } = useSession();

    if (status === "loading") return <p>Loading...</p>;
    if (!session) return <p>You are not logged in.</p>;

    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Welcome, {session.user?.name}</h1>
        <p>Email: {session.user?.email}</p>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    );
  }
