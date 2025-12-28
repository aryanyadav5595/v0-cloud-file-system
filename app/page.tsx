import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Cloud, FileUp, StickyNote, Shield, ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-accent">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary rounded-lg p-2">
              <Cloud className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="font-bold text-xl">CloudFiles</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-5xl font-bold mb-6 text-balance">Your Files and Notes, Securely in the Cloud</h2>
          <p className="text-xl text-muted-foreground mb-8 text-pretty">
            Store, organize, and manage your files and notes with enterprise-grade security powered by Azure cloud
            infrastructure.
          </p>
          <Button size="lg" asChild>
            <Link href="/signup">
              Start for Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>

        {/* Features */}
        <div className="grid gap-8 md:grid-cols-3 mt-20">
          <div className="bg-card p-8 rounded-xl border border-border">
            <div className="bg-primary/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
              <FileUp className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Cloud Storage</h3>
            <p className="text-muted-foreground">
              Upload and store any file type securely. Access your files from anywhere, anytime.
            </p>
          </div>

          <div className="bg-card p-8 rounded-xl border border-border">
            <div className="bg-primary/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
              <StickyNote className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Smart Notes</h3>
            <p className="text-muted-foreground">
              Create and organize notes with tags. Keep your thoughts and ideas synchronized across devices.
            </p>
          </div>

          <div className="bg-card p-8 rounded-xl border border-border">
            <div className="bg-primary/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
              <Shield className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Enterprise Security</h3>
            <p className="text-muted-foreground">
              Your data is protected with Azure-grade encryption and security. Built for privacy and compliance.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <p className="text-center text-sm text-muted-foreground">
            © 2025 CloudFiles. Built with Azure Blob Storage and Cosmos DB.
          </p>
        </div>
      </footer>
    </div>
  )
}
