import { SignupForm } from "@/components/auth/signup-form"
import { Footer } from "@/components/layout/footer"

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-muted/20">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">CartifyX</h1>
            <p className="text-muted-foreground">Premium E-commerce Experience</p>
          </div>
          <SignupForm />
        </div>
      </div>
      <Footer />
    </div>
  )
}
