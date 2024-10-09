import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Template } from '../types'
import { DataProvider, LocalStorageDataProvider } from '../data/DataProvider'
import { useCollectionContext } from './CollectionContext'

interface TemplateContextType {
  templates: Template[]
  addTemplate: (name: string, content: string) => Promise<void>
  updateTemplate: (id: string, name: string, content: string) => void
  saveTemplate: (id: string) => Promise<void>
  deleteTemplate: (id: string) => Promise<void>
}

const TemplateContext = createContext<TemplateContextType | undefined>(undefined)

export const useTemplateContext = () => {
  const context = useContext(TemplateContext)
  if (!context) {
    throw new Error('useTemplateContext must be used within a TemplateProvider')
  }
  return context
}

export const TemplateProvider: React.FC<{ children: ReactNode; dataProvider?: DataProvider }> = ({ 
  children, 
  dataProvider = new LocalStorageDataProvider() 
}) => {
  const [templates, setTemplates] = useState<Template[]>([])
  const [editedTemplates, setEditedTemplates] = useState<Template[]>([])
  const { collectionName } = useCollectionContext()

  useEffect(() => {
    const fetchTemplates = async () => {
      const fetchedTemplates = await dataProvider.getAll<Template>(collectionName)
      setTemplates(fetchedTemplates)
      setEditedTemplates(fetchedTemplates)
    }
    fetchTemplates()
  }, [dataProvider, collectionName])

  const addTemplate = async (name: string, content: string) => {
    const newTemplate = await dataProvider.add<Template>(collectionName, { name, content })
    setTemplates(prevTemplates => [...prevTemplates, newTemplate])
    setEditedTemplates(prevTemplates => [...prevTemplates, newTemplate])
  }

  const updateTemplate = (id: string, name: string, content: string) => {
    setEditedTemplates(prevTemplates =>
      prevTemplates.map((template) =>
        template.id === id ? { ...template, name, content } : template
      )
    )
  }

  const saveTemplate = async (id: string) => {
    const editedTemplate = editedTemplates.find(t => t.id === id)
    if (editedTemplate) {
      const updatedTemplate = await dataProvider.update<Template>(collectionName, id, editedTemplate)
      setTemplates(prevTemplates => 
        prevTemplates.map(t => t.id === id ? updatedTemplate : t)
      )
      setEditedTemplates(prevTemplates => 
        prevTemplates.map(t => t.id === id ? updatedTemplate : t)
      )
    }
  }

  const deleteTemplate = async (id: string) => {
    await dataProvider.delete(collectionName, id)
    setTemplates(prevTemplates => prevTemplates.filter(t => t.id !== id))
    setEditedTemplates(prevTemplates => prevTemplates.filter(t => t.id !== id))
  }

  const value = {
    templates: editedTemplates,
    addTemplate,
    updateTemplate,
    saveTemplate,
    deleteTemplate,
  }

  return <TemplateContext.Provider value={value}>{children}</TemplateContext.Provider>
}