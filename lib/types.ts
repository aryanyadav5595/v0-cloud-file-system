export interface User {
  id: string
  email: string
  passwordHash: string
  name: string
  createdAt: string
}

export interface FileMetadata {
  id: string
  userId: string
  fileName: string
  fileSize: number
  contentType: string
  blobUrl: string
  folderId?: string
  createdAt: string
  updatedAt: string
}

export interface Note {
  id: string
  userId: string
  title: string
  content: string
  tags?: string[]
  createdAt: string
  updatedAt: string
}

export interface Folder {
  id: string
  userId: string
  name: string
  parentFolderId?: string
  createdAt: string
}
