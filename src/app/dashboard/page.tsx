import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/options";
import clientPromise from "../../lib/mongodb";
import NewUserDashboard from "../../components/newuserdashboard";
import OldUserDashboard from "../../components/olduserdashboard";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session || !session.user || !session.user.email) {
    redirect(`/signin?callbackUrl=/dashboard`);
  }

  const client = await clientPromise;
  const db = client.db();
  const user = await db.collection("users").findOne({ email: session.user.email });

  if (!user || user.isNew === true) {
    // mark as not new for future signins
    if (user) {
      await db.collection("users").updateOne({ email: session.user.email }, { $set: { isNew: false } });
    } else {
      await db.collection("users").insertOne({ email: session.user.email, isNew: false, createdAt: new Date() });
    }
    return <NewUserDashboard />;
  }

  return <OldUserDashboard />;
}
