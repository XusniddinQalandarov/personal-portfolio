import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
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
    
    const { data, error } = await client
      .from('education')
      .insert([
        {
          degree: body.degree,
          school: body.school,
          year: body.year,
          description: body.description || null,
          order_index: body.order_index || 0
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
      data: data[0]
    }
    
  } catch (error: any) {
    console.error('Create education API error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Internal server error'
    })
  }
})
