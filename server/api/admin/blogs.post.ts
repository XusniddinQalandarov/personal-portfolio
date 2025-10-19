import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const client = createClient(
    config.public.supabaseUrl as string,
    config.public.supabaseKey as string
  )
  
  try {
    const body = await readBody(event)
    
    // Validate required fields
    if (!body.title || !body.content) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Title and content are required'
      })
    }
    
    // Generate slug if not provided
    let slug = body.slug
    if (!slug) {
      // Call generate_slug function
      const { data: slugData, error: slugError } = await client
        .rpc('generate_slug', { title: body.title })
      
      if (slugError) {
        console.error('Error generating slug:', slugError)
        // Fallback: simple slug generation
        slug = body.title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim()
      } else {
        slug = slugData
      }
    }
    
    // Insert blog
    const { data, error } = await client
      .from('blogs')
      .insert([
        {
          title: body.title,
          slug,
          excerpt: body.excerpt || null,
          content: body.content,
          image_url: body.image_url || null,
          tags: body.tags || [],
          published: body.published || false
        }
      ])
      .select()
    
    if (error) {
      console.error('Supabase error creating blog:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to create blog: ${error.message || 'Unknown error'}`
      })
    }
    
    return {
      success: true,
      data: data[0]
    }
    
  } catch (error: any) {
    console.error('Create blog API error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Internal server error'
    })
  }
})
