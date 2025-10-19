import { Bot, Context, InlineKeyboard } from 'grammy'
import { createClient } from '@supabase/supabase-js'

interface ProjectData {
  title: string
  description: string
  long_description?: string
  category?: string
  github_url?: string
  demo_url?: string
  technologies: string[]
  status?: string
  featured?: boolean
}

// Conversation state management
const conversations = new Map<number, { step: string; data: Partial<ProjectData> }>()

export function setupProjectCommands(bot: Bot, supabase: ReturnType<typeof createClient>) {
  
  // Command: /addproject
  bot.command('addproject', async (ctx: Context) => {
    const userId = ctx.from?.id
    if (!userId) return
    
    // Initialize conversation
    conversations.set(userId, {
      step: 'title',
      data: {}
    })
    
    await ctx.reply(
      '➕ *Add New Project*\n\n' +
      'Let\'s create a new project! I\'ll ask you a few questions.\n\n' +
      '1️⃣ First, what\'s the project *title*?\n\n' +
      '(Send /cancel to cancel)',
      { parse_mode: 'Markdown' }
    )
  })
  
  // Handle conversation flow
  bot.on('message:text', async (ctx: Context) => {
    const userId = ctx.from?.id
    if (!userId) return
    
    const conversation = conversations.get(userId)
    if (!conversation) return
    
    const text = ctx.message?.text
    if (!text) return
    
    // Cancel command
    if (text === '/cancel') {
      conversations.delete(userId)
      await ctx.reply('❌ Cancelled. Project creation aborted.')
      return
    }
    
    // Process based on current step
    switch (conversation.step) {
      case 'title':
        conversation.data.title = text
        conversation.step = 'description'
        await ctx.reply('2️⃣ Great! Now provide a short *description*:', { parse_mode: 'Markdown' })
        break
        
      case 'description':
        conversation.data.description = text
        conversation.step = 'technologies'
        await ctx.reply(
          '3️⃣ What *technologies* are used?\n\n' +
          '(Separate with commas, e.g., "Vue.js, Nuxt, Tailwind")',
          { parse_mode: 'Markdown' }
        )
        break
        
      case 'technologies':
        conversation.data.technologies = text.split(',').map(t => t.trim())
        conversation.step = 'category'
        
        const categoryKeyboard = new InlineKeyboard()
          .text('Web', 'cat_web').text('Mobile', 'cat_mobile').row()
          .text('Desktop', 'cat_desktop').text('Other', 'cat_other')
        
        await ctx.reply('4️⃣ Select project *category*:', {
          parse_mode: 'Markdown',
          reply_markup: categoryKeyboard
        })
        break
        
      case 'github_url':
        conversation.data.github_url = text === 'skip' ? undefined : text
        conversation.step = 'demo_url'
        await ctx.reply('6️⃣ Demo/Live URL? (or type "skip")')
        break
        
      case 'demo_url':
        conversation.data.demo_url = text === 'skip' ? undefined : text
        conversation.step = 'status'
        
        const statusKeyboard = new InlineKeyboard()
          .text('Completed', 'status_completed').row()
          .text('In Progress', 'status_in_progress').row()
          .text('Planning', 'status_planning')
        
        await ctx.reply('7️⃣ Project *status*:', {
          parse_mode: 'Markdown',
          reply_markup: statusKeyboard
        })
        break
    }
  })
  
  // Handle category selection
  bot.callbackQuery(/cat_(.+)/, async (ctx: Context) => {
    const userId = ctx.from?.id
    if (!userId) return
    
    const conversation = conversations.get(userId)
    if (!conversation || conversation.step !== 'category') return
    
    const category = ctx.match?.[1]
    conversation.data.category = category
    conversation.step = 'github_url'
    
    await ctx.answerCallbackQuery()
    await ctx.reply('5️⃣ GitHub repository URL? (or type "skip")')
  })
  
  // Handle status selection
  bot.callbackQuery(/status_(.+)/, async (ctx: Context) => {
    const userId = ctx.from?.id
    if (!userId) return
    
    const conversation = conversations.get(userId)
    if (!conversation || conversation.step !== 'status') return
    
    const status = ctx.match?.[1]?.replace('_', ' ')
    conversation.data.status = status
    conversation.step = 'featured'
    
    const featuredKeyboard = new InlineKeyboard()
      .text('⭐ Yes, Featured', 'featured_yes')
      .text('No', 'featured_no')
    
    await ctx.answerCallbackQuery()
    await ctx.reply('8️⃣ Should this be a *featured* project?', {
      parse_mode: 'Markdown',
      reply_markup: featuredKeyboard
    })
  })
  
  // Handle featured selection and save
  bot.callbackQuery(/featured_(.+)/, async (ctx: Context) => {
    const userId = ctx.from?.id
    if (!userId) return
    
    const conversation = conversations.get(userId)
    if (!conversation || conversation.step !== 'featured') return
    
    conversation.data.featured = ctx.match?.[1] === 'yes'
    
    // Save to database
    try {
      const { data, error } = await (supabase as any)
        .from('projects')
        .insert([conversation.data])
        .select()
      
      if (error) throw error
      
      conversations.delete(userId)
      
      await ctx.answerCallbackQuery({ text: '✅ Project created!' })
      await ctx.reply(
        '✅ *Project Created Successfully!*\n\n' +
        `*Title:* ${conversation.data.title}\n` +
        `*Category:* ${conversation.data.category}\n` +
        `*Status:* ${conversation.data.status}\n` +
        `*Featured:* ${conversation.data.featured ? 'Yes ⭐' : 'No'}\n` +
        `*ID:* \`${data?.[0]?.id || 'N/A'}\``,
        { parse_mode: 'Markdown' }
      )
    } catch (error) {
      console.error('Error creating project:', error)
      await ctx.answerCallbackQuery({ text: '❌ Failed to create project' })
      await ctx.reply('❌ Failed to create project. Please try again.')
      conversations.delete(userId)
    }
  })
  
  // Command: /deleteproject
  bot.command('deleteproject', async (ctx: Context) => {
    const args = ctx.message?.text?.split(' ')
    if (!args || args.length < 2) {
      await ctx.reply('Usage: /deleteproject [project_id]\n\nGet project ID from /projects command')
      return
    }
    
    const projectId = args[1]
    
    if (!projectId) {
      await ctx.reply('Usage: /deleteproject [project_id]\n\nGet project ID from /projects command')
      return
    }
    
    try {
      // Get project details first
      const { data: project } = await (supabase as any)
        .from('projects')
        .select('title')
        .eq('id', projectId)
        .single()
      
      if (!project) {
        await ctx.reply('❌ Project not found')
        return
      }
      
      // Create confirmation keyboard
      const keyboard = new InlineKeyboard()
        .text('✅ Yes, Delete', `confirm_delete_${projectId}`)
        .text('❌ Cancel', 'cancel_delete')
      
      await ctx.reply(
        `⚠️ *Delete Project?*\n\n` +
        `Are you sure you want to delete "${project.title}"?\n\n` +
        `This action cannot be undone!`,
        { parse_mode: 'Markdown', reply_markup: keyboard }
      )
    } catch (error) {
      console.error('Error deleting project:', error)
      await ctx.reply('❌ Failed to delete project')
    }
  })
  
  // Handle delete confirmation
  bot.callbackQuery(/confirm_delete_(.+)/, async (ctx: Context) => {
    const projectId = ctx.match?.[1]
    
    if (!projectId) {
      await ctx.answerCallbackQuery({ text: '❌ Invalid project ID' })
      return
    }
    
    try {
      const { error } = await (supabase as any)
        .from('projects')
        .delete()
        .eq('id', projectId)
      
      if (error) throw error
      
      await ctx.answerCallbackQuery({ text: '✅ Deleted' })
      await ctx.editMessageText('✅ Project deleted successfully')
    } catch (error) {
      console.error('Error deleting project:', error)
      await ctx.answerCallbackQuery({ text: '❌ Failed to delete' })
    }
  })
  
  bot.callbackQuery('cancel_delete', async (ctx: Context) => {
    await ctx.answerCallbackQuery({ text: 'Cancelled' })
    await ctx.editMessageText('❌ Deletion cancelled')
  })
}
