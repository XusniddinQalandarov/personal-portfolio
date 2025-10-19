import { Bot, InlineKeyboard, Context } from 'grammy'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Get current directory (ESM compatibility)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables from telegram-bot/.env
dotenv.config({ path: path.join(__dirname, '.env') })

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const ADMIN_ID = process.env.TELEGRAM_ADMIN_ID
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY

if (!BOT_TOKEN || !ADMIN_ID || !SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing required environment variables!')
  console.error('Required: TELEGRAM_BOT_TOKEN, TELEGRAM_ADMIN_ID, SUPABASE_URL, SUPABASE_ANON_KEY')
  console.error('Create a .env file with these variables. See telegram-bot/.env.example')
  process.exit(1)
}

// Create bot instance
const bot = new Bot(BOT_TOKEN)

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// Middleware: Admin only
bot.use(async (ctx: Context, next) => {
  if (ctx.from?.id.toString() !== ADMIN_ID) {
    await ctx.reply('⛔ Unauthorized. This bot is for admin use only.')
    return
  }
  await next()
})

// Command: /start
bot.command('start', async (ctx: Context) => {
  const keyboard = new InlineKeyboard()
    .text('📊 Statistics', 'stats').row()
    .text('📁 Projects', 'projects').text('� Blogs', 'blogs').row()
    .text('�💬 Messages', 'messages').row()
  
  await ctx.reply(
    `👋 *Welcome to Portfolio Management Bot!*\n\n` +
    `I can help you manage your portfolio content right from Telegram.\n\n` +
    `Use the buttons below or send /help for all commands.`,
    { reply_markup: keyboard, parse_mode: 'Markdown' }
  )
})

// Command: /help
bot.command('help', async (ctx: Context) => {
  const helpText = `
🤖 *Portfolio Bot Commands*

*Blog Management:*
/blogs - List all blogs
/createblog - Create a new blog post
/cancelblog - Cancel blog creation
/publishblog [id] - Publish a draft blog
/unpublishblog [id] - Unpublish a blog
/deleteblog [id] - Delete a blog

*Project Management:*
/projects - List all projects
/deleteproject [id] - Delete a project

*Messages:*
/messages - View unread messages
/allmessages - View all messages

*Statistics:*
/stats - Portfolio statistics

*Other:*
/ping - Check bot status
/help - Show this message

*Tip:* Use inline buttons for easier navigation!
`
  await ctx.reply(helpText, { parse_mode: 'Markdown' })
})

// Command: /ping
bot.command('ping', async (ctx: Context) => {
  await ctx.reply('🏓 Pong! Bot is online and ready.')
})

// Command: /stats
bot.command('stats', async (ctx: Context) => {
  try {
    // Get projects count
    const { count: projectsCount } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
    
    // Get featured projects count
    const { count: featuredCount } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('featured', true)
    
    // Get blogs count
    const { count: blogsCount } = await supabase
      .from('blogs')
      .select('*', { count: 'exact', head: true })
    
    // Get published blogs count
    const { count: publishedCount } = await supabase
      .from('blogs')
      .select('*', { count: 'exact', head: true })
      .eq('published', true)
    
    // Get messages count
    const { count: messagesCount } = await supabase
      .from('contact_messages')
      .select('*', { count: 'exact', head: true })
    
    // Get unread messages count
    const { count: unreadCount } = await supabase
      .from('contact_messages')
      .select('*', { count: 'exact', head: true })
      .eq('read', false)
    
    const statsText = `
📊 *Portfolio Statistics*

*Projects:*
• Total Projects: ${projectsCount || 0}
• Featured: ${featuredCount || 0}

*Blogs:*
• Total Blogs: ${blogsCount || 0}
• Published: ${publishedCount || 0}
• Drafts: ${(blogsCount || 0) - (publishedCount || 0)}

*Messages:*
• Total Messages: ${messagesCount || 0}
• Unread: ${unreadCount || 0}
`
    await ctx.reply(statsText, { parse_mode: 'Markdown' })
  } catch (error) {
    console.error('Error getting stats:', error)
    await ctx.reply('❌ Failed to get statistics. Check Supabase connection.')
  }
})

// Command: /projects
bot.command('projects', async (ctx: Context) => {
  try {
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)
    
    if (error) throw error
    
    if (!projects || projects.length === 0) {
      await ctx.reply('📁 No projects found. Add one from the admin dashboard!')
      return
    }
    
    let message = '📁 *Your Projects:*\n\n'
    projects.forEach((project: any, index: number) => {
      message += `${index + 1}. *${project.title}*\n`
      message += `   📂 ${project.category || 'Uncategorized'}\n`
      message += `   🔄 ${project.status || 'No status'}\n`
      message += `   ${project.featured ? '⭐ Featured' : ''}\n`
      message += `   🆔 \`${project.id}\`\n\n`
    })
    
    message += '\n_Use /deleteproject [id] to remove a project_'
    
    await ctx.reply(message, { parse_mode: 'Markdown' })
  } catch (error) {
    console.error('Error getting projects:', error)
    await ctx.reply('❌ Failed to get projects')
  }
})

// Command: /blogs
bot.command('blogs', async (ctx: Context) => {
  try {
    const { data: blogs, error } = await supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)
    
    if (error) throw error
    
    if (!blogs || blogs.length === 0) {
      await ctx.reply('📝 No blogs found. Create one from the admin dashboard!')
      return
    }
    
    let message = '📝 *Your Blogs:*\n\n'
    blogs.forEach((blog: any, index: number) => {
      const status = blog.published ? '✅ Published' : '📝 Draft'
      const viewCount = blog.views || 0
      
      message += `${index + 1}. *${blog.title}*\n`
      message += `   ${status} • 👀 ${viewCount} views\n`
      message += `   🏷️ ${blog.tags?.join(', ') || 'No tags'}\n`
      message += `   📅 ${new Date(blog.created_at).toLocaleDateString()}\n`
      message += `   🆔 \`${blog.id}\`\n\n`
    })
    
    message += '\n_Commands:_\n'
    message += '• /createblog - Create new blog\n'
    message += '• /publishblog [id] - Publish draft\n'
    message += '• /unpublishblog [id] - Unpublish blog\n'
    message += '• /deleteblog [id] - Delete blog'
    
    await ctx.reply(message, { parse_mode: 'Markdown' })
  } catch (error) {
    console.error('Error getting blogs:', error)
    await ctx.reply('❌ Failed to get blogs')
  }
})

// Store for multi-step blog creation
const blogCreationSessions = new Map<number, any>()

// Command: /createblog
bot.command('createblog', async (ctx: Context) => {
  const userId = ctx.from?.id
  if (!userId) return
  
  // Initialize session
  blogCreationSessions.set(userId, { step: 'title' })
  
  await ctx.reply(
    '✍️ *Create New Blog Post*\n\n' +
    'Let\'s create a new blog post step by step.\n\n' +
    '📝 *Step 1/5:* Enter the blog title:\n\n' +
    '_Use /cancelblog to cancel at any time_',
    { parse_mode: 'Markdown' }
  )
})

// Command: /cancelblog
bot.command('cancelblog', async (ctx: Context) => {
  const userId = ctx.from?.id
  if (!userId) return
  
  if (blogCreationSessions.has(userId)) {
    blogCreationSessions.delete(userId)
    await ctx.reply('❌ Blog creation cancelled.')
  } else {
    await ctx.reply('ℹ️ No active blog creation session.')
  }
})

// Handle photo uploads for blog creation
bot.on('message:photo', async (ctx: Context, next) => {
  const userId = ctx.from?.id
  if (!userId) return await next()
  
  const session = blogCreationSessions.get(userId)
  if (!session || session.step !== 'image_url') {
    return await next()
  }

  try {
    await ctx.reply('📤 Uploading image...')

    // Get the largest photo
    const photos = ctx.message?.photo
    if (!photos || photos.length === 0) {
      await ctx.reply('❌ No photo found. Please try again.')
      return
    }

    const photo = photos[photos.length - 1]
    
    if (!photo) {
      await ctx.reply('❌ No photo found. Please try again.')
      return
    }
    
    // Get file info from Telegram
    const file = await ctx.api.getFile(photo.file_id)
    const filePath = file.file_path
    
    if (!filePath) {
      await ctx.reply('❌ Failed to get file path. Please try again.')
      return
    }

    // Download file from Telegram
    const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${filePath}`
    const response = await fetch(fileUrl)
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Generate unique filename
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 15)
    const extension = filePath.split('.').pop() || 'jpg'
    const filename = `${timestamp}-${randomStr}.${extension}`

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('blog-images')
      .upload(filename, buffer, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Supabase upload error:', error)
      await ctx.reply('❌ Failed to upload image. Please try with a URL or skip.')
      return
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('blog-images')
      .getPublicUrl(filename)

    session.image_url = urlData.publicUrl

    // Now create the blog
    await createBlogFromSession(ctx, userId, session)

  } catch (error) {
    console.error('Error uploading photo:', error)
    await ctx.reply('❌ Failed to upload image. You can try with a URL or type "skip".')
  }
})

// Helper function to create blog from session
async function createBlogFromSession(ctx: Context, userId: number, session: any) {
  try {
    // Generate slug from title
    const slug = session.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
    
    const { data, error } = await supabase
      .from('blogs')
      .insert({
        title: session.title,
        excerpt: session.excerpt,
        content: session.content,
        tags: session.tags,
        image_url: session.image_url || '/images/blog-default.jpg',
        slug: slug,
        published: false
      })
      .select()
      .single()
    
    if (error) throw error
    
    // Clear session
    blogCreationSessions.delete(userId)
    
    await ctx.reply(
      '✅ *Blog Created Successfully!*\n\n' +
      `📝 *Title:* ${session.title}\n` +
      `🏷️ *Tags:* ${session.tags.join(', ') || 'None'}\n` +
      `🔗 *Slug:* \`${slug}\`\n` +
      `🆔 *ID:* \`${data.id}\`\n\n` +
      `The blog is saved as a *draft*. Use /publishblog ${data.id} to publish it!\n\n` +
      `_View all blogs: /blogs_`,
      { parse_mode: 'Markdown' }
    )
  } catch (error) {
    console.error('Error creating blog:', error)
    blogCreationSessions.delete(userId)
    await ctx.reply('❌ Failed to create blog. Please try again with /createblog')
  }
}

// Handle text messages for blog creation
bot.on('message:text', async (ctx: Context, next) => {
  const userId = ctx.from?.id
  if (!userId) return await next()
  
  const session = blogCreationSessions.get(userId)
  if (!session) return await next()
  
  const text = ctx.message?.text
  if (!text) return await next()
  
  // Handle different steps
  switch (session.step) {
    case 'title':
      session.title = text
      session.step = 'excerpt'
      await ctx.reply(
        '✅ Title saved!\n\n' +
        '📝 *Step 2/5:* Enter a short excerpt (summary):',
        { parse_mode: 'Markdown' }
      )
      break
    
    case 'excerpt':
      session.excerpt = text
      session.step = 'content'
      await ctx.reply(
        '✅ Excerpt saved!\n\n' +
        '📝 *Step 3/5:* Enter the full blog content:\n\n' +
        '_Tip: You can use Markdown formatting_',
        { parse_mode: 'Markdown' }
      )
      break
    
    case 'content':
      session.content = text
      session.step = 'tags'
      await ctx.reply(
        '✅ Content saved!\n\n' +
        '📝 *Step 4/5:* Enter tags (comma-separated):\n\n' +
        '_Example: JavaScript, Web Development, Tutorial_\n' +
        'Or type "skip" to skip tags',
        { parse_mode: 'Markdown' }
      )
      break
    
    case 'tags':
      if (text.toLowerCase() !== 'skip') {
        session.tags = text.split(',').map(tag => tag.trim()).filter(Boolean)
      } else {
        session.tags = []
      }
      session.step = 'image_url'
      await ctx.reply(
        '✅ Tags saved!\n\n' +
        '📝 *Step 5/5:* Add an image:\n\n' +
        '🖼️ Send a photo, enter image URL, or type "skip"',
        { parse_mode: 'Markdown' }
      )
      break
    
    case 'image_url':
      if (text.toLowerCase() !== 'skip') {
        session.image_url = text
      }
      
      // Create the blog using helper function
      await createBlogFromSession(ctx, userId, session)
      break
  }
})

// Command: /publishblog
bot.command('publishblog', async (ctx: Context) => {
  const args = ctx.message?.text?.split(' ')
  if (!args || args.length < 2) {
    await ctx.reply(
      'Usage: `/publishblog [blog_id]`\n\n' +
      'Get blog ID from /blogs command',
      { parse_mode: 'Markdown' }
    )
    return
  }
  
  const blogId = args[1]
  
  try {
    // Get blog details first
    const { data: blog, error: fetchError } = await supabase
      .from('blogs')
      .select('title, published')
      .eq('id', blogId)
      .single()
    
    if (fetchError || !blog) {
      await ctx.reply('❌ Blog not found. Check the ID and try again.')
      return
    }
    
    if (blog.published) {
      await ctx.reply(`📝 "${blog.title}" is already published!`)
      return
    }
    
    // Publish the blog
    const { error: updateError } = await supabase
      .from('blogs')
      .update({ published: true })
      .eq('id', blogId)
    
    if (updateError) throw updateError
    
    await ctx.reply(
      `✅ *Blog Published!*\n\n` +
      `"${blog.title}" is now live on your website! 🎉`,
      { parse_mode: 'Markdown' }
    )
  } catch (error) {
    console.error('Error publishing blog:', error)
    await ctx.reply('❌ Failed to publish blog')
  }
})

// Command: /unpublishblog
bot.command('unpublishblog', async (ctx: Context) => {
  const args = ctx.message?.text?.split(' ')
  if (!args || args.length < 2) {
    await ctx.reply(
      'Usage: `/unpublishblog [blog_id]`\n\n' +
      'Get blog ID from /blogs command',
      { parse_mode: 'Markdown' }
    )
    return
  }
  
  const blogId = args[1]
  
  try {
    // Get blog details first
    const { data: blog, error: fetchError } = await supabase
      .from('blogs')
      .select('title, published')
      .eq('id', blogId)
      .single()
    
    if (fetchError || !blog) {
      await ctx.reply('❌ Blog not found. Check the ID and try again.')
      return
    }
    
    if (!blog.published) {
      await ctx.reply(`📝 "${blog.title}" is already a draft!`)
      return
    }
    
    // Unpublish the blog
    const { error: updateError } = await supabase
      .from('blogs')
      .update({ published: false })
      .eq('id', blogId)
    
    if (updateError) throw updateError
    
    await ctx.reply(
      `✅ *Blog Unpublished*\n\n` +
      `"${blog.title}" is now a draft.`,
      { parse_mode: 'Markdown' }
    )
  } catch (error) {
    console.error('Error unpublishing blog:', error)
    await ctx.reply('❌ Failed to unpublish blog')
  }
})

// Command: /deleteblog
bot.command('deleteblog', async (ctx: Context) => {
  const args = ctx.message?.text?.split(' ')
  if (!args || args.length < 2) {
    await ctx.reply(
      'Usage: `/deleteblog [blog_id]`\n\n' +
      'Get blog ID from /blogs command',
      { parse_mode: 'Markdown' }
    )
    return
  }
  
  const blogId = args[1]
  
  try {
    // Get blog details first
    const { data: blog, error: fetchError } = await supabase
      .from('blogs')
      .select('title, views')
      .eq('id', blogId)
      .single()
    
    if (fetchError || !blog) {
      await ctx.reply('❌ Blog not found. Check the ID and try again.')
      return
    }
    
    // Create confirmation keyboard
    const keyboard = new InlineKeyboard()
      .text('✅ Yes, Delete', `confirm_delete_blog_${blogId}`)
      .text('❌ Cancel', 'cancel_delete')
    
    await ctx.reply(
      `⚠️ *Delete Blog?*\n\n` +
      `Blog: "${blog.title}"\n` +
      `Views: ${blog.views || 0}\n\n` +
      `This action cannot be undone!`,
      { parse_mode: 'Markdown', reply_markup: keyboard }
    )
  } catch (error) {
    console.error('Error deleting blog:', error)
    await ctx.reply('❌ Failed to delete blog')
  }
})

// Command: /messages
bot.command('messages', async (ctx: Context) => {
  try {
    const { data: messages, error } = await supabase
      .from('contact_messages')
      .select('*')
      .eq('read', false)
      .order('created_at', { ascending: false })
      .limit(5)
    
    if (error) throw error
    
    if (!messages || messages.length === 0) {
      await ctx.reply('💬 No unread messages. Great job staying on top of things!')
      return
    }
    
    for (const message of messages) {
      const keyboard = new InlineKeyboard()
        .text('✅ Mark as Read', `markread_${message.id}`)
      
      const text = `
💬 *New Contact Message*

*From:* ${message.name}
*Email:* ${message.email}
*Subject:* ${message.subject}

*Message:*
${message.message}

*Received:* ${new Date(message.created_at).toLocaleString()}
*ID:* \`${message.id}\`
`
      await ctx.reply(text, { 
        parse_mode: 'Markdown',
        reply_markup: keyboard 
      })
    }
  } catch (error) {
    console.error('Error getting messages:', error)
    await ctx.reply('❌ Failed to get messages')
  }
})

// Command: /allmessages
bot.command('allmessages', async (ctx: Context) => {
  try {
    const { data: messages, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)
    
    if (error) throw error
    
    if (!messages || messages.length === 0) {
      await ctx.reply('💬 No messages found')
      return
    }
    
    let text = '💬 *All Recent Messages:*\n\n'
    messages.forEach((msg: any, index: number) => {
      text += `${index + 1}. ${msg.read ? '✅' : '📩'} *${msg.subject}*\n`
      text += `   From: ${msg.name}\n`
      text += `   ${new Date(msg.created_at).toLocaleDateString()}\n\n`
    })
    
    await ctx.reply(text, { parse_mode: 'Markdown' })
  } catch (error) {
    console.error('Error getting messages:', error)
    await ctx.reply('❌ Failed to get messages')
  }
})

// Command: /deleteproject
bot.command('deleteproject', async (ctx: Context) => {
  const args = ctx.message?.text?.split(' ')
  if (!args || args.length < 2) {
    await ctx.reply(
      'Usage: `/deleteproject [project_id]`\n\n' +
      'Get project ID from /projects command',
      { parse_mode: 'Markdown' }
    )
    return
  }
  
  const projectId = args[1]
  
  try {
    // Get project details first
    const { data: project, error: fetchError } = await supabase
      .from('projects')
      .select('title')
      .eq('id', projectId)
      .single()
    
    if (fetchError || !project) {
      await ctx.reply('❌ Project not found. Check the ID and try again.')
      return
    }
    
    // Create confirmation keyboard
    const keyboard = new InlineKeyboard()
      .text('✅ Yes, Delete', `confirm_delete_${projectId}`)
      .text('❌ Cancel', 'cancel_delete')
    
    await ctx.reply(
      `⚠️ *Delete Project?*\n\n` +
      `Project: "${project.title}"\n\n` +
      `This action cannot be undone!`,
      { parse_mode: 'Markdown', reply_markup: keyboard }
    )
  } catch (error) {
    console.error('Error deleting project:', error)
    await ctx.reply('❌ Failed to delete project')
  }
})

// Callback: Mark message as read
bot.callbackQuery(/markread_(.+)/, async (ctx: Context) => {
  const messageId = ctx.match?.[1]
  
  try {
    const { error } = await supabase
      .from('contact_messages')
      .update({ read: true })
      .eq('id', messageId)
    
    if (error) throw error
    
    await ctx.answerCallbackQuery({ text: '✅ Marked as read' })
    await ctx.editMessageReplyMarkup({ reply_markup: undefined })
  } catch (error) {
    console.error('Error marking as read:', error)
    await ctx.answerCallbackQuery({ text: '❌ Failed to mark as read' })
  }
})

// Callback: Delete project confirmation
bot.callbackQuery(/confirm_delete_(.+)/, async (ctx: Context) => {
  const projectId = ctx.match?.[1]
  
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId)
    
    if (error) throw error
    
    await ctx.answerCallbackQuery({ text: '✅ Deleted successfully' })
    await ctx.editMessageText('✅ Project deleted successfully')
  } catch (error) {
    console.error('Error deleting project:', error)
    await ctx.answerCallbackQuery({ text: '❌ Failed to delete' })
  }
})

// Callback: Delete blog confirmation
bot.callbackQuery(/confirm_delete_blog_(.+)/, async (ctx: Context) => {
  const blogId = ctx.match?.[1]
  
  try {
    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', blogId)
    
    if (error) throw error
    
    await ctx.answerCallbackQuery({ text: '✅ Blog deleted successfully' })
    await ctx.editMessageText('✅ Blog deleted successfully')
  } catch (error) {
    console.error('Error deleting blog:', error)
    await ctx.answerCallbackQuery({ text: '❌ Failed to delete blog' })
  }
})

// Callback: Cancel delete
bot.callbackQuery('cancel_delete', async (ctx: Context) => {
  await ctx.answerCallbackQuery({ text: 'Cancelled' })
  await ctx.editMessageText('❌ Deletion cancelled')
})

// Callback: Stats button
bot.callbackQuery('stats', async (ctx: Context) => {
  await ctx.answerCallbackQuery()
  
  try {
    const { count: projectsCount } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
    
    const { count: featuredCount } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('featured', true)
    
    const { count: blogsCount } = await supabase
      .from('blogs')
      .select('*', { count: 'exact', head: true })
    
    const { count: publishedCount } = await supabase
      .from('blogs')
      .select('*', { count: 'exact', head: true })
      .eq('published', true)
    
    const { count: messagesCount } = await supabase
      .from('contact_messages')
      .select('*', { count: 'exact', head: true })
    
    const { count: unreadCount } = await supabase
      .from('contact_messages')
      .select('*', { count: 'exact', head: true })
      .eq('read', false)
    
    const statsText = `
📊 *Portfolio Statistics*

*Projects:*
• Total: ${projectsCount || 0}
• Featured: ${featuredCount || 0}

*Blogs:*
• Total: ${blogsCount || 0}
• Published: ${publishedCount || 0}
• Drafts: ${(blogsCount || 0) - (publishedCount || 0)}

*Messages:*
• Total: ${messagesCount || 0}
• Unread: ${unreadCount || 0}
`
    await ctx.reply(statsText, { parse_mode: 'Markdown' })
  } catch (error) {
    await ctx.reply('❌ Failed to get statistics')
  }
})

// Callback: Projects button
bot.callbackQuery('projects', async (ctx: Context) => {
  await ctx.answerCallbackQuery()
  
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)
  
  if (!projects || projects.length === 0) {
    await ctx.reply('📁 No projects found')
    return
  }
  
  let message = '📁 *Your Projects:*\n\n'
  projects.forEach((project: any, index: number) => {
    message += `${index + 1}. *${project.title}*\n`
    message += `   ${project.category || 'N/A'} • ${project.status || 'N/A'}\n`
    message += `   ${project.featured ? '⭐' : ''}\n\n`
  })
  
  await ctx.reply(message, { parse_mode: 'Markdown' })
})

// Callback: Blogs button
bot.callbackQuery('blogs', async (ctx: Context) => {
  await ctx.answerCallbackQuery()
  
  const { data: blogs } = await supabase
    .from('blogs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)
  
  if (!blogs || blogs.length === 0) {
    await ctx.reply('📝 No blogs found')
    return
  }
  
  let message = '📝 *Your Blogs:*\n\n'
  blogs.forEach((blog: any, index: number) => {
    const status = blog.published ? '✅' : '📝'
    message += `${index + 1}. ${status} *${blog.title}*\n`
    message += `   👀 ${blog.views || 0} views\n`
    message += `   ${new Date(blog.created_at).toLocaleDateString()}\n\n`
  })
  
  await ctx.reply(message, { parse_mode: 'Markdown' })
})

// Callback: Messages button
bot.callbackQuery('messages', async (ctx: Context) => {
  await ctx.answerCallbackQuery()
  
  const { data: messages } = await supabase
    .from('contact_messages')
    .select('*')
    .eq('read', false)
    .order('created_at', { ascending: false })
    .limit(5)
  
  if (!messages || messages.length === 0) {
    await ctx.reply('💬 No unread messages')
    return
  }
  
  for (const message of messages) {
    const keyboard = new InlineKeyboard()
      .text('✅ Mark as Read', `markread_${message.id}`)
    
    const text = `
💬 *New Message*
*From:* ${message.name}
*Email:* ${message.email}
*Subject:* ${message.subject}

${message.message}
`
    await ctx.reply(text, { 
      parse_mode: 'Markdown',
      reply_markup: keyboard 
    })
  }
})

// Error handling
bot.catch((err: any) => {
  console.error('❌ Bot error:', err)
})

// Start bot
console.log('🤖 Starting Portfolio Bot...')
console.log(`📱 Bot Token: ${BOT_TOKEN.substring(0, 15)}...`)
console.log(`👤 Admin ID: ${ADMIN_ID}`)
console.log(`🗄️  Supabase URL: ${SUPABASE_URL}`)

bot.start().then(() => {
  console.log('✅ Bot is running! Send /start to your bot in Telegram.')
  console.log('📖 See telegram-bot/README.md for full documentation.')
}).catch((error) => {
  console.error('❌ Failed to start bot:', error)
  process.exit(1)
})
