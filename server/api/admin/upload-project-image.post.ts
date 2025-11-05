import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    
    // Check authentication
    const authHeader = getHeader(event, 'authorization')
    if (!authHeader) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      })
    }

    const supabase = createClient(
      config.public.supabaseUrl as string,
      config.public.supabaseKey as string
    )

    // Get the uploaded file from form data
    const form = await readMultipartFormData(event)
    
    if (!form || form.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No file uploaded'
      })
    }

    const fileData = form[0]
    
    if (!fileData.data || !fileData.filename) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid file data'
      })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (fileData.type && !allowedTypes.includes(fileData.type)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed'
      })
    }

    // Validate file size (10MB max for project images)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (fileData.data.length > maxSize) {
      throw createError({
        statusCode: 400,
        statusMessage: 'File too large. Maximum size is 10MB'
      })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 15)
    const extension = fileData.filename.split('.').pop()
    const filename = `project-${timestamp}-${randomStr}.${extension}`

    // Upload to Supabase Storage (using blog-images bucket temporarily)
    const { data, error } = await supabase.storage
      .from('blog-images')
      .upload(filename, fileData.data, {
        contentType: fileData.type || 'image/jpeg',
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Supabase upload error:', error)
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to upload image: ${error.message}`
      })
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('blog-images')
      .getPublicUrl(filename)

    return {
      success: true,
      url: urlData.publicUrl,
      filename: filename,
      message: 'Project image uploaded successfully'
    }

  } catch (error: any) {
    console.error('Project image upload error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to upload project image'
    })
  }
})