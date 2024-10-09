import React, { useState } from 'react'
import TemplateDialog from './components/TemplateDialog'
import { TemplateProvider } from './context/TemplateContext'
import { CollectionProvider } from './context/CollectionContext'
import { LocalStorageDataProvider, RestApiDataProvider } from './data/DataProvider'
import { ChromeStorageDataProvider } from './data/ChromeStorageDataProvider'
import { Button } from "@/components/ui/button"

type StorageType = 'localStorage' | 'restApi' | 'chromeStorage'

function App() {
  const [storageType, setStorageType] = useState<StorageType>('localStorage')

  const getDataProvider = () => {
    switch (storageType) {
      case 'restApi':
        return new RestApiDataProvider('https://api.example.com') // Replace with your API URL
      case 'chromeStorage':
        return new ChromeStorageDataProvider()
      default:
        return new LocalStorageDataProvider()
    }
  }

  const dataProvider = getDataProvider()

  const cycleStorageType = () => {
    setStorageType(current => {
      switch (current) {
        case 'localStorage':
          return 'restApi'
        case 'restApi':
          return 'chromeStorage'
        case 'chromeStorage':
          return 'localStorage'
      }
    })
  }

  return (
    <CollectionProvider>
      <TemplateProvider dataProvider={dataProvider}>
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-md mb-4">
            <h1 className="text-2xl font-bold mb-4 text-center">Template Manager</h1>
            <div className="flex space-x-4">
              <TemplateDialog collectionName="workTemplates" buttonLabel="Work Templates" />
              <TemplateDialog collectionName="personalTemplates" buttonLabel="Personal Templates" />
              <TemplateDialog collectionName="projectTemplates" buttonLabel="Project Templates" />
            </div>
          </div>
          <Button onClick={cycleStorageType} className="mt-4">
            Switch to {storageType === 'localStorage' ? 'REST API' : storageType === 'restApi' ? 'Chrome Storage' : 'Local Storage'}
          </Button>
        </div>
      </TemplateProvider>
    </CollectionProvider>
  )
}

export default App