import { redirect } from "next/navigation";
import AuthForm from "../../components/AuthForm";
import AuthShell from "../../components/AuthShell";
import { getUser } from "../../lib/session";
import { signup } from "../actions";

export const metadata = { title: "Sign up | StudyLane" };

export default async function SignupPage() {
  if (await getUser()) redirect("/dashboard");
  return (
    <AuthShell title="Create your account" intro="One plan for all your courses.">
      <AuthForm mode="signup" action={signup} />
    </AuthShell>
  );
}
