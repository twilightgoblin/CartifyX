"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/components/products/product-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { dataService } from "@/lib/data-service"

export function FeaturedProducts() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadFeaturedItems = async () => {
      try {
        const allItems = await dataService.getItems()
        // Show first 6 items as featured
        setItems(allItems.slice(0, 6))
      } catch (error) {
        console.error("Failed to load featured items:", error)
      } finally {
        setLoading(false)
      }
    }

    loadFeaturedItems()
  }, [])

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Handpicked selection of our most popular and trending items
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-square w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {items.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        )}

        <div className="text-center">
          <Link href="/products">
            <Button size="lg" variant="outline">
              View All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
