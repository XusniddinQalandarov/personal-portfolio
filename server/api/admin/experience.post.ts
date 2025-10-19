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
    if (!body.title || !body.company || !body.period) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Title, company, and period are required'
      })
    }
    
    const { data, error } = await client
      .from('experience')
      .insert([
        {
          title: body.title,
          company: body.company,
          period: body.period,
          description: body.description || null,
          current: body.current || false,
          order_index: body.order_index || 0
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
      data: data[0]
    }
    
  } catch (error: any) {
    console.error('Create experience API error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Internal server error'
    })
  }
})
