"use client"

import { useState } from "react"
import { Card } from "./card"

export function MorphingCard({ children, className = "", ...props }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Card
      className={`relative overflow-hidden transition-all duration-500 ease-out transform-gpu ${
        isHovered ? "scale-105 shadow-2xl" : "scale-100 shadow-md"
      } ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 transition-opacity duration-500 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      />
      <div className="relative z-10">{children}</div>

      {/* Animated border */}
      <div
        className={`absolute inset-0 rounded-lg transition-all duration-500 ${
          isHovered
            ? "bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_200%] animate-gradient-x"
            : ""
        }`}
        style={{
          padding: "2px",
          backgroundImage: isHovered
            ? "linear-gradient(45deg, var(--primary), var(--accent), var(--primary))"
            : "none",
          /* keep backgroundSize separate (Tailwind also sets it via bg-[length:...]) */
          backgroundSize: isHovered ? "200% 200%" : undefined,
        }}
      >
        <div className="w-full h-full bg-card rounded-lg" />
      </div>

      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </Card>
  )
}
