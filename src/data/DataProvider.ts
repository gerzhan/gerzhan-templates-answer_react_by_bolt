import { Template } from '../types'

export interface DataProvider {
  getAll<T>(collection: string): Promise<T[]>
  add<T>(collection: string, item: Omit<T, 'id'>): Promise<T>
  update<T>(collection: string, id: string, item: Partial<T>): Promise<T>
  delete(collection: string, id: string): Promise<void>
}

export class LocalStorageDataProvider implements DataProvider {
  private getKey(collection: string): string {
    return `${collection}_items`
  }

  async getAll<T>(collection: string): Promise<T[]> {
    const key = this.getKey(collection)
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : []
  }

  async add<T>(collection: string, item: Omit<T, 'id'>): Promise<T> {
    const key = this.getKey(collection)
    const items = await this.getAll<T>(collection)
    const newItem = { ...item, id: Date.now().toString() } as T
    items.push(newItem)
    localStorage.setItem(key, JSON.stringify(items))
    return newItem
  }

  async update<T>(collection: string, id: string, item: Partial<T>): Promise<T> {
    const key = this.getKey(collection)
    const items = await this.getAll<T>(collection)
    const index = items.findIndex((i: any) => i.id === id)
    if (index === -1) throw new Error('Item not found')
    items[index] = { ...items[index], ...item }
    localStorage.setItem(key, JSON.stringify(items))
    return items[index]
  }

  async delete(collection: string, id: string): Promise<void> {
    const key = this.getKey(collection)
    const items = await this.getAll(collection)
    const filteredItems = items.filter((i: any) => i.id !== id)
    localStorage.setItem(key, JSON.stringify(filteredItems))
  }
}

export class RestApiDataProvider implements DataProvider {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  async getAll<T>(collection: string): Promise<T[]> {
    const response = await fetch(`${this.baseUrl}/${collection}`)
    if (!response.ok) throw new Error(`Failed to fetch ${collection}`)
    return response.json()
  }

  async add<T>(collection: string, item: Omit<T, 'id'>): Promise<T> {
    const response = await fetch(`${this.baseUrl}/${collection}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    })
    if (!response.ok) throw new Error(`Failed to add ${collection} item`)
    return response.json()
  }

  async update<T>(collection: string, id: string, item: Partial<T>): Promise<T> {
    const response = await fetch(`${this.baseUrl}/${collection}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    })
    if (!response.ok) throw new Error(`Failed to update ${collection} item`)
    return response.json()
  }

  async delete(collection: string, id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${collection}/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error(`Failed to delete ${collection} item`)
  }
}