export interface User {
  id: number
  email: string
  name: string
  password: string
  role: 'user' | 'admin'
  jobs: Job[]
  bookmarks: Bookmark[]
  applications: Application[]
  createdAt: string 
}

export interface Job {
  id: number
  title: string
  description: string
  location: string
  company: string
  type: string
  tags: string[]
  postedBy?: User
  postedById?: number
  bookmarks: Bookmark[]
  applyUrl?: string
  applyEmail?: string
  applications: Application[]
  createdAt: string
}
export interface Bookmark {
  id: number
  user: User
  userId: number
  job: Job
  jobId: number
}

export interface Application {
  id: number
  user: User
  userId: number
  job: Job
  jobId: number
  createdAt: string
}
export interface RefreshToken {
  id: number
  token: string
  userId: number
  user: User
  expiresAt: string
  createdAt: string
}

