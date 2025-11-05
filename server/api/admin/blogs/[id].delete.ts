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

  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Blog ID is required'
    })
  }

  try {
    const { error } = await client
      .from('blogs')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Supabase error:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to delete blog'
      })
    }

    return {
      success: true,
      message: 'Blog deleted successfully'
    }

  } catch (error: any) {
    console.error('Delete blog API error:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Internal server error'
    })
  }
})
