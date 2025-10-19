import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const client = createClient(
    config.public.supabaseUrl as string,
    config.public.supabaseKey as string
  )
  
  try {
    const id = event.context.params?.id
    
    const { error } = await client
      .from('projects')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Supabase error:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to delete project'
      })
    }
    
    return {
      success: true,
      message: 'Project deleted successfully!'
    }
    
  } catch (error) {
    console.error('Delete project error:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'An error occurred while deleting project'
    })
  }
})
