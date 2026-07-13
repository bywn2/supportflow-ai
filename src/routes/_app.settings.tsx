import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/settings")({
  component: Settings,
  head: () => ({ meta: [{ title: "Settings — SupportOps AI" }] }),
});

const team = [
  { name: "Alex Chen", email: "alex@supportops.ai", role: "Admin" },
  { name: "Sofia Petrov", email: "sofia@supportops.ai", role: "Approver" },
  { name: "Marcus Ojo", email: "marcus@supportops.ai", role: "Executor" },
  { name: "Priya Ramaswamy", email: "priya@supportops.ai", role: "Viewer" },
  { name: "Yuki Tanaka", email: "yuki@supportops.ai", role: "Approver" },
];

function Settings() {
  const [inviteOpen, setInviteOpen] = useState(false);

  return (
    <div>
      <PageHeader title="Settings" description="Manage your organization, team and platform preferences." />

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="api">API keys</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4 max-w-2xl space-y-4">
          <Card className="p-4 space-y-3">
            <div className="space-y-1.5"><Label>Organization name</Label><Input defaultValue="SupportOps, Inc." /></div>
            <div className="space-y-1.5"><Label>Timezone</Label><Input defaultValue="America/New_York" /></div>
            <div className="space-y-1.5"><Label>Working hours</Label><Input defaultValue="Mon–Fri, 9:00 – 18:00" /></div>
            <Button size="sm" onClick={() => toast.success("Settings saved")}>Save changes</Button>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="mt-4">
          <div className="mb-3 flex justify-end">
            <Button size="sm" onClick={() => setInviteOpen(true)}><Plus className="mr-1.5 h-3.5 w-3.5" /> Invite member</Button>
          </div>
          <Card className="p-0 overflow-hidden">
            <Table>
              <TableHeader><TableRow><TableHead>Member</TableHead><TableHead>Email</TableHead><TableHead>Role</TableHead></TableRow></TableHeader>
              <TableBody>
                {team.map((m) => (
                  <TableRow key={m.email}>
                    <TableCell><div className="flex items-center gap-2"><Avatar className="h-6 w-6"><AvatarFallback className="text-[10px]">{m.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback></Avatar>{m.name}</div></TableCell>
                    <TableCell className="text-xs text-muted-foreground">{m.email}</TableCell>
                    <TableCell><Badge variant="secondary">{m.role}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="mt-4 max-w-2xl">
          <Card className="p-4">
            <div className="text-sm">Current plan: <span className="font-semibold">Enterprise</span></div>
            <div className="mt-2 text-xs text-muted-foreground">Next invoice on the 1st of next month.</div>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-4 max-w-2xl">
          <Card className="p-4 space-y-3 text-sm">
            <div className="flex justify-between"><span>Enforce SSO</span><Badge>Enabled</Badge></div>
            <div className="flex justify-between"><span>Require 2FA for admins</span><Badge>Enabled</Badge></div>
            <div className="flex justify-between"><span>Session length</span><span className="text-muted-foreground">8 hours</span></div>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="mt-4 max-w-2xl">
          <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between"><span className="text-sm">Production key</span><span className="font-mono text-xs text-muted-foreground">sk_live_••••••••2f4a</span></div>
            <div className="flex items-center justify-between"><span className="text-sm">Sandbox key</span><span className="font-mono text-xs text-muted-foreground">sk_test_••••••••b711</span></div>
            <Button size="sm" variant="outline" onClick={() => toast.success("New key generated")}>Rotate keys</Button>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Invite team member</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5"><Label>Email</Label><Input placeholder="teammate@company.com" /></div>
            <div className="space-y-1.5"><Label>Role</Label><Input defaultValue="Approver" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>Cancel</Button>
            <Button onClick={() => { setInviteOpen(false); toast.success("Invitation sent"); }}>Send invite</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
