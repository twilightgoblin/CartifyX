"use client"

import { useState, useEffect } from "react"
import { dataService } from "@/lib/data-service"
import { useAuth } from "@/lib/auth-context"

export function useWishlist() {
  const [wishlistItems, setWishlistItems] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      loadWishlist()
    }
  }, [user])

  const loadWishlist = async () => {
    try {
      setLoading(true)
      const wishlist = await dataService.getWishlistByUser(user.id)
      setWishlistItems(wishlist)
    } catch (error) {
      console.error("Failed to load wishlist:", error)
    } finally {
      setLoading(false)
    }
  }

  const addToWishlist = async (itemId) => {
    try {
      await dataService.addToWishlist(user.id, itemId)
      await loadWishlist() // Refresh wishlist
    } catch (error) {
      console.error("Failed to add to wishlist:", error)
      throw error
    }
  }

  const removeFromWishlist = async (itemId) => {
    try {
      await dataService.removeFromWishlist(user.id, itemId)
      await loadWishlist() // Refresh wishlist
    } catch (error) {
      console.error("Failed to remove from wishlist:", error)
      throw error
    }
  }

  const isInWishlist = (itemId) => {
    return wishlistItems.some(item => item.itemId === itemId)
  }

  return {
    wishlistItems,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    loadWishlist
  }
}
