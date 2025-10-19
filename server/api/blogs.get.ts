import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const client = createClient(
    config.public.supabaseUrl as string,
    config.public.supabaseKey as string
  )
  
  try {
    const query = getQuery(event)
    const tag = query.tag as string | undefined
    const search = query.search as string | undefined
    
    // Build query - only published blogs for public
    let queryBuilder = client
      .from('blogs')
      .select('id, title, slug, excerpt, image_url, tags, views, created_at, updated_at')
      .eq('published', true)
      .order('created_at', { ascending: false })
    
    // Filter by tag
    if (tag) {
      queryBuilder = queryBuilder.contains('tags', [tag])
    }
    
    // Search in title and excerpt
    if (search) {
      queryBuilder = queryBuilder.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`)
    }
    
    const { data, error } = await queryBuilder
    
    if (error) {
      console.error('Supabase error:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch blogs'
      })
    }
    
    return {
      success: true,
      data: data || []
    }
    
  } catch (error: any) {
    console.error('Blogs API error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Internal server error'
    })
  }
})
