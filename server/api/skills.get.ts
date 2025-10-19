import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const client = createClient(
    config.public.supabaseUrl as string,
    config.public.supabaseKey as string
  )
  
  try {
    const { data, error } = await client
      .from('skills')
      .select('*')
      .order('category', { ascending: true })
      .order('level', { ascending: false })
    
    if (error) {
      console.error('Supabase error:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch skills'
      })
    }
    
    // Group skills by category
    const groupedSkills = (data || []).reduce((acc: any, skill: any) => {
      if (!acc[skill.category]) {
        acc[skill.category] = []
      }
      acc[skill.category].push(skill)
      return acc
    }, {})
    
    return {
      success: true,
      data: groupedSkills
    }
    
  } catch (error: any) {
    console.error('Skills API error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'An error occurred while fetching skills'
    })
  }
})
