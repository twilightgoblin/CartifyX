"use client"

import { useAuth } from "@/lib/auth-context"
import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MobileNav } from "./mobile-nav"
import { ShoppingCart, LayoutDashboard, LogOut } from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export function Header() {
  const { user, logout } = useAuth()
  const { totalItems } = useCart()

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo and mobile nav */}
        <div className="flex items-center space-x-4">
          <MobileNav />
          <Link href="/" className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-primary">CartifyX</h1>
          </Link>
        </div>

        {/* Main nav */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-foreground hover:text-primary transition-colors font-medium">
            Home
          </Link>
          <Link href="/products" className="text-foreground hover:text-primary transition-colors font-medium">
            Products
          </Link>
        </nav>

        {/* User / Cart section */}
        <div className="flex items-center space-x-4">
  {user ? (
    <>
      {/* Cart icon */}
      <Link href="/cart">
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs animate-pulse">
              {totalItems}
            </Badge>
          )}
        </Button>
      </Link>

      {/* Desktop dropdown */}
      <div className="hidden md:block">
       <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon" className="rounded-full">
      <Avatar className="h-8 w-8">
        <AvatarImage src={user.avatarUrl || "/placeholder-user.jpg"} alt={user.name} />
        <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
      </Avatar>
    </Button>
  </DropdownMenuTrigger>

  <DropdownMenuContent align="end" forceMount>
    <DropdownMenuItem disabled>
      <div className="flex flex-col">
        <span className="font-medium">{user.name}</span>
        <span className="text-xs text-muted-foreground">{user.email}</span>
      </div>
    </DropdownMenuItem>

    <DropdownMenuSeparator />

    <Link href="/dashboard">
      <DropdownMenuItem>
        <LayoutDashboard className="mr-2 h-4 w-4" />
        Dashboard
      </DropdownMenuItem>
    </Link>

    <DropdownMenuSeparator />

    <DropdownMenuItem onClick={logout}>
      <LogOut className="mr-2 h-4 w-4" />
      Sign out
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

      </div>

      {/* Mobile dropdown */}
      <div className="md:hidden">
        <MobileNav user={user} logout={logout} totalItems={totalItems} />
      </div>
    </>
  ) : (
    <div className="hidden md:flex items-center space-x-2">
      <Link href="/login">
        <Button variant="ghost">Sign In</Button>
      </Link>
      <Link href="/signup">
        <Button>Sign Up</Button>
      </Link>
    </div>
  )}
</div>

      </div>
    </header>
  )
}
