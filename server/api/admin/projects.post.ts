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
    if (!body.title || !body.description) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Title and description are required'
      })
    }

    // Insert project into Supabase
    const { data, error } = await client
      .from('projects')
      .insert([
        {
          title: body.title,
          title_ru: body.title_ru || '',
          description: body.description,
          description_ru: body.description_ru || '',
          long_description: body.long_description,
          long_description_ru: body.long_description_ru || '',
          image_url: body.image_url,
          technologies: body.technologies || [],
          category: body.category,
          github_url: body.github_url,
          demo_url: body.demo_url,
          featured: body.featured || false,
          status: body.status || 'Completed',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create project'
      })
    }

    return {
      success: true,
      message: 'Project created successfully!',
      data: data?.[0]
    }

  } catch (error: any) {
    console.error('Create project error:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'An error occurred while creating project'
    })
  }
})
