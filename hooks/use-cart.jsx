"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { dataService } from "@/lib/data-service"
import { useAuth } from "@/lib/auth-context"

const CartContext = createContext(undefined)

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null)
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const refreshCart = async () => {
    if (!user) {
      setCart(null)
      setCartItems([])
      return
    }

    setLoading(true)
    try {
      const userCart = await dataService.getCart(user.id)
      setCart(userCart)

      // Get item details for each cart item
      const itemsWithDetails = await Promise.all(
        userCart.items.map(async (cartItem) => {
          const item = await dataService.getItem(cartItem.itemId)
          return item ? { item, quantity: cartItem.quantity } : null
        }),
      )

      setCartItems(itemsWithDetails.filter(Boolean))
    } catch (error) {
      console.error("Failed to refresh cart:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshCart()
  }, [user])

  const addToCart = async (itemId, quantity = 1) => {
    if (!user) throw new Error("User not authenticated")

    setLoading(true)
    try {
      await dataService.addToCart(user.id, itemId, quantity)
      await refreshCart()
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const removeFromCart = async (itemId) => {
    if (!user) throw new Error("User not authenticated")

    setLoading(true)
    try {
      await dataService.removeFromCart(user.id, itemId)
      await refreshCart()
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId, quantity) => {
    if (!user) throw new Error("User not authenticated")

    setLoading(true)
    try {
      await dataService.updateCartItemQuantity(user.id, itemId, quantity)
      await refreshCart()
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cartItems.reduce((sum, item) => sum + item.item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cart,
        cartItems,
        totalItems,
        totalPrice,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
