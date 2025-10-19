import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get the uploaded file from form data
    const form = await readMultipartFormData(event)
    
    if (!form || form.length === 0) {
      return {
        success: false,
        error: 'No file uploaded'
      }
    }

    const fileData = form[0]
    
    if (!fileData.data || !fileData.filename) {
      return {
        success: false,
        error: 'Invalid file data'
      }
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (fileData.type && !allowedTypes.includes(fileData.type)) {
      return {
        success: false,
        error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed'
      }
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (fileData.data.length > maxSize) {
      return {
        success: false,
        error: 'File too large. Maximum size is 5MB'
      }
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 15)
    const extension = fileData.filename.split('.').pop()
    const filename = `${timestamp}-${randomStr}.${extension}`

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('blog-images')
      .upload(filename, fileData.data, {
        contentType: fileData.type || 'image/jpeg',
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Supabase upload error:', error)
      return {
        success: false,
        error: `Failed to upload image: ${error.message}`
      }
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('blog-images')
      .getPublicUrl(filename)

    return {
      success: true,
      url: urlData.publicUrl,
      filename: filename
    }

  } catch (error: any) {
    console.error('Upload error:', error)
    return {
      success: false,
      error: error.message || 'Failed to upload image'
    }
  }
})
