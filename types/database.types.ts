// Database Types
export interface Project {
  id: string
  title: string
  description: string
  long_description?: string
  image?: string
  image_url?: string
  technologies: string[]
  category?: string
  github_url?: string
  demo_url?: string
  featured: boolean
  status: string
  created_at: string
  updated_at: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  created_at: string
}

export interface Skill {
  id: string
  name: string
  category: string
  level: number
  created_at: string
}

export interface Experience {
  id: string
  title: string
  company: string
  period: string
  description: string
  current: boolean
  order_index: number
  created_at: string
}

export interface Education {
  id: string
  degree: string
  school: string
  year: string
  description?: string
  order_index: number
  created_at: string
}
