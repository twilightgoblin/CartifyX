// Local data service for managing users, items, and cart data

// Mock data for items (prices in Indian Rupees)
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
    this.CARTS_KEY = "cartifyx_carts"
    this.ORDERS_KEY = "cartifyx_orders"
    this.WISHLIST_KEY = "cartifyx_wishlist"
    this.CURRENT_USER_KEY = "cartifyx_current_user"
    this.initializeData()
  }

  initializeData() {
    // Only initialize if we're in the browser
    if (typeof window === 'undefined') return

    // Initialize items if not exists
    if (!localStorage.getItem(this.ITEMS_KEY)) {
      localStorage.setItem(this.ITEMS_KEY, JSON.stringify(MOCK_ITEMS))
    }

    // Initialize users if not exists
    if (!localStorage.getItem(this.USERS_KEY)) {
      localStorage.setItem(this.USERS_KEY, JSON.stringify([]))
    }

    // Initialize carts if not exists
    if (!localStorage.getItem(this.CARTS_KEY)) {
      localStorage.setItem(this.CARTS_KEY, JSON.stringify([]))
    }

    // Initialize orders if not exists
    if (!localStorage.getItem(this.ORDERS_KEY)) {
      localStorage.setItem(this.ORDERS_KEY, JSON.stringify([]))
    }

    // Initialize wishlist if not exists
    if (!localStorage.getItem(this.WISHLIST_KEY)) {
      localStorage.setItem(this.WISHLIST_KEY, JSON.stringify([]))
    }
  }

  // User management
  async signup(credentials) {
    if (typeof window === 'undefined') return null
    const users = this.getUsers()

    // Check if user already exists
    if (users.find((u) => u.email === credentials.email)) {
      throw new Error("User already exists")
    }

    const newUser = {
      id: Date.now().toString(),
      email: credentials.email,
      password: credentials.password, // In production, hash this
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
    if (typeof window === 'undefined') return null
    const users = this.getUsers()
    const user = users.find((u) => u.email === credentials.email && u.password === credentials.password)

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
    if (typeof window === 'undefined') return
    localStorage.removeItem(this.CURRENT_USER_KEY)
  }

  getCurrentUser() {
    if (typeof window === 'undefined') return null
    const userStr = localStorage.getItem(this.CURRENT_USER_KEY)
    return userStr ? JSON.parse(userStr) : null
  }

  // Item management
  async getItems(filters) {
    if (typeof window === 'undefined') return MOCK_ITEMS
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
            item.name.toLowerCase().includes(searchLower) || item.description.toLowerCase().includes(searchLower),
        )
      }
    }

    return items
  }

  async getItem(id) {
    if (typeof window === 'undefined') return MOCK_ITEMS.find((item) => item.id === id) || null
    const items = this.getStoredItems()
    return items.find((item) => item.id === id) || null
  }

  getCategories() {
    if (typeof window === 'undefined') return [...new Set(MOCK_ITEMS.map((item) => item.category))]
    const items = this.getStoredItems()
    return [...new Set(items.map((item) => item.category))]
  }

  // Cart management
  async getCart(userId) {
    if (typeof window === 'undefined') return { userId, items: [], updatedAt: new Date().toISOString() }
    const carts = this.getCarts()
    let cart = carts.find((c) => c.userId === userId)

    if (!cart) {
      cart = {
        userId,
        items: [],
        updatedAt: new Date().toISOString(),
      }
      carts.push(cart)
      localStorage.setItem(this.CARTS_KEY, JSON.stringify(carts))
    }

    return cart
  }

  async addToCart(userId, itemId, quantity = 1) {
    if (typeof window === 'undefined') return { userId, items: [], updatedAt: new Date().toISOString() }
    const carts = this.getCarts()
    let cart = carts.find((c) => c.userId === userId)

    if (!cart) {
      cart = {
        userId,
        items: [],
        updatedAt: new Date().toISOString(),
      }
      carts.push(cart)
    }

    const existingItem = cart.items.find((item) => item.itemId === itemId)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      const cartItem = {
        id: Date.now().toString(),
        itemId,
        userId,
        quantity,
        addedAt: new Date().toISOString(),
      }
      cart.items.push(cartItem)
    }

    cart.updatedAt = new Date().toISOString()
    localStorage.setItem(this.CARTS_KEY, JSON.stringify(carts))

    return cart
  }

  async removeFromCart(userId, itemId) {
    if (typeof window === 'undefined') return { userId, items: [], updatedAt: new Date().toISOString() }
    const carts = this.getCarts()
    const cart = carts.find((c) => c.userId === userId)

    if (cart) {
      cart.items = cart.items.filter((item) => item.itemId !== itemId)
      cart.updatedAt = new Date().toISOString()
      localStorage.setItem(this.CARTS_KEY, JSON.stringify(carts))
    }

    return cart || { userId, items: [], updatedAt: new Date().toISOString() }
  }

  async updateCartItemQuantity(userId, itemId, quantity) {
    if (typeof window === 'undefined') return { userId, items: [], updatedAt: new Date().toISOString() }
    const carts = this.getCarts()
    const cart = carts.find((c) => c.userId === userId)

    if (cart) {
      const item = cart.items.find((item) => item.itemId === itemId)
      if (item) {
        if (quantity <= 0) {
          cart.items = cart.items.filter((item) => item.itemId !== itemId)
        } else {
          item.quantity = quantity
        }
        cart.updatedAt = new Date().toISOString()
        localStorage.setItem(this.CARTS_KEY, JSON.stringify(carts))
      }
    }

    return cart || { userId, items: [], updatedAt: new Date().toISOString() }
  }

  // Private helper methods
  getUsers() {
    if (typeof window === 'undefined') return []
    const usersStr = localStorage.getItem(this.USERS_KEY)
    return usersStr ? JSON.parse(usersStr) : []
  }

  getStoredItems() {
    if (typeof window === 'undefined') return MOCK_ITEMS
    const itemsStr = localStorage.getItem(this.ITEMS_KEY)
    return itemsStr ? JSON.parse(itemsStr) : []
  }

  getCarts() {
    if (typeof window === 'undefined') return []
    const cartsStr = localStorage.getItem(this.CARTS_KEY)
    return cartsStr ? JSON.parse(cartsStr) : []
  }

  getOrders() {
    if (typeof window === 'undefined') return []
    const ordersStr = localStorage.getItem(this.ORDERS_KEY)
    return ordersStr ? JSON.parse(ordersStr) : []
  }

  getWishlist() {
    if (typeof window === 'undefined') return []
    const wishlistStr = localStorage.getItem(this.WISHLIST_KEY)
    return wishlistStr ? JSON.parse(wishlistStr) : []
  }

  // Order management
  async createOrder(userId, cartItems, totalAmount) {
    if (typeof window === 'undefined') return null
    const orders = this.getOrders()
    
    const order = {
      id: `ORD-${Date.now()}`,
      userId,
      items: cartItems.map(item => ({
        itemId: item.itemId,
        quantity: item.quantity,
        price: item.item?.price || 0
      })),
      totalAmount,
      status: 'Processing',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    orders.push(order)
    localStorage.setItem(this.ORDERS_KEY, JSON.stringify(orders))
    return order
  }

  async getOrdersByUser(userId) {
    if (typeof window === 'undefined') return []
    const orders = this.getOrders()
    return orders.filter(order => order.userId === userId)
  }

  // Wishlist management
  async addToWishlist(userId, itemId) {
    if (typeof window === 'undefined') return null
    const wishlist = this.getWishlist()
    
    const existingItem = wishlist.find(item => item.userId === userId && item.itemId === itemId)
    if (existingItem) {
      return existingItem
    }

    const wishlistItem = {
      id: Date.now().toString(),
      userId,
      itemId,
      addedAt: new Date().toISOString()
    }

    wishlist.push(wishlistItem)
    localStorage.setItem(this.WISHLIST_KEY, JSON.stringify(wishlist))
    return wishlistItem
  }

  async removeFromWishlist(userId, itemId) {
    if (typeof window === 'undefined') return null
    const wishlist = this.getWishlist()
    const filteredWishlist = wishlist.filter(item => !(item.userId === userId && item.itemId === itemId))
    localStorage.setItem(this.WISHLIST_KEY, JSON.stringify(filteredWishlist))
    return true
  }

  async getWishlistByUser(userId) {
    if (typeof window === 'undefined') return []
    const wishlist = this.getWishlist()
    const userWishlist = wishlist.filter(item => item.userId === userId)
    
    // Get full item details
    const items = this.getStoredItems()
    return userWishlist.map(wishlistItem => {
      const item = items.find(i => i.id === wishlistItem.itemId)
      return {
        ...wishlistItem,
        item
      }
    }).filter(wishlistItem => wishlistItem.item) // Filter out items that no longer exist
  }
}

export const dataService = new DataService()
