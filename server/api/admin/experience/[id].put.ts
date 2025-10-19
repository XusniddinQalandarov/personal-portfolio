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
      statusMessage: 'Experience ID is required'
    })
  }
  
  try {
    const body = await readBody(event)
    
    const updateData: any = {}
    if (body.title !== undefined) updateData.title = body.title
    if (body.company !== undefined) updateData.company = body.company
    if (body.period !== undefined) updateData.period = body.period
    if (body.description !== undefined) updateData.description = body.description
    if (body.current !== undefined) updateData.current = body.current
    if (body.order_index !== undefined) updateData.order_index = body.order_index
    
    const { data, error } = await client
      .from('experience')
      .update(updateData)
      .eq('id', id)
      .select()
    
    if (error) {
      console.error('Supabase error:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update experience'
      })
    }
    
    if (!data || data.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Experience not found'
      })
    }
    
    return {
      success: true,
      data: data[0]
    }
    
  } catch (error: any) {
    console.error('Update experience API error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Internal server error'
    })
  }
})
