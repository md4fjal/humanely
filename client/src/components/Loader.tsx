"use client";

import { motion } from "framer-motion";

export default function Loader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-950">
      <motion.div
        className="w-16 h-16 border-4 border-zinc-800 border-t-zinc-400 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}
