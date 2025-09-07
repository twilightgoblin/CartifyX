// Local data service for managing users, items, cart, wishlist, and orders
import axios from "axios";

const MOCK_ITEMS = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation",
    price: 24899, // $299.99 * 83
    category: "Electronics",
    imageUrl: "/premium-wireless-headphones.png",
    stock: 15,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Organic Cotton T-Shirt",
    description: "Comfortable organic cotton t-shirt in various colors",
    price: 2489, // $29.99 * 83
    category: "Clothing",
    imageUrl: "/organic-cotton-t-shirt.jpg",
    stock: 50,
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Smart Fitness Watch",
    description: "Advanced fitness tracking with heart rate monitor",
    price: 16599, // $199.99 * 83
    category: "Electronics",
    imageUrl: "/smart-fitness-watch.png",
    stock: 25,
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Leather Wallet",
    description: "Genuine leather wallet with RFID protection",
    price: 6639, // $79.99 * 83
    category: "Accessories",
    imageUrl: "/leather-wallet.png",
    stock: 30,
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Yoga Mat",
    description: "Non-slip yoga mat for all types of practice",
    price: 4149, // $49.99 * 83
    category: "Sports",
    imageUrl: "/rolled-yoga-mat.png",
    stock: 40,
    createdAt: new Date().toISOString(),
  },
  {
    id: "6",
    name: "Coffee Maker",
    description: "Programmable coffee maker with thermal carafe",
    price: 12449, // $149.99 * 83
    category: "Home",
    imageUrl: "/modern-coffee-maker.png",
    stock: 20,
    createdAt: new Date().toISOString(),
  },
]

class DataService {
  constructor() {
    this.USERS_KEY = "cartifyx_users"
    this.ITEMS_KEY = "cartifyx_items"
    this.ORDERS_KEY = "cartifyx_orders"
  this.CART_KEY = "cartifyx_carts"
    this.WISHLIST_KEY = "cartifyx_wishlist"
    this.CURRENT_USER_KEY = "cartifyx_current_user"
    this.initializeData()
  }

  initializeData() {
    if (typeof window === "undefined") return

    if (!localStorage.getItem(this.ITEMS_KEY)) {
      localStorage.setItem(this.ITEMS_KEY, JSON.stringify(MOCK_ITEMS))
    }

    if (!localStorage.getItem(this.USERS_KEY)) {
      localStorage.setItem(this.USERS_KEY, JSON.stringify([]))
    }

    if (!localStorage.getItem(this.ORDERS_KEY)) {
      localStorage.setItem(this.ORDERS_KEY, JSON.stringify([]))
    }

    if (!localStorage.getItem(this.WISHLIST_KEY)) {
      localStorage.setItem(this.WISHLIST_KEY, JSON.stringify([]))
    }
  }

  // ---------------- USER MANAGEMENT ----------------
  async signup(credentials) {
    if (typeof window === "undefined") return null
    const users = this.getUsers()

    if (users.find((u) => u.email === credentials.email)) {
      throw new Error("User already exists")
    }

    const newUser = {
      id: Date.now().toString(),
      email: credentials.email,
      password: credentials.password, // In production: hash this
      name: credentials.name,
      role: "user",
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users))

    const authUser = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    }

    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(authUser))
    return authUser
  }

  async login(credentials) {
    if (typeof window === "undefined") return null
    const users = this.getUsers()
    const user = users.find(
      (u) => u.email === credentials.email && u.password === credentials.password,
    )

    if (!user) {
      throw new Error("Invalid credentials")
    }

    const authUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    }

    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(authUser))
    return authUser
  }

  logout() {
    if (typeof window === "undefined") return
    localStorage.removeItem(this.CURRENT_USER_KEY)
  }

  getCurrentUser() {
    if (typeof window === "undefined") return null
    const userStr = localStorage.getItem(this.CURRENT_USER_KEY)
    return userStr ? JSON.parse(userStr) : null
  }

  // ---------------- ITEM MANAGEMENT ----------------
  async getItems(filters) {
    if (typeof window === "undefined") return MOCK_ITEMS
    let items = this.getStoredItems()

    if (filters) {
      if (filters.category) {
        items = items.filter((item) => item.category === filters.category)
      }
      if (filters.minPrice !== undefined) {
        items = items.filter((item) => item.price >= filters.minPrice)
      }
      if (filters.maxPrice !== undefined) {
        items = items.filter((item) => item.price <= filters.maxPrice)
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        items = items.filter(
          (item) =>
            item.name.toLowerCase().includes(searchLower) ||
            item.description.toLowerCase().includes(searchLower),
        )
      }
    }

    return items
  }

  async getItem(id) {
    if (typeof window === "undefined") return MOCK_ITEMS.find((item) => item.id === id) || null
    const items = this.getStoredItems()
    return items.find((item) => item.id === id) || null
  }

  getCategories() {
    if (typeof window === "undefined") return [...new Set(MOCK_ITEMS.map((item) => item.category))]
    const items = this.getStoredItems()
    return [...new Set(items.map((item) => item.category))]
  }

  // ---------------- BACKEND CART MANAGEMENT ----------------
  async getCart(token) {
    try {
      const res = await axios.get("/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      })
      return res.data
    } catch (error) {
      console.error("Error fetching cart:", error)
      return { items: [] }
    }
  }

  // Local (client-only) cart helpers keyed by userId
  async getCartByUser(userId) {
    if (typeof window === "undefined") return { items: [] }
    const cartsStr = localStorage.getItem(this.CART_KEY)
    const carts = cartsStr ? JSON.parse(cartsStr) : []
    const cart = carts.find((c) => c.userId === userId)
    return cart || { userId, items: [] }
  }

  async addToCartByUser(userId, itemId, quantity = 1) {
    if (typeof window === "undefined") return null
    const cartsStr = localStorage.getItem(this.CART_KEY)
    const carts = cartsStr ? JSON.parse(cartsStr) : []
    let cart = carts.find((c) => c.userId === userId)
    if (!cart) {
      cart = { userId, items: [] }
      carts.push(cart)
    }

    const existing = cart.items.find((i) => i.productId === itemId || i.itemId === itemId)
    if (existing) {
      existing.quantity = (existing.quantity || 0) + quantity
    } else {
      cart.items.push({ productId: itemId, quantity })
    }

    localStorage.setItem(this.CART_KEY, JSON.stringify(carts))
    return cart
  }

  async removeFromCartByUser(userId, itemId) {
    if (typeof window === "undefined") return null
    const cartsStr = localStorage.getItem(this.CART_KEY)
    const carts = cartsStr ? JSON.parse(cartsStr) : []
    const cart = carts.find((c) => c.userId === userId)
    if (!cart) return { items: [] }

    cart.items = cart.items.filter((i) => !(i.productId === itemId || i.itemId === itemId))
    localStorage.setItem(this.CART_KEY, JSON.stringify(carts))
    return cart
  }

  async updateCartItemQuantityByUser(userId, itemId, quantity) {
    if (typeof window === "undefined") return null
    const cartsStr = localStorage.getItem(this.CART_KEY)
    const carts = cartsStr ? JSON.parse(cartsStr) : []
    const cart = carts.find((c) => c.userId === userId)
    if (!cart) return { items: [] }

    const existing = cart.items.find((i) => i.productId === itemId || i.itemId === itemId)
    if (existing) {
      if (quantity <= 0) {
        cart.items = cart.items.filter((i) => !(i.productId === itemId || i.itemId === itemId))
      } else {
        existing.quantity = quantity
      }
    }

    localStorage.setItem(this.CART_KEY, JSON.stringify(carts))
    return cart
  }

  async addToCart(token, itemId, quantity = 1) {
    try {
      const res = await axios.post(
        "/api/cart",
        { productId: itemId, quantity },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      return res.data
    } catch (error) {
      console.error("Error adding to cart:", error)
      throw error
    }
  }

  async removeFromCart(token, itemId) {
    try {
      const res = await axios.delete(`/api/cart/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      return res.data
    } catch (error) {
      console.error("Error removing from cart:", error)
      throw error
    }
  }

  async updateCartItemQuantity(token, itemId, quantity) {
    try {
      const res = await axios.put(
        `/api/cart/${itemId}`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      return res.data
    } catch (error) {
      console.error("Error updating cart quantity:", error)
      throw error
    }
  }

  // ---------------- WISHLIST ----------------
  async getWishlist(userId) {
    if (typeof window === "undefined") return []
    const wishlistStr = localStorage.getItem(this.WISHLIST_KEY)
    const userWishlist = wishlistStr
      ? JSON.parse(wishlistStr).filter((w) => w.userId === userId)
      : []

    const items = this.getStoredItems()
    return userWishlist
      .map((wishlistItem) => {
        const item = items.find((i) => i.id === wishlistItem.itemId)
        return { ...wishlistItem, item }
      })
      .filter((wishlistItem) => wishlistItem.item)
  }

  // Compatibility wrapper expected by hooks/use-wishlist.jsx
  async getWishlistByUser(userId) {
    return this.getWishlist(userId)
  }

  async addToWishlist(userId, itemId) {
    if (typeof window === "undefined") return null
    const wishlistStr = localStorage.getItem(this.WISHLIST_KEY)
    const wishlist = wishlistStr ? JSON.parse(wishlistStr) : []

    // Avoid duplicates
    if (wishlist.find((w) => w.userId === userId && w.itemId === itemId)) {
      return null
    }

    const newEntry = {
      id: Date.now().toString(),
      userId,
      itemId,
      createdAt: new Date().toISOString(),
    }

    wishlist.push(newEntry)
    localStorage.setItem(this.WISHLIST_KEY, JSON.stringify(wishlist))
    return newEntry
  }

  async removeFromWishlist(userId, itemId) {
    if (typeof window === "undefined") return null
    const wishlistStr = localStorage.getItem(this.WISHLIST_KEY)
    const wishlist = wishlistStr ? JSON.parse(wishlistStr) : []

    const filtered = wishlist.filter((w) => !(w.userId === userId && w.itemId === itemId))
    localStorage.setItem(this.WISHLIST_KEY, JSON.stringify(filtered))
    return true
  }

  // ---------------- PRIVATE HELPERS ----------------
  getUsers() {
    if (typeof window === "undefined") return []
    const usersStr = localStorage.getItem(this.USERS_KEY)
    return usersStr ? JSON.parse(usersStr) : []
  }

  getStoredItems() {
    if (typeof window === "undefined") return MOCK_ITEMS
    const itemsStr = localStorage.getItem(this.ITEMS_KEY)
    return itemsStr ? JSON.parse(itemsStr) : []
  }
}

export const dataService = new DataService()
