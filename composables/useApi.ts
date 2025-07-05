import { ofetch } from 'ofetch'

export interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: Record<string, any> | FormData
  headers?: Record<string, string>
  token?: string
  server?: boolean
}

export default async function useApi<T = any>(
  path: string,
  options: ApiOptions = {}
): Promise<T> {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase || 'http://localhost:5000/api'

  const headers: Record<string, string> = {
    ...options.headers,
  }

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] ?? 'application/json'
  }

  if (options.token) {
    headers['Authorization'] = `Bearer ${options.token}`
  }

  return await ofetch<T>(path, {
    baseURL,
    method: options.method ?? 'GET',
    headers,
    body: options.body,
    retry: 2,
  })
}
