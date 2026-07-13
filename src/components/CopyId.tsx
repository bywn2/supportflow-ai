import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export function CopyId({ id, className }: { id: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        navigator.clipboard?.writeText(id);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
      className={cn("inline-flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-foreground", className)}
    >
      <span>{id}</span>
      {copied ? <Check className="h-3 w-3 text-[oklch(0.6_0.16_155)]" /> : <Copy className="h-3 w-3 opacity-60" />}
    </button>
  );
}
