import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const client = createClient(
    config.public.supabaseUrl as string,
    config.public.supabaseKey as string
  )
  
  const slug = decodeURIComponent(getRouterParam(event, 'slug') || '')
  
  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Slug is required'
    })
  }
  
  try {
    // Get blog by slug
    const { data, error } = await client
      .from('blogs')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        throw createError({
          statusCode: 404,
          statusMessage: 'Blog not found'
        })
      }
      
      console.error('Supabase error:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch blog'
      })
    }
    
    // Increment views count and get updated data
    const newViews = (data.views || 0) + 1
    await client
      .from('blogs')
      .update({ views: newViews })
      .eq('id', data.id)
    
    // Return data with updated views
    return {
      success: true,
      data: {
        ...data,
        views: newViews
      }
    }
    
  } catch (error: any) {
    console.error('Blog API error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Internal server error'
    })
  }
})
