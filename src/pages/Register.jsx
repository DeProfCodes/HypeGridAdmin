import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

// Public self-registration is intentionally DISABLED for the admin portal.
// Internal accounts are created by a SuperAdmin from the Team page
// (Team & Users → Add User). The route is kept so existing links don't 404,
// but it no longer opens open registration. See HypeGrid registration model:
// phase 1 = admin-created users only.
export default function Register() {
  return (
    <AuthLayout
      icon={ShieldCheck}
      title="Accounts are admin-managed"
      subtitle="HypeGrid admin access is invitation-only"
      footer={
        <Link to="/login" className="text-primary font-medium hover:underline inline-flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to log in
        </Link>
      }
    >
      <div className="rounded-lg border border-border/40 bg-muted/20 p-4 text-sm text-muted-foreground">
        Team accounts are created by an administrator. Please contact your HypeGrid admin to
        request access — they can add you from the Team &amp; Users area.
      </div>

      <Link to="/login">
        <Button className="w-full h-12 font-medium mt-6">Go to log in</Button>
      </Link>
    </AuthLayout>
  );
}
