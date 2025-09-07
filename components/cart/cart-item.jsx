"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Minus, Plus, Trash2 } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast.js"

export function CartItem({ item, quantity }) {
  const [updating, setUpdating] = useState(false)
  const { updateQuantity, removeFromCart } = useCart()
  const { toast } = useToast()

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1 || newQuantity > item.stock) return

    setUpdating(true)
    try {
      await updateQuantity(item.id, newQuantity)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
    }
  }

  const handleRemove = async () => {
    setUpdating(true)
    try {
      await removeFromCart(item.id)
      toast({
        title: "Removed from cart",
        description: `${item.name} has been removed from your cart`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="relative w-20 h-20 flex-shrink-0">
            <Image 
              src={item.imageUrl || "/placeholder.svg"} 
              alt={item.name} 
              fill 
              className="object-cover rounded-md" 
              sizes="80px"
              quality={75}
              priority={false}
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg mb-1 truncate">{item.name}</h3>
            <p className="text-muted-foreground text-sm mb-2 line-clamp-2">{item.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-primary">₹{item.price.toLocaleString('en-IN')}</span>
              <span className="text-sm text-muted-foreground">Stock: {item.stock}</span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRemove}
              disabled={updating}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>

            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={updating || quantity <= 1}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={updating || quantity >= item.stock}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            <div className="text-right">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <div className="font-bold">₹{(item.price * quantity).toLocaleString('en-IN')}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
