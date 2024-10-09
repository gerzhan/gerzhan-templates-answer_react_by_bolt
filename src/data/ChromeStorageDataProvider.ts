import { DataProvider } from './DataProvider'

export class ChromeStorageDataProvider implements DataProvider {
  private getKey(collection: string): string {
    return `${collection}_items`
  }

  async getAll<T>(collection: string): Promise<T[]> {
    return new Promise((resolve, reject) => {
      const key = this.getKey(collection)
      chrome.storage.sync.get(key, (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError)
        } else {
          resolve(result[key] || [])
        }
      })
    })
  }

  async add<T>(collection: string, item: Omit<T, 'id'>): Promise<T> {
    const key = this.getKey(collection)
    const items = await this.getAll<T>(collection)
    const newItem = { ...item, id: Date.now().toString() } as T
    items.push(newItem)
    
    return new Promise((resolve, reject) => {
      chrome.storage.sync.set({ [key]: items }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError)
        } else {
          resolve(newItem)
        }
      })
    })
  }

  async update<T>(collection: string, id: string, item: Partial<T>): Promise<T> {
    const key = this.getKey(collection)
    const items = await this.getAll<T>(collection)
    const index = items.findIndex((i: any) => i.id === id)
    if (index === -1) throw new Error('Item not found')
    items[index] = { ...items[index], ...item }
    
    return new Promise((resolve, reject) => {
      chrome.storage.sync.set({ [key]: items }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError)
        } else {
          resolve(items[index])
        }
      })
    })
  }

  async delete(collection: string, id: string): Promise<void> {
    const key = this.getKey(collection)
    const items = await this.getAll(collection)
    const filteredItems = items.filter((i: any) => i.id !== id)
    
    return new Promise((resolve, reject) => {
      chrome.storage.sync.set({ [key]: filteredItems }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError)
        } else {
          resolve()
        }
      })
    })
  }
}