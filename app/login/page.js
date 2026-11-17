import { redirect } from "next/navigation";
import AuthForm from "../../components/AuthForm";
import AuthShell from "../../components/AuthShell";
import { getUser } from "../../lib/session";
import { login } from "../actions";

export const metadata = { title: "Log in | StudyLane" };

export default async function LoginPage() {
  if (await getUser()) redirect("/dashboard");
  return (
    <AuthShell title="Log in" intro="Welcome back.">
      <AuthForm mode="login" action={login} />
    </AuthShell>
  );
}
