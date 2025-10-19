import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const client = createClient(
    config.public.supabaseUrl as string,
    config.public.supabaseKey as string
  )
  
  const id = getRouterParam(event, 'id')
  
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Education ID is required'
    })
  }
  
  try {
    const body = await readBody(event)
    
    const updateData: any = {}
    if (body.degree !== undefined) updateData.degree = body.degree
    if (body.school !== undefined) updateData.school = body.school
    if (body.year !== undefined) updateData.year = body.year
    if (body.description !== undefined) updateData.description = body.description
    if (body.order_index !== undefined) updateData.order_index = body.order_index
    
    const { data, error } = await client
      .from('education')
      .update(updateData)
      .eq('id', id)
      .select()
    
    if (error) {
      console.error('Supabase error:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update education'
      })
    }
    
    if (!data || data.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Education not found'
      })
    }
    
    return {
      success: true,
      data: data[0]
    }
    
  } catch (error: any) {
    console.error('Update education API error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Internal server error'
    })
  }
})
