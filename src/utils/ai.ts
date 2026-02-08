/**
 * AI Integration utilities for device analysis and code generation.
 * Supports Google Gemini API and OpenRouter API.
 */

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{ text: string }>
    }
  }>
}

/**
 * Analyze device images using Google Gemini API
 */
export async function analyzeWithGemini(
  apiKey: string,
  images: string[],
  model: 'gemini-2.0-flash' | 'gemini-2.0-pro' = 'gemini-2.0-flash'
): Promise<string> {
  const parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = []

  // Add images
  for (const imageDataUrl of images) {
    const [header, base64Data] = imageDataUrl.split(',')
    const mimeType = header.match(/data:(.*);/)?.[1] || 'image/jpeg'
    parts.push({
      inlineData: {
        mimeType,
        data: base64Data,
      },
    })
  }

  // Add analysis prompt
  parts.push({
    text: `Analyze these device images and provide a structured JSON response with the following fields:
{
  "device": { "name": "", "brand": "", "type": "phone|tablet|laptop|watch", "year": 0 },
  "dimensions": {
    "width": 0, "height": 0, "depth": 0,
    "screenWidth": 0, "screenHeight": 0,
    "screenOffsetX": 0, "screenOffsetY": 0, "screenOffsetZ": 0,
    "cornerRadius": 0
  },
  "materials": {
    "bodyMaterial": "", "baseColor": "#hex",
    "metalness": 0.0, "roughness": 0.0
  },
  "features": {
    "notchType": "none|notch|dynamic-island|punch-hole",
    "notchPosition": { "x": 0, "y": 0 },
    "notchSize": { "width": 0, "height": 0 },
    "cameraModule": {
      "shape": "square|circle|pill|individual",
      "position": { "x": 0, "y": 0, "z": 0 },
      "size": { "width": 0, "height": 0 },
      "protrusion": 0, "lensCount": 0
    },
    "buttons": [{ "name": "", "position": { "x": 0, "y": 0 }, "size": { "width": 0, "height": 0 } }]
  },
  "colors": [{ "name": "", "hex": "#000000" }]
}

Use relative units (not millimeters). Typical phone width should be around 2.7 units.
Return ONLY the JSON, no markdown or explanation.`,
  })

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 4096,
        },
      }),
    }
  )

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status} ${response.statusText}`)
  }

  const data: GeminiResponse = await response.json()
  return data.candidates[0]?.content?.parts[0]?.text || ''
}

/**
 * Generate Three.js component code using Gemini
 */
export async function generateDeviceCode(
  apiKey: string,
  specs: string,
  model: 'gemini-2.0-flash' | 'gemini-2.0-pro' = 'gemini-2.0-flash'
): Promise<string> {
  const prompt = `Using these exact device specifications, generate a complete Three.js React component using React Three Fiber (@react-three/fiber).

SPECIFICATIONS:
${specs}

REQUIREMENTS:
- Export default function component
- Props: screen (Texture | null), color (string), rotation ([number,number,number]), position ([number,number,number]), scale ([number,number,number])
- Use meshStandardMaterial for device body with metalness/roughness from specs
- Use meshBasicMaterial for screen with map={screen} prop
- Include all features: body, screen, notch/island, camera, buttons
- Export metadata object with id, name, brand, category, year, colors, tags
- Export dimensions object
- Use TypeScript types from '../../types'
- Clean, well-organized code with JSX

Return ONLY the complete TypeScript/JSX code, no markdown fences.`

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 8192,
        },
      }),
    }
  )

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status} ${response.statusText}`)
  }

  const data: GeminiResponse = await response.json()
  return data.candidates[0]?.content?.parts[0]?.text || ''
}

/**
 * Generate animation template code using Gemini
 */
export async function generateTemplateCode(
  apiKey: string,
  description: string,
  model: 'gemini-2.0-flash' | 'gemini-2.0-pro' = 'gemini-2.0-flash'
): Promise<string> {
  const prompt = `Generate a Three.js animation template object based on this description:

"${description}"

The template must follow this exact TypeScript structure:

import type { MotionTemplate } from '../../types'

export const TemplateName: MotionTemplate = {
  id: 'template-id',
  name: 'Template Name',
  description: 'Description',
  category: 'floating' | 'desk' | 'cinematic' | 'hand',
  duration: NUMBER_IN_SECONDS,
  fps: 30,
  tags: ['tag1', 'tag2'],

  animate: (frame: number, totalFrames: number, deviceType: DeviceCategory) => {
    const progress = frame / totalFrames;

    return {
      camera: { position: [x, y, z], target: [x, y, z], fov: 45 },
      device: { position: [x, y, z], rotation: [rx, ry, rz], scale: [sx, sy, sz] },
      background: '#hex' or { type: 'gradient', colors: ['#hex1', '#hex2'] },
      lighting: { ambient: 0-1, directional: { position: [x,y,z], intensity: 0-2 } }
    };
  }
};

IMPORTANT:
- Use smooth easing functions (ease-in-out, cubic, etc.)
- Must work universally for phones, tablets, laptops, and watches
- Use deviceType parameter to adjust camera distance if needed
- All positions and rotations in radians
- Return ONLY the complete TypeScript code, no markdown fences`

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 4096,
        },
      }),
    }
  )

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status} ${response.statusText}`)
  }

  const data: GeminiResponse = await response.json()
  return data.candidates[0]?.content?.parts[0]?.text || ''
}

/**
 * Call OpenRouter API (for Claude or other models)
 */
export async function analyzeWithOpenRouter(
  apiKey: string,
  images: string[],
  prompt: string,
  model: string = 'anthropic/claude-sonnet-4'
): Promise<string> {
  const content: Array<{ type: string; text?: string; image_url?: { url: string } }> = []

  for (const imageDataUrl of images) {
    content.push({
      type: 'image_url',
      image_url: { url: imageDataUrl },
    })
  }

  content.push({ type: 'text', text: prompt })

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content }],
      max_tokens: 4096,
      temperature: 0.2,
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  return data.choices[0]?.message?.content || ''
}
