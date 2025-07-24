import React from "react";
export default function Dashboard({ user }) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <button
          onClick={() => {
            localStorage.removeItem("userToken");
            window.location.reload();
          }}
          className="mt-6 w-full bg-red-500 text-white py-2 rounded-xl hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
