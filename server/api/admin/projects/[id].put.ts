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
    
    const { data, error} = await client
      .from('projects')
      .update({
        title: body.title,
        description: body.description,
        long_description: body.long_description,
        image: body.image,
        technologies: body.technologies || [],
        category: body.category,
        github_url: body.github_url,
        demo_url: body.demo_url,
        featured: body.featured || false,
        status: body.status || 'Completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
    
    if (error) {
      console.error('Supabase error:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update project'
      })
    }
    
    return {
      success: true,
      message: 'Project updated successfully!',
      data
    }
    
  } catch (error) {
    console.error('Update project error:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'An error occurred while updating project'
    })
  }
})
