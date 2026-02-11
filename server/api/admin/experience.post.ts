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
    if (!body.title || !body.company || !body.period) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Title, company, and period are required'
      })
    }

    // Insert experience into Supabase
    const { data, error } = await client
      .from('experience')
      .insert([
        {
          title: body.title,
          title_ru: body.title_ru || '',
          company: body.company,
          period: body.period,
          description: body.description || '',
          description_ru: body.description_ru || '',
          current: body.current || false,
          order_index: body.order_index || 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create experience'
      })
    }

    return {
      success: true,
      message: 'Experience created successfully!',
      data: data?.[0]
    }

  } catch (error: any) {
    console.error('Create experience error:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'An error occurred while creating experience'
    })
  }
})
