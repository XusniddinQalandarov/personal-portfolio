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
      statusMessage: 'Project ID is required'
    })
  }

  try {
    const body = await readBody(event)

    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (body.title !== undefined) updateData.title = body.title
    if (body.title_ru !== undefined) updateData.title_ru = body.title_ru
    if (body.description !== undefined) updateData.description = body.description
    if (body.description_ru !== undefined) updateData.description_ru = body.description_ru
    if (body.long_description !== undefined) updateData.long_description = body.long_description
    if (body.long_description_ru !== undefined) updateData.long_description_ru = body.long_description_ru
    if (body.image_url !== undefined) updateData.image_url = body.image_url
    if (body.technologies !== undefined) updateData.technologies = body.technologies
    if (body.category !== undefined) updateData.category = body.category
    if (body.github_url !== undefined) updateData.github_url = body.github_url
    if (body.demo_url !== undefined) updateData.demo_url = body.demo_url
    if (body.featured !== undefined) updateData.featured = body.featured
    if (body.status !== undefined) updateData.status = body.status

    const { data, error } = await client
      .from('projects')
      .update(updateData)
      .eq('id', id)
      .select()

    if (error) {
      console.error('Supabase error:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update project'
      })
    }

    if (!data || data.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Project not found'
      })
    }

    return {
      success: true,
      data: data[0]
    }

  } catch (error: any) {
    console.error('Update project API error:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Internal server error'
    })
  }
})
