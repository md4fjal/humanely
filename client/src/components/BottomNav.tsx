"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import dynamic from "next/dynamic";
const MoreDrawer = dynamic(() => import("./MoreDrawer"), {
  ssr: false,
});

const tabs = [
  { href: "/", label: "HOME", icon: "◎" },
  { href: "/log", label: "LOG", icon: "✎" },
  { href: "/reflect", label: "REFLECT", icon: "✦" },
  { href: "/traits", label: "TRAITS", icon: "◈" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <nav className="bottom-nav">
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          maxWidth: 480,
          margin: "0 auto",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
                padding: "12px 8px",
                textDecoration: "none",
                transition: "all 0.18s ease",
                position: "relative",
              }}
            >
              {/* Active indicator dot */}
              {isActive && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 24,
                    height: 2,
                    borderRadius: "0 0 2px 2px",
                    background: "#C8973A",
                  }}
                />
              )}
              <span
                style={{
                  fontSize: 20,
                  color: isActive ? "#C8973A" : "#4A475E",
                  transition: "color 0.18s ease",
                  lineHeight: 1,
                }}
              >
                {tab.icon}
              </span>
              <span
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: 9,
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  color: isActive ? "#C8973A" : "#4A475E",
                  transition: "color 0.18s ease",
                }}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}

        <button
          onClick={() => setDrawerOpen(true)}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            padding: "12px 8px",
            background: "none",
            border: "none",
            cursor: "pointer",
            transition: "all 0.18s ease",
          }}
        >
          <span style={{ fontSize: 20, color: "#4A475E", lineHeight: 1 }}>···</span>
          <span
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: 9,
              fontWeight: 600,
              letterSpacing: "0.12em",
              color: "#4A475E",
            }}
          >
            MORE
          </span>
        </button>
      </div>
      <MoreDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </nav>
  );
}
