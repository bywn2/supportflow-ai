import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useUI } from "@/store/ui";

const shortcuts: Array<[string, string]> = [
  ["⌘K / Ctrl K", "Open command palette"],
  ["?", "Show keyboard shortcuts"],
  ["G then D", "Go to Dashboard"],
  ["G then T", "Go to Tickets"],
  ["G then A", "Go to Agents"],
  ["E", "Escalate current ticket"],
  ["R", "Rerun agent trace"],
  ["Shift + D", "Toggle dark mode"],
];

export function ShortcutsDialog() {
  const { shortcutsOpen, setShortcutsOpen } = useUI();
  return (
    <Dialog open={shortcutsOpen} onOpenChange={setShortcutsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Keyboard shortcuts</DialogTitle>
        </DialogHeader>
        <div className="divide-y divide-border rounded-md border border-border">
          {shortcuts.map(([k, l]) => (
            <div key={k} className="flex items-center justify-between px-4 py-2.5 text-sm">
              <span className="text-muted-foreground">{l}</span>
              <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs">{k}</kbd>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
