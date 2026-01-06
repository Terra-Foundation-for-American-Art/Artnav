import Quill from 'quill'

let isRegistered = false

/**
 * Extracts YouTube video ID from various URL formats
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - Direct video ID (11 characters)
 */
function extractYouTubeId(url) {
  if (!url) return null
  
  // If it's already just an ID (11 characters, alphanumeric)
  if (/^[a-zA-Z0-9_-]{11}$/.test(url.trim())) {
    return url.trim()
  }
  
  // Try different YouTube URL patterns
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }
  
  return null
}

/**
 * Custom Video Handler for Quill that adds referrerpolicy attribute
 * to YouTube embeds to fix Error 153
 */
class CustomVideoHandler extends Quill.import('formats/video') {
  static create(value) {
    const node = super.create(value)
    
    // Extract YouTube video ID
    const videoId = extractYouTubeId(value)
    
    if (videoId) {
      // Generate YouTube embed URL
      const embedUrl = `https://www.youtube.com/embed/${videoId}`
      
      // Set iframe attributes including referrerpolicy
      node.setAttribute('src', embedUrl)
      node.setAttribute('frameborder', '0')
      node.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture')
      node.setAttribute('allowfullscreen', 'true')
      node.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin')
      node.setAttribute('width', '560')
      node.setAttribute('height', '315')
      node.setAttribute('class', 'ql-video')
    }
    
    return node
  }
  
  static value(node) {
    return node.getAttribute('src')
  }
}

/**
 * Registers the custom video handler with Quill
 * Must be called before creating any Quill instances
 */
export function registerCustomVideoHandler() {
  if (isRegistered) return
  
  try {
    Quill.register(CustomVideoHandler, true)
    isRegistered = true
  } catch (error) {
    console.warn('Failed to register custom video handler:', error)
  }
}

/**
 * Post-processes HTML to add referrerpolicy to YouTube iframes
 * This ensures existing embeds get the required attribute
 */
export function processVideoEmbeds(html) {
  if (!html || typeof html !== 'string') return html
  
  // Pattern to match YouTube iframes (both opening tags and self-closing)
  // Matches: <iframe ... src="...youtube.com/embed/..." ...>
  // or: <iframe ... src="...youtube.com/embed/..." ... />
  const youtubeIframePattern = /<iframe([^>]*src=["'][^"']*youtube\.com\/embed\/[^"']*["'][^>]*)(\/?)>/gi
  
  return html.replace(youtubeIframePattern, (match, attributes, selfClosing) => {
    // Check if referrerpolicy already exists
    if (/referrerpolicy\s*=/i.test(attributes)) {
      return match
    }
    
    // Add referrerpolicy attribute before the closing > or />
    const closing = selfClosing ? ' />' : '>'
    return `<iframe${attributes} referrerpolicy="strict-origin-when-cross-origin"${closing}`
  })
}

/**
 * Returns configuration for quill-delta-to-html converter
 * with custom video renderer that includes referrerpolicy
 */
export function getQuillDeltaToHtmlConfig() {
  return {
    video: function (op) {
      const videoId = extractYouTubeId(op.insert.video)
      
      if (videoId) {
        const embedUrl = `https://www.youtube.com/embed/${videoId}`
        return `<iframe src="${embedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="true" referrerpolicy="strict-origin-when-cross-origin" width="560" height="315" class="ql-video"></iframe>`
      }
      
      // Fallback for non-YouTube videos
      return `<iframe src="${op.insert.video}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="true" referrerpolicy="strict-origin-when-cross-origin" width="560" height="315" class="ql-video"></iframe>`
    }
  }
}
