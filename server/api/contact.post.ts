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
    if (!body.name || !body.email || !body.subject || !body.message) {
      throw createError({
        statusCode: 400,
        statusMessage: 'All fields are required'
      })
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid email format'
      })
    }
    
    // Insert contact message into Supabase
    const { data, error } = await client
      .from('contact_messages')
      .insert([
        {
          name: body.name,
          email: body.email,
          subject: body.subject,
          message: body.message,
          read: false,
          created_at: new Date().toISOString()
        }
      ])
      .select()
    
    if (error) {
      console.error('Supabase error:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to save message: ${error.message || 'Unknown error'}`
      })
    }
    
    return {
      success: true,
      message: 'Your message has been sent successfully!',
      data
    }
    
  } catch (error: any) {
    console.error('Contact form error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'An error occurred while processing your request'
    })
  }
})
