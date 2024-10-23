import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface NodesSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NodesSheet({ open, onOpenChange }: NodesSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Workflow Nodes</SheetTitle>
          <SheetDescription>
            <div className="text-sm text-muted-foreground text-center my-5">
              No nodes added yet
            </div>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
