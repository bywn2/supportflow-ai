import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    toast.success("Signed in");
    nav({ to: "/dashboard" });
  };

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-2">
      <div className="flex items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-base font-semibold tracking-tight">SupportOps AI</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Sign in to your workspace</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">Continue with email or your identity provider.</p>

          <form onSubmit={signIn} className="mt-8 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Work email</Label>
              <Input id="email" type="email" placeholder="you@company.com" defaultValue="alex@supportops.ai" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" defaultValue="••••••••••" required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in…" : (<>Sign in <ArrowRight className="ml-1.5 h-3.5 w-3.5" /></>)}
            </Button>
            <div className="relative py-1 text-center">
              <span className="text-xs text-muted-foreground">or</span>
            </div>
            <Button type="button" variant="outline" className="w-full" onClick={() => nav({ to: "/dashboard" })}>
              Continue with SSO
            </Button>
          </form>

          <p className="mt-8 text-xs text-muted-foreground">
            By continuing you agree to our terms and privacy policy.
          </p>
        </div>
      </div>

      <div className="relative hidden overflow-hidden bg-[oklch(0.16_0.02_265)] lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,oklch(0.4_0.22_275/0.6),transparent_60%),radial-gradient(circle_at_70%_70%,oklch(0.55_0.18_220/0.4),transparent_60%)]" />
        <svg className="absolute inset-0 h-full w-full opacity-40" viewBox="0 0 600 800">
          {[[100,120,300,280],[300,280,500,180],[300,280,480,460],[300,280,150,520],[480,460,540,660],[150,520,220,700]].map(([x1,y1,x2,y2],i)=>(
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="oklch(0.8 0.1 275)" strokeWidth="1" strokeDasharray="4 6">
              <animate attributeName="stroke-dashoffset" from="0" to="20" dur={`${2+i*0.3}s`} repeatCount="indefinite" />
            </line>
          ))}
          {[[100,120],[300,280],[500,180],[480,460],[150,520],[540,660],[220,700]].map(([cx,cy],i)=>(
            <g key={i}>
              <circle cx={cx} cy={cy} r="18" fill="oklch(0.25 0.08 275)" stroke="oklch(0.7 0.18 275)" strokeWidth="1.5" />
              <circle cx={cx} cy={cy} r="4" fill="oklch(0.85 0.15 275)">
                <animate attributeName="r" values="3;6;3" dur="2.4s" repeatCount="indefinite" begin={`${i*0.2}s`} />
              </circle>
            </g>
          ))}
        </svg>
        <div className="relative z-10 flex h-full flex-col justify-end p-12 text-white">
          <h2 className="text-3xl font-semibold leading-tight tracking-tight">Autonomous support.<br />Human oversight.</h2>
          <p className="mt-3 max-w-md text-sm text-white/70">
            Six specialist agents resolve tickets end-to-end — with a full audit trail, guardrails, and human-in-the-loop escalation.
          </p>
        </div>
      </div>
    </div>
  );
}
