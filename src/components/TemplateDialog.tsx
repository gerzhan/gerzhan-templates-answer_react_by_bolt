import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { X } from 'lucide-react'
import TemplateList from './TemplateList'
import { useCollectionContext } from '../context/CollectionContext'

interface TemplateDialogProps {
  collectionName: string;
  buttonLabel?: string;
}

const TemplateDialog: React.FC<TemplateDialogProps> = ({ collectionName, buttonLabel = "Templates" }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { setCollectionName } = useCollectionContext()

  const handleOpenDialog = () => {
    setCollectionName(collectionName)
    setIsOpen(true)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={handleOpenDialog}>{buttonLabel}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div>
            <DialogTitle>{buttonLabel}</DialogTitle>
            <DialogDescription>
              View, edit, and manage your {collectionName}.
            </DialogDescription>
          </div>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          <TemplateList />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TemplateDialog