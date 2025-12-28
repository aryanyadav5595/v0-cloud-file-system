"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Cloud, LayoutDashboard, FileIcon, StickyNote, LogOut, Loader2, Plus, HardDrive } from "lucide-react"
import { FileUpload } from "@/components/files/file-upload"
import { FileList } from "@/components/files/file-list"
import { NoteList } from "@/components/notes/note-list"
import { NoteDialog } from "@/components/notes/note-dialog"
import { StatsCard } from "@/components/dashboard/stats-card"
import { useToast } from "@/hooks/use-toast"

export default function AppPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [userName, setUserName] = useState("")
  const [activeTab, setActiveTab] = useState("dashboard")
  const [fileRefresh, setFileRefresh] = useState(0)
  const [noteRefresh, setNoteRefresh] = useState(0)
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false)
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalNotes: 0,
    totalStorage: "0 MB",
  })
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await fetch("/api/auth/me")
        if (!userResponse.ok) {
          router.push("/login")
          return
        }
        const userData = await userResponse.json()
        setUserName(userData.user.name)
        await fetchStats()
      } catch (error) {
        router.push("/login")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  const fetchStats = async () => {
    try {
      const [filesResponse, notesResponse] = await Promise.all([fetch("/api/files"), fetch("/api/notes")])

      if (filesResponse.ok) {
        const filesData = await filesResponse.json()
        const totalSize = filesData.files.reduce((acc: number, file: { fileSize: number }) => acc + file.fileSize, 0)
        setStats((prev) => ({
          ...prev,
          totalFiles: filesData.files.length,
          totalStorage: formatFileSize(totalSize),
        }))
      }

      if (notesResponse.ok) {
        const notesData = await notesResponse.json()
        setStats((prev) => ({
          ...prev,
          totalNotes: notesData.notes.length,
        }))
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 MB"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/login")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      })
    }
  }

  const handleFileUpload = () => {
    setFileRefresh((prev) => prev + 1)
    fetchStats()
  }

  const handleNoteCreated = () => {
    setIsNoteDialogOpen(false)
    setNoteRefresh((prev) => prev + 1)
    fetchStats()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary rounded-lg p-2">
              <Cloud className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="font-bold text-xl">CloudFiles</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:inline">Welcome, {userName}</span>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="dashboard" className="gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="files" className="gap-2">
              <FileIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Files</span>
            </TabsTrigger>
            <TabsTrigger value="notes" className="gap-2">
              <StickyNote className="h-4 w-4" />
              <span className="hidden sm:inline">Notes</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Welcome back, {userName}!</h2>
              <p className="text-muted-foreground">Here's an overview of your cloud storage</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <StatsCard
                title="Total Files"
                value={stats.totalFiles}
                icon={FileIcon}
                description="Files stored in cloud"
              />
              <StatsCard title="Total Notes" value={stats.totalNotes} icon={StickyNote} description="Notes created" />
              <StatsCard
                title="Storage Used"
                value={stats.totalStorage}
                icon={HardDrive}
                description="Space utilized"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Quick Actions</h3>
                </div>
                <div className="grid gap-3">
                  <Button onClick={() => setActiveTab("files")} variant="outline" className="justify-start h-auto py-4">
                    <FileIcon className="mr-3 h-5 w-5" />
                    <div className="text-left">
                      <div className="font-medium">Manage Files</div>
                      <div className="text-sm text-muted-foreground">Upload and organize your files</div>
                    </div>
                  </Button>
                  <Button onClick={() => setActiveTab("notes")} variant="outline" className="justify-start h-auto py-4">
                    <StickyNote className="mr-3 h-5 w-5" />
                    <div className="text-left">
                      <div className="font-medium">Create Note</div>
                      <div className="text-sm text-muted-foreground">Write and organize your notes</div>
                    </div>
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Files Tab */}
          <TabsContent value="files" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">Files</h2>
                <p className="text-sm text-muted-foreground">Upload and manage your cloud files</p>
              </div>
            </div>

            <FileUpload onUploadComplete={handleFileUpload} />
            <FileList refreshTrigger={fileRefresh} />
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">Notes</h2>
                <p className="text-sm text-muted-foreground">Create and organize your notes</p>
              </div>
              <Button onClick={() => setIsNoteDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                New Note
              </Button>
            </div>

            <NoteList refreshTrigger={noteRefresh} />
          </TabsContent>
        </Tabs>
      </main>

      <NoteDialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen} onSuccess={handleNoteCreated} />
    </div>
  )
}
