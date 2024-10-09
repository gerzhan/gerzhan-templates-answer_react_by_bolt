import React, { createContext, useContext, useState, ReactNode } from 'react'

interface CollectionContextType {
  collectionName: string
  setCollectionName: (name: string) => void
}

const CollectionContext = createContext<CollectionContextType | undefined>(undefined)

export const useCollectionContext = () => {
  const context = useContext(CollectionContext)
  if (!context) {
    throw new Error('useCollectionContext must be used within a CollectionProvider')
  }
  return context
}

export const CollectionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [collectionName, setCollectionName] = useState<string>('templates')

  return (
    <CollectionContext.Provider value={{ collectionName, setCollectionName }}>
      {children}
    </CollectionContext.Provider>
  )
}