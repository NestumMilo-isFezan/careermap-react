import { useState, FormEventHandler, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/shadcn/components/ui/dialog"
import { Button } from "@/shadcn/components/ui/button"
import { Textarea } from "@/shadcn/components/ui/textarea"
import { useForm } from "@inertiajs/react"
import { Input } from "@/shadcn/components/ui/input"

interface ReportBugModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ReportBugModal({ isOpen, onClose }: ReportBugModalProps) {
  const [mounted, setMounted] = useState(false)

  const { data, setData, post, processing, reset } = useForm({
    title: "",
    description: "",
  })

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault()

    if (!data.title || !data.description) {
      return
    }

    post(route('report.store'), {
      onSuccess: () => {
        handleClose()
      },
      onError: () => {
        // Handle error
      }
    })
  }

  if (!mounted) return null

  return (
    <Dialog modal open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] bg-emerald-100 border border-emerald-500 rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <DialogHeader className="text-center">
            <DialogTitle className="text-emerald-700 text-xl font-semibold">Report a Bug</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Title"
                value={data.title}
                onChange={e => setData('title', e.target.value)}
                className="border border-emerald-500 rounded-lg shadow-none
                  focus-visible:ring-0 bg-yellow-100/50"
              />
            </div>

            <div className="space-y-2">
              <Textarea
                placeholder="Describe the bug in detail"
                value={data.description}
                onChange={e => setData('description', e.target.value)}
                className="min-h-[120px] border border-emerald-500 rounded-lg shadow-none
                  focus-visible:ring-0 bg-yellow-100/50"
              />
            </div>
          </div>

          <DialogFooter className="sm:justify-center pt-2">
            <Button
              type="submit"
              disabled={processing || !data.title || !data.description}
              className="w-full sm:w-auto min-w-[120px]"
            >
              {processing ? 'Submitting...' : 'Submit Report'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
