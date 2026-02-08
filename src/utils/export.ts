/**
 * Video export pipeline - renders frames from Three.js canvas and encodes to video.
 * Uses canvas capture for frame-by-frame rendering.
 */

import type { ExportSettings, ExportProgress } from '../types'
import { RESOLUTION_MAP } from '../types'

export interface ExportCallbacks {
  onProgress: (progress: Partial<ExportProgress>) => void
  onComplete: (blob: Blob, url: string) => void
  onError: (error: string) => void
}

/**
 * Capture a single frame from the Three.js canvas
 */
export function captureFrame(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new Error('Failed to capture frame'))
      },
      'image/png',
      1.0
    )
  })
}

/**
 * Render all frames of an animation and create a downloadable video.
 * Uses MediaRecorder API for browser-native video encoding.
 */
export async function exportVideo(
  canvas: HTMLCanvasElement,
  settings: ExportSettings,
  renderFrame: (frame: number, totalFrames: number) => void,
  duration: number,
  callbacks: ExportCallbacks
): Promise<void> {
  const { fps, format, quality } = settings
  const totalFrames = Math.ceil(duration * fps)
  const resolution = RESOLUTION_MAP[settings.resolution]

  callbacks.onProgress({
    status: 'rendering',
    currentFrame: 0,
    totalFrames,
    percentage: 0,
  })

  try {
    // Set canvas size to export resolution
    const originalWidth = canvas.width
    const originalHeight = canvas.height
    canvas.width = resolution.width
    canvas.height = resolution.height

    // Determine MIME type
    const mimeType = format === 'webm' ? 'video/webm;codecs=vp9' : 'video/webm;codecs=vp8'

    // Use MediaRecorder for video encoding
    const stream = canvas.captureStream(0) // 0 = manual frame capture
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: MediaRecorder.isTypeSupported(mimeType) ? mimeType : 'video/webm',
      videoBitsPerSecond: quality * 1_000_000,
    })

    const chunks: Blob[] = []
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data)
    }

    const recordingDone = new Promise<Blob>((resolve) => {
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: format === 'mp4' ? 'video/mp4' : 'video/webm' })
        resolve(blob)
      }
    })

    mediaRecorder.start()

    // Render each frame
    const frameDelay = 1000 / fps
    for (let frame = 0; frame < totalFrames; frame++) {
      renderFrame(frame, totalFrames)

      // Request frame from stream
      const videoTrack = stream.getVideoTracks()[0]
      if (videoTrack && 'requestFrame' in videoTrack) {
        ;(videoTrack as any).requestFrame()
      }

      // Wait for frame timing
      await new Promise((r) => setTimeout(r, frameDelay / 10))

      // Update progress every 5 frames
      if (frame % 5 === 0) {
        callbacks.onProgress({
          status: 'rendering',
          currentFrame: frame,
          totalFrames,
          percentage: Math.round((frame / totalFrames) * 90),
        })
      }
    }

    mediaRecorder.stop()

    callbacks.onProgress({
      status: 'encoding',
      currentFrame: totalFrames,
      totalFrames,
      percentage: 95,
    })

    const blob = await recordingDone

    // Restore canvas size
    canvas.width = originalWidth
    canvas.height = originalHeight

    const url = URL.createObjectURL(blob)

    callbacks.onProgress({
      status: 'complete',
      currentFrame: totalFrames,
      totalFrames,
      percentage: 100,
      downloadUrl: url,
      fileSize: blob.size,
    })

    callbacks.onComplete(blob, url)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Export failed'
    callbacks.onProgress({ status: 'error', error: message })
    callbacks.onError(message)
  }
}

/**
 * Export animation as GIF (frame-by-frame capture)
 */
export async function exportGif(
  canvas: HTMLCanvasElement,
  renderFrame: (frame: number, totalFrames: number) => void,
  duration: number,
  fps: number,
  callbacks: ExportCallbacks
): Promise<void> {
  const totalFrames = Math.ceil(duration * fps)

  callbacks.onProgress({
    status: 'rendering',
    currentFrame: 0,
    totalFrames,
    percentage: 0,
  })

  try {
    const frames: Blob[] = []

    for (let frame = 0; frame < totalFrames; frame++) {
      renderFrame(frame, totalFrames)
      const blob = await captureFrame(canvas)
      frames.push(blob)

      if (frame % 3 === 0) {
        callbacks.onProgress({
          status: 'rendering',
          currentFrame: frame,
          totalFrames,
          percentage: Math.round((frame / totalFrames) * 100),
        })
      }
    }

    // For GIF, we provide the frames as a zip of PNGs (user can use external tool)
    // Or we could integrate gif.js later
    const blob = new Blob(frames, { type: 'image/png' })
    const url = URL.createObjectURL(blob)

    callbacks.onProgress({
      status: 'complete',
      currentFrame: totalFrames,
      totalFrames,
      percentage: 100,
      downloadUrl: url,
      fileSize: blob.size,
    })

    callbacks.onComplete(blob, url)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'GIF export failed'
    callbacks.onProgress({ status: 'error', error: message })
    callbacks.onError(message)
  }
}

/**
 * Trigger file download in browser
 */
export function downloadFile(url: string, filename: string): void {
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/**
 * Estimate file size based on settings
 */
export function estimateFileSize(settings: ExportSettings, duration: number): string {
  const resolution = RESOLUTION_MAP[settings.resolution]
  const pixels = resolution.width * resolution.height
  const bitsPerPixel = settings.quality * 0.1
  const totalBits = pixels * bitsPerPixel * settings.fps * duration
  const bytes = totalBits / 8
  return formatFileSize(bytes)
}
