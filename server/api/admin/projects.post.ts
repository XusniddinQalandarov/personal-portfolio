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
    if (!body.title || !body.description) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Title and description are required'
      })
    }
    
    const { data, error } = await client
      .from('projects')
      .insert([{
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
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
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
      data
    }
    
  } catch (error) {
    console.error('Create project error:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'An error occurred while creating project'
    })
  }
})
