"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Home, Package, ShoppingCart, User, LogOut } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useCart } from "@/hooks/use-cart"
import { Badge } from "@/components/ui/badge"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()
  const { totalItems } = useCart()

  const handleLinkClick = () => {
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <div className="flex flex-col h-full">
          <div className="flex items-center space-x-2 mb-8">
            <h2 className="text-xl font-bold text-primary">CartifyX</h2>
          </div>

          <nav className="flex-1 space-y-2">
            <Link href="/" onClick={handleLinkClick}>
              <Button variant="ghost" className="w-full justify-start">
                <Home className="mr-3 h-4 w-4" />
                Home
              </Button>
            </Link>

            <Link href="/products" onClick={handleLinkClick}>
              <Button variant="ghost" className="w-full justify-start">
                <Package className="mr-3 h-4 w-4" />
                Products
              </Button>
            </Link>

            {user && (
              <Link href="/cart" onClick={handleLinkClick}>
                <Button variant="ghost" className="w-full justify-start relative">
                  <ShoppingCart className="mr-3 h-4 w-4" />
                  Cart
                  {totalItems > 0 && (
                    <Badge className="ml-auto h-5 w-5 flex items-center justify-center p-0 text-xs">{totalItems}</Badge>
                  )}
                </Button>
              </Link>
            )}
          </nav>

          <div className="border-t pt-4 space-y-2">
            {user ? (
              <>
                <div className="px-3 py-2 text-sm text-muted-foreground">Signed in as {user.name}</div>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    logout()
                    handleLinkClick()
                  }}
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={handleLinkClick}>
                  <Button variant="ghost" className="w-full justify-start">
                    <User className="mr-3 h-4 w-4" />
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup" onClick={handleLinkClick}>
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
