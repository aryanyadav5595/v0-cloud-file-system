import { LoginForm } from "@/components/auth/login-form"
import { Cloud } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary to-accent p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-xl shadow-2xl border border-border p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-primary rounded-lg p-3 mb-4">
              <Cloud className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground text-balance">Welcome Back</h1>
            <p className="text-muted-foreground text-center mt-2">Sign in to access your cloud files and notes</p>
          </div>

          <LoginForm />

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">{"Don't have an account? "}</span>
            <Link href="/signup" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
