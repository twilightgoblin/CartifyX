"use client"

import { useState, useEffect } from "react"
import { dataService } from "@/lib/data-service"
import { useAuth } from "@/lib/auth-context"

export function useOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      loadOrders()
    }
  }, [user])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const userOrders = await dataService.getOrdersByUser(user.id)
      setOrders(userOrders)
    } catch (error) {
      console.error("Failed to load orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const createOrder = async (cartItems, totalAmount) => {
    try {
      const order = await dataService.createOrder(user.id, cartItems, totalAmount)
      await loadOrders() // Refresh orders list
      return order
    } catch (error) {
      console.error("Failed to create order:", error)
      throw error
    }
  }

  return {
    orders,
    loading,
    createOrder,
    loadOrders
  }
}
