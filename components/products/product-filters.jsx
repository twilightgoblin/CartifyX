"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Search, X } from "lucide-react"
import { dataService } from "@/lib/data-service"

export function ProductFilters({ filters, onFiltersChange }) {
  const [categories, setCategories] = useState([])
  const [priceRange, setPriceRange] = useState([0, 500])
  const [searchTerm, setSearchTerm] = useState(filters.search || "")

  useEffect(() => {
    const loadCategories = async () => {
      const cats = dataService.getCategories()
      setCategories(cats)
    }
    loadCategories()
  }, [])

  useEffect(() => {
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      setPriceRange([filters.minPrice || 0, filters.maxPrice || 500])
    }
  }, [filters.minPrice, filters.maxPrice])

  const handleCategoryChange = (category) => {
    onFiltersChange({
      ...filters,
      category: category === "all" ? undefined : category,
    })
  }

  const handlePriceChange = (values) => {
    setPriceRange(values)
    onFiltersChange({
      ...filters,
      minPrice: values[0],
      maxPrice: values[1],
    })
  }

  const handleSearchChange = (value) => {
    setSearchTerm(value)
    onFiltersChange({
      ...filters,
      search: value || undefined,
    })
  }

  const clearFilters = () => {
    setSearchTerm("")
    setPriceRange([0, 500])
    onFiltersChange({})
  }

  const hasActiveFilters =
    filters.category || filters.search || filters.minPrice !== undefined || filters.maxPrice !== undefined

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg">Filters</CardTitle>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="mr-1 h-3 w-3" />
            Clear
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Search Products</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search by name or description..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={filters.category || "all"} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="space-y-4">
          <Label>Price Range</Label>
          <div className="px-2">
            <Slider
              value={priceRange}
              onValueChange={handlePriceChange}
              max={500}
              min={0}
              step={10}
              className="w-full"
            />
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>₹{priceRange[0].toLocaleString('en-IN')}</span>
            <span>₹{priceRange[1].toLocaleString('en-IN')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
