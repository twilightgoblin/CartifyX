"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  ShoppingBag, 
  Heart, 
  Package, 
  CreditCard, 
  Settings, 
  TrendingUp,
  Star,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Edit
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useCart } from "@/hooks/use-cart"
import { useOrders } from "@/hooks/use-orders"
import { useWishlist } from "@/hooks/use-wishlist"

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const { totalItems, totalPrice, cartItems } = useCart()
  const { orders, loading: ordersLoading } = useOrders()
  const { wishlistItems, loading: wishlistLoading } = useWishlist()
  const router = useRouter()

  const breadcrumbItems = [{ label: "Dashboard" }]

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  // Mock data for dashboard stats
  const stats = [
    {
      title: "Total Orders",
      value: orders.length.toString(),
      change: ordersLoading ? "Loading..." : `${orders.length} orders`,
      icon: ShoppingBag,
      color: "text-blue-600"
    },
    {
      title: "Wishlist Items",
      value: wishlistItems.length.toString(),
      change: wishlistLoading ? "Loading..." : `${wishlistItems.length} items`,
      icon: Heart,
      color: "text-red-600"
    },
    {
      title: "Cart Value",
      value: `₹${totalPrice.toLocaleString('en-IN')}`,
      change: `${totalItems} items`,
      icon: Package,
      color: "text-green-600"
    },
    {
      title: "Loyalty Points",
      value: "1,250",
      change: "+50 this month",
      icon: Star,
      color: "text-yellow-600"
    }
  ]

  // Get recent orders (last 3)
  const recentOrders = orders.slice(0, 3).map(order => ({
    id: order.id,
    date: new Date(order.createdAt).toLocaleDateString('en-IN'),
    status: order.status,
    total: order.totalAmount,
    items: order.items.length
  }))

  // Get wishlist items (first 3)
  const displayWishlistItems = wishlistItems.slice(0, 3)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <Breadcrumbs items={breadcrumbItems} />
        
        <div className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback className="text-lg">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
                  <p className="text-muted-foreground">Here's what's happening with your account</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.change}</p>
                    </div>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Orders */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <Package className="mr-2 h-5 w-5" />
                  Recent Orders
                </CardTitle>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No orders yet</p>
                      <p className="text-sm">Start shopping to see your orders here</p>
                    </div>
                  ) : (
                    recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{order.id}</p>
                          <p className="text-sm text-muted-foreground">{order.items} items • {order.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₹{order.total.toLocaleString('en-IN')}</p>
                        <Badge 
                          variant={order.status === 'Delivered' ? 'default' : order.status === 'Shipped' ? 'secondary' : 'outline'}
                          className="text-xs"
                        >
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Wishlist */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <Heart className="mr-2 h-5 w-5" />
                  Wishlist
                </CardTitle>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {displayWishlistItems.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No wishlist items yet</p>
                      <p className="text-sm">Add items to your wishlist to see them here</p>
                    </div>
                  ) : (
                    displayWishlistItems.map((wishlistItem) => (
                    <div key={wishlistItem.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                        <img 
                          src={wishlistItem.item?.imageUrl || "/placeholder.svg"} 
                          alt={wishlistItem.item?.name}
                          className="w-12 h-12 object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium line-clamp-1">{wishlistItem.item?.name}</p>
                        <p className="text-lg font-bold text-primary">₹{wishlistItem.item?.price?.toLocaleString('en-IN')}</p>
                      </div>
                      <Button size="sm" variant="outline">
                        Add to Cart
                      </Button>
                    </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="/products">
                  <Button variant="outline" className="w-full h-20 flex flex-col">
                    <ShoppingBag className="h-6 w-6 mb-2" />
                    Browse Products
                  </Button>
                </Link>
                <Link href="/cart">
                  <Button variant="outline" className="w-full h-20 flex flex-col">
                    <Package className="h-6 w-6 mb-2" />
                    View Cart
                  </Button>
                </Link>
                <Button variant="outline" className="w-full h-20 flex flex-col">
                  <CreditCard className="h-6 w-6 mb-2" />
                  Payment Methods
                </Button>
                <Button variant="outline" className="w-full h-20 flex flex-col">
                  <Settings className="h-6 w-6 mb-2" />
                  Account Settings
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Member Since</p>
                      <p className="font-medium">
                        {new Date(user.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Total Spent</p>
                      <p className="font-medium">₹45,250</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Star className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Loyalty Tier</p>
                      <p className="font-medium">Gold Member</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
