import React, { useState } from 'react'
import { Save, Trash2, PlusCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useTemplateContext } from '../context/TemplateContext'
import { Template } from '../types'

const TemplateList: React.FC = () => {
  const { templates, updateTemplate, saveTemplate, deleteTemplate, addTemplate } = useTemplateContext()
  const [showNewItem, setShowNewItem] = useState(false)
  const [newItem, setNewItem] = useState<Template>({ id: '', name: '', content: '' })

  const handleAddNewItem = () => {
    setShowNewItem(true)
    setNewItem({ id: '', name: '', content: '' })
  }

  const handleSaveNewItem = () => {
    if (newItem.name.trim() && newItem.content.trim()) {
      addTemplate(newItem.name, newItem.content)
      setShowNewItem(false)
    }
  }

  return (
    <div className="space-y-4">
      <Accordion type="multiple" className="w-full">
        {showNewItem && (
          <AccordionItem value="new-item">
            <AccordionTrigger>
              <div className="flex items-center justify-between w-full">
                <Input
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="New template name"
                  className="w-full mr-2"
                />
                <Button 
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSaveNewItem()
                  }}
                  size="sm"
                  disabled={!newItem.name.trim() || !newItem.content.trim()}
                >
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Textarea
                value={newItem.content}
                onChange={(e) => setNewItem({ ...newItem, content: e.target.value })}
                placeholder="New template content"
                className="w-full h-24 mt-2"
              />
            </AccordionContent>
          </AccordionItem>
        )}
        {templates.map((template) => (
          <AccordionItem key={template.id} value={template.id}>
            <AccordionTrigger>
              <div className="flex items-center justify-between w-full">
                <Input
                  value={template.name}
                  onChange={(e) => updateTemplate(template.id, e.target.value, template.content)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full mr-2"
                />
                <div className="flex space-x-2">
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation()
                      saveTemplate(template.id)
                    }}
                    size="sm"
                    disabled={template.content.trim() === ''}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                  {template.id && (
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteTemplate(template.id)
                      }}
                      size="sm"
                      variant="destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Textarea
                value={template.content}
                onChange={(e) => updateTemplate(template.id, template.name, e.target.value)}
                className="w-full h-24 mt-2"
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <Button onClick={handleAddNewItem} className="w-full">
        <PlusCircle className="mr-2 h-4 w-4" /> Add New Template
      </Button>
    </div>
  )
}

export default TemplateList