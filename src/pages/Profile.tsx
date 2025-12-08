// src/pages/Profile.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client"; // <- matches ProfileMenu
import { Card, CardContent } from "@/components/ui/card"; // optional, adjust if not used
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Login from "Login";

export default function Profile() {
  const [email, setEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      setEmail(user?.email ?? null);

      if (user?.id) {
        // try to fetch profile row (if you have a "profiles" table)
        const res = await supabase.from("profiles").select("*").eq("id", user.id).single();
        if (!res.error) setProfile(res.data);
      }
    })();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <div>
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>Back</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="mb-4">
            <div className="text-sm text-muted-foreground">Email</div>
            <div className="font-medium">{email ?? "-"}</div>
          </div>

          {profile ? (
            <>
              <div className="mb-4">
                <div className="text-sm text-muted-foreground">Name</div>
                <div className="font-medium">{profile.full_name ?? "-"}</div>
              </div>
              <div className="mb-4">
                <div className="text-sm text-muted-foreground">Role</div>
                <div className="font-medium">{profile.role ?? "-"}</div>
              </div>
            </>
          ) : (
            <div className="text-sm text-slate-500">No profile row found. Create one in the DB or via your app.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
