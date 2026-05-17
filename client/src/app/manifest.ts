import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ensanit — How humanely are you living?",
    short_name: "Ensanit",
    description:
      "A private mirror for your daily choices. Track your humanity score, log actions, and reflect on your character with AI.",
    start_url: "/",
    display: "standalone",
    background_color: "#0B0B10",
    theme_color: "#C8973A",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
