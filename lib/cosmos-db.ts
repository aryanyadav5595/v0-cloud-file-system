import { CosmosClient, type Database } from "@azure/cosmos"

let cosmosClient: CosmosClient | null = null
let database: Database | null = null

export function getCosmosClient() {
  if (!cosmosClient) {
    const endpoint = process.env.AZURE_COSMOS_ENDPOINT
    const key = process.env.AZURE_COSMOS_KEY

    if (!endpoint || !key) {
      throw new Error("AZURE_COSMOS_ENDPOINT and AZURE_COSMOS_KEY must be defined")
    }

    cosmosClient = new CosmosClient({ endpoint, key })
  }

  return cosmosClient
}

export async function getDatabase() {
  if (!database) {
    const client = getCosmosClient()
    const databaseId = process.env.AZURE_COSMOS_DATABASE_ID || "CloudFileSystemDB"

    const { database: db } = await client.databases.createIfNotExists({
      id: databaseId,
    })

    database = db
  }

  return database
}

export async function getContainer(containerId: string) {
  const db = await getDatabase()

  const { container } = await db.containers.createIfNotExists({
    id: containerId,
    partitionKey: { paths: ["/userId"] },
  })

  return container
}

// User operations
export async function createUser(user: {
  id: string
  email: string
  passwordHash: string
  name: string
  createdAt: string
}) {
  const container = await getContainer("users")
  const userWithPartition = { ...user, userId: user.id }

  const { resource } = await container.items.create(userWithPartition)
  return resource
}

export async function getUserByEmail(email: string) {
  const container = await getContainer("users")

  const { resources } = await container.items
    .query({
      query: "SELECT * FROM c WHERE c.email = @email",
      parameters: [{ name: "@email", value: email }],
    })
    .fetchAll()

  return resources[0] || null
}

export async function getUserById(userId: string) {
  const container = await getContainer("users")

  try {
    const { resource } = await container.item(userId, userId).read()
    return resource
  } catch (error) {
    return null
  }
}

// File metadata operations
export async function createFileMetadata(file: {
  id: string
  userId: string
  fileName: string
  fileSize: number
  contentType: string
  blobUrl: string
  folderId?: string
  createdAt: string
  updatedAt: string
}) {
  const container = await getContainer("files")

  const { resource } = await container.items.create(file)
  return resource
}

export async function getFilesByUserId(userId: string) {
  const container = await getContainer("files")

  const { resources } = await container.items
    .query({
      query: "SELECT * FROM c WHERE c.userId = @userId ORDER BY c.createdAt DESC",
      parameters: [{ name: "@userId", value: userId }],
    })
    .fetchAll()

  return resources
}

export async function getFileById(fileId: string, userId: string) {
  const container = await getContainer("files")

  try {
    const { resource } = await container.item(fileId, userId).read()
    return resource
  } catch (error) {
    return null
  }
}

export async function deleteFileMetadata(fileId: string, userId: string) {
  const container = await getContainer("files")

  await container.item(fileId, userId).delete()
}

// Note operations
export async function createNote(note: {
  id: string
  userId: string
  title: string
  content: string
  tags?: string[]
  createdAt: string
  updatedAt: string
}) {
  const container = await getContainer("notes")

  const { resource } = await container.items.create(note)
  return resource
}

export async function getNotesByUserId(userId: string) {
  const container = await getContainer("notes")

  const { resources } = await container.items
    .query({
      query: "SELECT * FROM c WHERE c.userId = @userId ORDER BY c.updatedAt DESC",
      parameters: [{ name: "@userId", value: userId }],
    })
    .fetchAll()

  return resources
}

export async function getNoteById(noteId: string, userId: string) {
  const container = await getContainer("notes")

  try {
    const { resource } = await container.item(noteId, userId).read()
    return resource
  } catch (error) {
    return null
  }
}

export async function updateNote(
  noteId: string,
  userId: string,
  updates: {
    title?: string
    content?: string
    tags?: string[]
    updatedAt: string
  },
) {
  const container = await getContainer("notes")

  const { resource: existingNote } = await container.item(noteId, userId).read()

  const updatedNote = {
    ...existingNote,
    ...updates,
  }

  const { resource } = await container.item(noteId, userId).replace(updatedNote)
  return resource
}

export async function deleteNote(noteId: string, userId: string) {
  const container = await getContainer("notes")

  await container.item(noteId, userId).delete()
}

// Folder operations
export async function createFolder(folder: {
  id: string
  userId: string
  name: string
  parentFolderId?: string
  createdAt: string
}) {
  const container = await getContainer("folders")

  const { resource } = await container.items.create(folder)
  return resource
}

export async function getFoldersByUserId(userId: string) {
  const container = await getContainer("folders")

  const { resources } = await container.items
    .query({
      query: "SELECT * FROM c WHERE c.userId = @userId",
      parameters: [{ name: "@userId", value: userId }],
    })
    .fetchAll()

  return resources
}
