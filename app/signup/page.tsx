import { SignupForm } from "@/components/auth/signup-form"
import { Cloud } from "lucide-react"
import Link from "next/link"

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary to-accent p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-xl shadow-2xl border border-border p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-primary rounded-lg p-3 mb-4">
              <Cloud className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground text-balance">Create Account</h1>
            <p className="text-muted-foreground text-center mt-2">Get started with secure cloud storage</p>
          </div>

          <SignupForm />

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link href="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
