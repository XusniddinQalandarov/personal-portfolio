import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const client = createClient(
    config.public.supabaseUrl as string,
    config.public.supabaseKey as string
  )
  
  try {
    const id = event.context.params?.id
    const body = await readBody(event)
    
    const { data, error } = await client
      .from('contact_messages')
      .update({ read: body.read })
      .eq('id', id)
      .select()
    
    if (error) {
      console.error('Supabase error:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update message'
      })
    }
    
    return {
      success: true,
      data
    }
    
  } catch (error) {
    console.error('Update message error:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'An error occurred while updating message'
    })
  }
})
