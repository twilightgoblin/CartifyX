"use client"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { ParallaxScroll } from "@/components/ui/parallax-scroll"
import { FloatingElements } from "@/components/ui/floating-elements"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { ArrowRight, Star, Users, Package, Sparkles } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20 lg:py-32 overflow-hidden">
      <FloatingElements count={8} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className={`inline-flex items-center gap-3 px-8 py-4 rounded-full text-sm font-bold mb-8 border-2 border-primary/20 shadow-2xl transition-all duration-1000 relative overflow-hidden ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{
              backgroundColor: "#262424",
              color: "#ffffff",
            }}
          >
            <Sparkles className="h-5 w-5 animate-pulse text-yellow-300" />
            <span className="relative z-10 tracking-wide">PREMIUM E-COMMERCE EXPERIENCE</span>
            <div className="w-3 h-3 bg-yellow-300 rounded-full animate-ping shadow-lg" />
          </div>

          <div className="space-y-4 mb-8">
            <h1
              className={`text-4xl md:text-6xl lg:text-7xl font-bold text-balance transition-all duration-1000 delay-200 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              Discover Premium
            </h1>
            <ParallaxScroll speed={0.2}>
              <span
                className={`text-4xl md:text-6xl lg:text-7xl font-bold text-primary block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_200%] animate-gradient-x transition-all duration-1000 delay-400 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                Products
              </span>
            </ParallaxScroll>
          </div>

          <p
            className={`text-xl text-muted-foreground text-pretty mb-12 max-w-2xl mx-auto transition-all duration-1000 delay-600 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Curated collection of high-quality products from trusted brands. Experience shopping redefined with
            CartifyX.
          </p>

          <div
            className={`flex flex-col sm:flex-row gap-6 justify-center mb-16 transition-all duration-1000 delay-800 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <Link href="/products">
              <MagneticButton
                size="lg"
                className="text-lg px-8 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 shadow-lg"
              >
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </MagneticButton>
            </Link>
            <Link href="/signup">
              <MagneticButton
                variant="outline"
                size="lg"
                className="text-lg px-8 bg-transparent backdrop-blur-sm border-primary/30 hover:bg-primary/10"
              >
                Create Account
              </MagneticButton>
            </Link>
          </div>

          <div
            className={`grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto transition-all duration-1000 delay-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="text-center group">
              <div className="flex items-center justify-center mb-2">
                <Star className="h-5 w-5 text-primary mr-2 group-hover:animate-spin" />
                <span className="text-2xl font-bold text-primary">
                  <AnimatedCounter value={4.9} duration={2000} />
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Average Rating</p>
            </div>

            <div className="text-center group">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-5 w-5 text-primary mr-2 group-hover:animate-bounce" />
                <span className="text-2xl font-bold text-primary">
                  <AnimatedCounter value={10000} duration={2500} />+
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Happy Customers</p>
            </div>

            <div className="text-center group">
              <div className="flex items-center justify-center mb-2">
                <Package className="h-5 w-5 text-primary mr-2 group-hover:animate-pulse" />
                <span className="text-2xl font-bold text-primary">
                  <AnimatedCounter value={500} duration={2000} />+
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Products</p>
            </div>
          </div>
        </div>
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
    </section>
  )
}
