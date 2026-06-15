import { useEffect, useState } from "react";
import { Plus, Shield, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import DataTable from "@/components/ui/DataTable";
import AddUserDialog, { ASSIGNABLE_ROLES } from "@/components/team/AddUserDialog";
import { useUsersStore } from "@/stores/usersStore";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "@/components/ui/use-toast";

export default function Team() {
  const { user } = useAuth();
  const isSuperAdmin = (user?.roles || []).includes("SuperAdmin");

  const users = useUsersStore((s) => s.users);
  const fetchUsers = useUsersStore((s) => s.fetchUsers);
  const createUser = useUsersStore((s) => s.createUser);
  const changeRole = useUsersStore((s) => s.changeRole);
  const changeStatus = useUsersStore((s) => s.changeStatus);
  const removeUser = useUsersStore((s) => s.removeUser);
  const mutating = useUsersStore((s) => s.mutating);

  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const isSelf = (row) => row.id === user?.id;

  const handleCreate = async (form) => {
    const ok = await createUser(form);
    if (ok) { setAddOpen(false); toast({ title: "User created", description: `${form.email} was added.` }); }
    else toast({ title: "Could not create user", description: "Check the details and try again.", variant: "destructive" });
  };

  const handleRole = async (row, role) => {
    if (role === row.role) return;
    const ok = await changeRole(row.id, role);
    toast(ok ? { title: "Role updated" } : { title: "Could not update role", variant: "destructive" });
  };

  const handleStatus = async (row) => {
    const ok = await changeStatus(row.id, !row.is_active);
    toast(ok ? { title: "Status updated" } : { title: "Could not update status", variant: "destructive" });
  };

  const handleDelete = async (row) => {
    const ok = await removeUser(row.id);
    toast(ok ? { title: "User deleted" } : { title: "Could not delete user", variant: "destructive" });
  };

  const columns = [
    { key: "full_name", label: "Name", render: (r) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center text-xs font-bold">
          {(r.full_name || r.email)?.[0]?.toUpperCase() || "?"}
        </div>
        <span className="font-medium">{r.full_name || "—"}</span>
      </div>
    )},
    { key: "email", label: "Email", render: (r) => <span className="text-xs">{r.email}</span> },
    { key: "role", label: "Role", render: (r) => (
      isSuperAdmin && !isSelf(r) ? (
        <Select value={r.role} onValueChange={(v) => handleRole(r, v)} disabled={mutating}>
          <SelectTrigger className="h-8 w-[150px] text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>{ASSIGNABLE_ROLES.map((role) => <SelectItem key={role} value={role}>{role}</SelectItem>)}</SelectContent>
        </Select>
      ) : (
        <div className="flex items-center gap-1.5"><Shield className="w-3 h-3 text-primary" /><span className="text-xs">{r.role}</span></div>
      )
    )},
    { key: "is_active", label: "Status", render: (r) => (
      isSuperAdmin && !isSelf(r) ? (
        <Button size="sm" variant={r.is_active ? "outline" : "secondary"} className="h-7 text-xs" disabled={mutating} onClick={() => handleStatus(r)}>
          {r.is_active ? "Active" : "Inactive"}
        </Button>
      ) : (
        <span className={`text-xs px-2 py-0.5 rounded-full ${r.is_active ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"}`}>
          {r.is_active ? "Active" : "Inactive"}
        </span>
      )
    )},
    { key: "created_date", label: "Joined", render: (r) => (r.created_date ? new Date(r.created_date).toLocaleDateString() : "—") },
  ];

  if (isSuperAdmin) {
    columns.push({
      key: "actions", label: "", className: "text-right", render: (r) => (
        isSelf(r) ? null : (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive" disabled={mutating}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete {r.full_name || r.email}?</AlertDialogTitle>
                <AlertDialogDescription>This permanently removes the user's portal access. This cannot be undone.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-destructive text-destructive-foreground" onClick={() => handleDelete(r)}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )
      ),
    });
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading">Team & Users</h1>
          <p className="text-sm text-muted-foreground">Manage internal portal users and roles.</p>
        </div>
        {isSuperAdmin && (
          <Button className="bg-primary text-primary-foreground" onClick={() => setAddOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add User
          </Button>
        )}
      </div>

      <DataTable columns={columns} data={users} emptyMessage="No team members found" />

      {isSuperAdmin && (
        <AddUserDialog open={addOpen} onOpenChange={setAddOpen} onSubmit={handleCreate} isLoading={mutating} />
      )}
    </div>
  );
}
