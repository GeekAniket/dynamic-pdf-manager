import type { Config, Template } from './types'
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE}${path}`, init)
  if (!response.ok) { const data = await response.json().catch(() => ({})); throw new Error(data.message || `Request failed (${response.status})`) }
  return response.json() as Promise<T>
}
export const api = {
  templates: () => request<Template[]>('/templates'),
  defaultConfig: () => request<{template:Template;config:Config}>('/templates/default'),
  config: (id:string) => request<Config>(`/templates/${id}/config`),
  save: (config:Config) => request<{message:string;config:Config}>('/templates/save',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(config)}),
  setDefault: (id:string) => request<{message:string}>('/templates/'+id+'/default',{method:'PUT'}),
  generate: async (documentType:string, data:Record<string,unknown>, config:Config) => {
    const response = await fetch(`${BASE}/pdf/generate`, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({documentType,data,templateId:config.templateId})})
    if (!response.ok) { const body = await response.json().catch(()=>({})); throw new Error(body.message || 'PDF generation failed') }
    return response.blob()
  }
}