"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import HumanelyHeader from "@/components/HumanelyHeader";
import BottomNav from "@/components/BottomNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div style={{ minHeight: "100vh", background: "#0B0B10" }}>
        <HumanelyHeader />
        <main
          style={{
            maxWidth: 480,
            margin: "0 auto",
            padding: "24px 20px 100px",
          }}
        >
          {children}
        </main>
        <BottomNav />
      </div>
    </ProtectedRoute>
  );
}
