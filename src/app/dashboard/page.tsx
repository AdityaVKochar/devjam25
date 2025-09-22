import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/options";
import clientPromise from "../../lib/mongodb";
import Dashboard from "../../components/Dashboard";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session || !session.user || !session.user.email) {
    redirect(`/signin?callbackUrl=/dashboard`);
  }

  const client = await clientPromise;
  return <Dashboard />;
}
