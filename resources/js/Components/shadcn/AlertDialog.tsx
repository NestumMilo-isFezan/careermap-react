import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/shadcn/components/ui/alert-dialog";

import { Button, buttonVariants } from "@/shadcn/components/ui/button";
import { Trash } from "lucide-react";

export const DestructiveAlert = (
    {
        isOpen,
        onOpenChange,
        onConfirm,
        itemId,
        name,
        withIcon = false
    }: {
        isOpen: boolean,
        onOpenChange: (open: boolean) => void,
        onConfirm: () => void,
        itemId: number | null,
        name: string | null,
        withIcon?: boolean
    }
) => {
    return (
        <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
                <AlertDialogContent className="bg-red-50 border-red-500">
                    <AlertDialogHeader>
                    <AlertDialogTitle className="text-red-900">Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription className="text-red-700">
                        This action cannot be undone. This will permanently delete {name} from the database.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel asChild>
                            <Button className="text-red-600 bg-red-50 border-red-500 hover:bg-red-100 hover:text-red-900">Cancel</Button>
                        </AlertDialogCancel>
                        <AlertDialogAction
                            className={buttonVariants({ variant: "destructive" })}
                            onClick={onConfirm}
                        >
                            {withIcon && <Trash className="size-4" />}
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
        </AlertDialog>
    )
}
