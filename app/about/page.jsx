import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, Users, Award, Truck } from "lucide-react"

export default function AboutPage() {
  const breadcrumbItems = [{ label: "About Us" }]

  const features = [
    {
      icon: ShoppingBag,
      title: "Premium Products",
      description: "Curated selection of high-quality products from trusted brands worldwide.",
    },
    {
      icon: Users,
      title: "Customer First",
      description: "Dedicated customer service team available 24/7 to assist with your needs.",
    },
    {
      icon: Award,
      title: "Quality Guarantee",
      description: "Every product comes with our quality guarantee and hassle-free returns.",
    },
    {
      icon: Truck,
      title: "Fast Shipping",
      description: "Quick and reliable shipping with tracking for all your orders.",
    },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbItems} className="mb-6" />

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4">About CartifyX</Badge>
            <h1 className="text-4xl font-bold mb-4">Redefining E-commerce Excellence</h1>
            <p className="text-xl text-muted-foreground">
              Since 2020, we've been committed to providing exceptional shopping experiences with premium products and
              outstanding service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <h2>Our Story</h2>
            <p>
              CartifyX was founded with a simple mission: to create the most enjoyable and trustworthy online shopping
              experience. We believe that shopping should be more than just a transaction – it should be a journey of
              discovery, quality, and satisfaction.
            </p>

            <h2>Our Values</h2>
            <p>
              We are committed to transparency, quality, and customer satisfaction. Every product in our catalog is
              carefully selected and vetted to ensure it meets our high standards. We work directly with manufacturers
              and authorized distributors to guarantee authenticity and quality.
            </p>

            <h2>Looking Forward</h2>
            <p>
              As we continue to grow, our focus remains on innovation and customer experience. We're constantly
              exploring new ways to make shopping more convenient, secure, and enjoyable for our customers around the
              world.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
