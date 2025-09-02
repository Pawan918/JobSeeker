import { ofetch } from 'ofetch'

export interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: Record<string, any> | FormData
  headers?: Record<string, string>
  token?: string
  server?: boolean
  credentials?: RequestCredentials
}

export default async function useApi<T = any>(
  path: string,
  options: ApiOptions = {}
): Promise<T> {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase || 'http://localhost:5000/api'
  const token = useCookie<string | null>('token')

  const headers: Record<string, string> = {
    ...options.headers,
  }

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] ?? 'application/json'
  }

  if (token.value && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token.value}`
  }

  try {
    return await ofetch<T>(path, {
      baseURL,
      method: options.method ?? 'GET',
      headers,
      body: options.body,
      credentials: 'include',
      retry: 2,
    })
  } catch (err: any) {
    if (err?.response?.status === 401 && token.value) {
      const { refreshToken } = useAuth()
      const newToken = await refreshToken()
      headers['Authorization'] = `Bearer ${newToken}`

      return await ofetch<T>(path, {
        baseURL,
        method: options.method ?? 'GET',
        headers,
        body: options.body,
        retry: 0,
        credentials: 'include',
      })
    }
    throw err
  }
}