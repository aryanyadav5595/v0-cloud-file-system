import { BlobServiceClient } from "@azure/storage-blob"

let blobServiceClient: BlobServiceClient | null = null

export function getAzureBlobClient() {
  if (!blobServiceClient) {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING

    if (!connectionString) {
      throw new Error("AZURE_STORAGE_CONNECTION_STRING is not defined")
    }

    blobServiceClient = BlobServiceClient.fromConnectionString(connectionString)
  }

  return blobServiceClient
}

export async function uploadFileToBlob(
  containerName: string,
  fileName: string,
  fileBuffer: Buffer,
  contentType: string,
) {
  const blobClient = getAzureBlobClient()
  const containerClient = blobClient.getContainerClient(containerName)

  // Create container if it doesn't exist
  await containerClient.createIfNotExists({
    access: "blob",
  })

  const blockBlobClient = containerClient.getBlockBlobClient(fileName)

  await blockBlobClient.upload(fileBuffer, fileBuffer.length, {
    blobHTTPHeaders: {
      blobContentType: contentType,
    },
  })

  return blockBlobClient.url
}

export async function downloadFileFromBlob(containerName: string, fileName: string) {
  const blobClient = getAzureBlobClient()
  const containerClient = blobClient.getContainerClient(containerName)
  const blockBlobClient = containerClient.getBlockBlobClient(fileName)

  const downloadResponse = await blockBlobClient.download()

  if (!downloadResponse.readableStreamBody) {
    throw new Error("Failed to download file")
  }

  return downloadResponse
}

export async function deleteFileFromBlob(containerName: string, fileName: string) {
  const blobClient = getAzureBlobClient()
  const containerClient = blobClient.getContainerClient(containerName)
  const blockBlobClient = containerClient.getBlockBlobClient(fileName)

  await blockBlobClient.delete()
}

export async function listFilesInContainer(containerName: string) {
  const blobClient = getAzureBlobClient()
  const containerClient = blobClient.getContainerClient(containerName)

  const files = []

  for await (const blob of containerClient.listBlobsFlat()) {
    files.push({
      name: blob.name,
      size: blob.properties.contentLength,
      lastModified: blob.properties.lastModified,
      contentType: blob.properties.contentType,
    })
  }

  return files
}
