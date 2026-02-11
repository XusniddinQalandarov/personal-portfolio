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
    if (!body.degree || !body.school || !body.year) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Degree, school, and year are required'
      })
    }

    // Insert education into Supabase
    const { data, error } = await client
      .from('education')
      .insert([
        {
          degree: body.degree,
          degree_ru: body.degree_ru || '',
          school: body.school,
          year: body.year,
          description: body.description || '',
          description_ru: body.description_ru || '',
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
        statusMessage: 'Failed to create education'
      })
    }

    return {
      success: true,
      message: 'Education created successfully!',
      data: data?.[0]
    }

  } catch (error: any) {
    console.error('Create education error:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'An error occurred while creating education'
    })
  }
})
