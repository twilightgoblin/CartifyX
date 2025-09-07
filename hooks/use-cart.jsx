"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { dataService } from "@/lib/data-service"
import { useAuth } from "@/lib/auth-context"

const CartContext = createContext(undefined)

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null)
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(false)
  const { user, token } = useAuth()   // 👈 make sure your auth context returns token

  const refreshCart = async () => {
    setLoading(true)
    try {
      let userCart
      if (token) {
        userCart = await dataService.getCart(token)
      } else if (user) {
        userCart = await dataService.getCartByUser(user.id)
      } else {
        userCart = { items: [] }
      }

      setCart(userCart)

      // Map each cartItem to full product details
      const itemsWithDetails = await Promise.all(
        (userCart.items || []).map(async (cartItem) => {
          const item = await dataService.getItem(cartItem.productId || cartItem.itemId) // handle both
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
  }, [token]) // refresh cart whenever token changes

  const addToCart = async (itemId, quantity = 1) => {
    setLoading(true)
    try {
      if (token) {
        await dataService.addToCart(token, itemId, quantity)
      } else if (user) {
        await dataService.addToCartByUser(user.id, itemId, quantity)
      } else {
        throw new Error("User not authenticated")
      }
      await refreshCart()
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const removeFromCart = async (itemId) => {
    setLoading(true)
    try {
      if (token) {
        await dataService.removeFromCart(token, itemId)
      } else if (user) {
        await dataService.removeFromCartByUser(user.id, itemId)
      } else {
        throw new Error("User not authenticated")
      }
      await refreshCart()
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId, quantity) => {
    setLoading(true)
    try {
      if (token) {
        await dataService.updateCartItemQuantity(token, itemId, quantity)
      } else if (user) {
        await dataService.updateCartItemQuantityByUser(user.id, itemId, quantity)
      } else {
        throw new Error("User not authenticated")
      }
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
