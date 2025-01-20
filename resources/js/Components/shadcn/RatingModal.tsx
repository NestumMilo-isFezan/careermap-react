import { useState, FormEventHandler, useEffect } from "react"
import { Star } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/shadcn/components/ui/dialog"
import { Button } from "@/shadcn/components/ui/button"
import { Textarea } from "@/shadcn/components/ui/textarea"
import { useForm } from "@inertiajs/react"

interface RatingModalProps {
  isOpen: boolean
  onClose: () => void
}

export function RatingModal({ isOpen, onClose }: RatingModalProps) {
  const [rating, setRating] = useState(0)
  const [mounted, setMounted] = useState(false)

  const { data, setData, post, processing, reset } = useForm({
    rating: 0,
    comment: "",
  })

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  const handleClose = () => {
    setRating(0)
    reset()
    onClose()
  }

  const handleStarClick = (value: number) => {
    setRating(value)
    setData('rating', value)
  }

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault()

    if (rating === 0) {
      return
    }

    post('/ratings', {
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
            <DialogTitle className="text-emerald-700 text-xl font-semibold">Rate and Comment</DialogTitle>
          </DialogHeader>

          <div className="flex justify-center space-x-2 py-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={28}
                className={`cursor-pointer transition-colors hover:text-emerald-600
                  ${star <= rating ? "text-emerald-700 fill-emerald-700" : "text-emerald-800/40"}`}
                onClick={() => handleStarClick(star)}
              />
            ))}
          </div>

          <div className="space-y-2">
            <Textarea
              placeholder="Leave your comment here"
              value={data.comment}
              onChange={e => setData('comment', e.target.value)}
              className="min-h-[120px] border border-emerald-500 rounded-lg shadow-none
                focus-visible:ring-emerald-500 bg-yellow-100/50"
            />
          </div>

          <DialogFooter className="sm:justify-center pt-2">
            <Button
              type="submit"
              disabled={processing || rating === 0}
              className="w-full sm:w-auto min-w-[120px]"
            >
              {processing ? 'Submitting...' : 'Submit'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
