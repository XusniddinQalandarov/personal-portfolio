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
    const body = await readBody(event)

    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (body.title !== undefined) updateData.title = body.title
    if (body.slug !== undefined) updateData.slug = body.slug
    if (body.excerpt !== undefined) updateData.excerpt = body.excerpt
    if (body.content !== undefined) updateData.content = body.content
    if (body.image_url !== undefined) updateData.image_url = body.image_url
    if (body.tags !== undefined) updateData.tags = body.tags
    if (body.published !== undefined) updateData.published = body.published

    const { data, error } = await client
      .from('blogs')
      .update(updateData)
      .eq('id', id)
      .select()

    if (error) {
      console.error('Supabase error:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update blog'
      })
    }

    if (!data || data.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Blog not found'
      })
    }

    return {
      success: true,
      data: data[0]
    }

  } catch (error: any) {
    console.error('Update blog API error:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Internal server error'
    })
  }
})
