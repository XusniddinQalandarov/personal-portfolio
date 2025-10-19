import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const client = createClient(
    config.public.supabaseUrl as string,
    config.public.supabaseKey as string
  )
  
  try {
    const query = getQuery(event)
    const featured = query.featured === 'true'
    const category = query.category as string | undefined
    
    // Build query
    let queryBuilder = client
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    
    // Apply filters
    if (featured) {
      queryBuilder = queryBuilder.eq('featured', true)
    }
    
    if (category && category !== 'All') {
      queryBuilder = queryBuilder.eq('category', category)
    }
    
    const { data, error } = await queryBuilder
    
    if (error) {
      console.error('Supabase error:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch projects'
      })
    }
    
    return {
      success: true,
      data: data || []
    }
    
  } catch (error: any) {
    console.error('Projects API error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'An error occurred while fetching projects'
    })
  }
})
