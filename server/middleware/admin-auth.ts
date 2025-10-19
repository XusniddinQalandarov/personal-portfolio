export default defineEventHandler((event) => {
  const path = event.path
  
  // Only protect admin API routes
  if (path?.startsWith('/api/admin/')) {
    const authHeader = event.headers.get('authorization')
    
    if (!authHeader) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      })
    }
    
    // Check if the authorization header matches the admin password
    const config = useRuntimeConfig()
    const expectedAuth = `Bearer ${config.adminPassword || 'admin123'}`
    
    if (authHeader !== expectedAuth) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid credentials'
      })
    }
  }
})
