export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  
  const { password } = body
  
  if (!password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Password is required'
    })
  }
  
  const expectedPassword = config.adminPassword || 'admin123'
  
  if (password === expectedPassword) {
    return {
      success: true,
      token: `Bearer ${password}`
    }
  } else {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid password'
    })
  }
})
