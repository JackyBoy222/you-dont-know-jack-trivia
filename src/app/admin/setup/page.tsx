import { SetPasswordForm } from "@/components/auth/SetPasswordForm";

export const metadata = { title: "Set host password" };

export default function HostSetupPage() {
  return (
    <SetPasswordForm
      supabaseUrl={process.env.NEXT_PUBLIC_SUPABASE_URL}
      supabaseAnonKey={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}
    />
  );
}
