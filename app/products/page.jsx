"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ProductCard } from "@/components/products/product-card"
import { ProductFilters } from "@/components/products/product-filters"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { EmptyState } from "@/components/ui/empty-state"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Package } from "lucide-react"
import { dataService } from "@/lib/data-service"

export default function ProductsPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({})
  const router = useRouter()
  const searchParams = useSearchParams()

  const breadcrumbItems = [{ label: "Products" }]

  // Initialize filters from URL params
  useEffect(() => {
    const category = searchParams.get("category")
    if (category) {
      setFilters((prev) => ({ ...prev, category }))
      breadcrumbItems.push({ label: category })
    }
  }, [searchParams])

  useEffect(() => {
    const loadItems = async () => {
      setLoading(true)
      try {
        const data = await dataService.getItems(filters)
        setItems(data)
      } catch (error) {
        console.error("Failed to load items:", error)
      } finally {
        setLoading(false)
      }
    }

    loadItems()
  }, [filters])

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbItems} className="mb-6" />

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold">Our Products</h1>
            {filters.category && (
              <Badge variant="secondary" className="text-sm">
                {filters.category}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">Discover our curated collection of premium products</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <ProductFilters filters={filters} onFiltersChange={handleFiltersChange} />
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-square w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : items.length === 0 ? (
              <EmptyState
                icon={Package}
                title="No products found"
                description="We couldn't find any products matching your criteria. Try adjusting your filters or browse all products."
                action={{
                  label: "Clear Filters",
                  onClick: () => handleFiltersChange({}),
                }}
              />
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-muted-foreground">
                    Showing {items.length} product{items.length !== 1 ? "s" : ""}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {items.map((item) => (
                    <ProductCard key={item.id} item={item} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
