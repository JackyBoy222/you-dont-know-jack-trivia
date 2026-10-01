import { AdminGate } from "@/components/admin/AdminGate";

export const metadata = { title: "Host Console" };

export default function AdminPage() {
  const demoMode = process.env.NEXT_PUBLIC_USE_DEMO_DATA !== "false";
  return <AdminGate
    supabaseUrl={process.env.NEXT_PUBLIC_SUPABASE_URL}
    supabaseAnonKey={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}
    demoMode={demoMode}
  />;
}
