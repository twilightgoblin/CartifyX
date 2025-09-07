"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ShoppingBag } from "lucide-react"
import { useCart } from "@/hooks/use-cart"

export function CartSummary() {
  const { totalItems, totalPrice, cartItems } = useCart()

  const shipping = totalPrice > 8300 ? 0 : 829 // Free shipping over ₹8,300, otherwise ₹829
  const tax = totalPrice * 0.08 // 8% tax
  const finalTotal = totalPrice + shipping + tax

  if (cartItems.length === 0) {
    return null
  }

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Items ({totalItems})</span>
            <span>₹{totalPrice.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>{shipping === 0 ? "FREE" : `₹${shipping.toLocaleString('en-IN')}`}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <span>₹{tax.toLocaleString('en-IN')}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>₹{finalTotal.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {totalPrice < 8300 && (
          <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
            Add ₹{(8300 - totalPrice).toLocaleString('en-IN')} more for free shipping!
          </div>
        )}

        <Button className="w-full" size="lg">
          Proceed to Checkout
        </Button>

        <div className="text-xs text-muted-foreground text-center">Secure checkout powered by CartifyX</div>
      </CardContent>
    </Card>
  )
}
