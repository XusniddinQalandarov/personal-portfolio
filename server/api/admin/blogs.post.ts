import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  // Check authentication
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

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

    // Generate slug from title if not provided
    const slug = body.slug || body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Insert blog into Supabase
    const { data, error } = await client
      .from('blogs')
      .insert([
        {
          title: body.title,
          slug: slug,
          excerpt: body.excerpt || '',
          content: body.content,
          image_url: body.image_url || '',
          tags: body.tags || [],
          published: body.published || false,
          views: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create blog'
      })
    }

    return {
      success: true,
      message: 'Blog created successfully!',
      data: data?.[0]
    }

  } catch (error: any) {
    console.error('Create blog error:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'An error occurred while creating blog'
    })
  }
})
