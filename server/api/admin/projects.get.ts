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
    const { data, error } = await client
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

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

  } catch (error) {
    console.error('Projects API error:', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'An error occurred while fetching projects'
    })
  }
})
