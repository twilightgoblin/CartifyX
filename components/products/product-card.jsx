"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { MorphingCard } from "@/components/ui/morphing-card"
import { CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Plus, Minus, Heart, Eye, Star } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { useToast } from "@/hooks/use-toast.js"

export function ProductCard({ item }) {
  const [quantity, setQuantity] = useState(1)
  const [imageLoaded, setImageLoaded] = useState(false)
  const { user } = useAuth()
  const { addToCart, loading } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { toast } = useToast()
  
  const isWishlisted = isInWishlist(item.id)

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add items to cart",
        variant: "destructive",
      })
      return
    }

    try {
      await addToCart(item.id, quantity)
      toast({
        title: "Added to cart",
        description: `${item.name} has been added to your cart`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      })
    }
  }

  const toggleWishlist = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to manage your wishlist",
        variant: "destructive",
      })
      return
    }

    try {
      if (isWishlisted) {
        await removeFromWishlist(item.id)
        toast({
          title: "Removed from wishlist",
          description: `${item.name} has been removed from your wishlist`,
        })
      } else {
        await addToWishlist(item.id)
        toast({
          title: "Added to wishlist",
          description: `${item.name} has been added to your wishlist`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update wishlist",
        variant: "destructive",
      })
    }
  }

  return (
    <MorphingCard className="group overflow-hidden h-full flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted/20">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-muted/30 to-muted/10 animate-pulse flex items-center justify-center">
            <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        )}
        <Image
          src={item.imageUrl || "/placeholder.svg"}
          alt={item.name}
          fill
          className={`object-contain p-4 transition-all duration-700 group-hover:scale-105 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
          quality={85}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />

        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 backdrop-blur-sm bg-background/80 hover:bg-background shadow-lg"
            onClick={toggleWishlist}
          >
            <Heart className={`h-4 w-4 transition-colors ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 backdrop-blur-sm bg-background/80 hover:bg-background shadow-lg"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>

        <Badge className="absolute top-3 left-3 bg-primary/90 text-primary-foreground backdrop-blur-sm border-0 transform -translate-x-2 group-hover:translate-x-0 transition-transform duration-300">
          {item.category}
        </Badge>

        {item.stock < 10 && (
          <Badge variant="destructive" className="absolute bottom-3 left-3 animate-pulse">
            Only {item.stock} left!
          </Badge>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <CardContent className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">
          {item.name}
        </h3>

        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">(4.0)</span>
        </div>

        <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-1">{item.description}</p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-primary group-hover:scale-105 transition-transform duration-300">
              ₹{item.price.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-muted-foreground line-through">₹{(item.price * 1.2).toLocaleString('en-IN')}</span>
          </div>
          <div className="text-right">
            <span className="text-sm text-muted-foreground">Stock</span>
            <div className={`text-sm font-medium ${item.stock > 10 ? "text-green-600" : "text-orange-600"}`}>
              {item.stock} units
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="flex items-center gap-3 w-full">
          <div className="flex items-center border rounded-lg overflow-hidden bg-muted/30">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center bg-background">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => setQuantity(Math.min(item.stock, quantity + 1))}
              disabled={quantity >= item.stock}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <Button
            onClick={handleAddToCart}
            disabled={loading || item.stock === 0}
            className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {loading ? (
              <span className="flex items-center">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Adding...
              </span>
            ) : (
              "Add to Cart"
            )}
          </Button>
        </div>
      </CardFooter>
    </MorphingCard>
  )
}
