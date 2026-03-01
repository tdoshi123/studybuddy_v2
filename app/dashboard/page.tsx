import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const role = user.unsafeMetadata?.role as
    | "student"
    | "parent"
    | "teacher"
    | "admin"
    | undefined;

  if (!role) {
    redirect("/onboarding");
  }

  switch (role) {
    case "student":
      redirect("/student");
    case "parent":
      redirect("/parent");
    case "teacher":
      redirect("/teacher");
    case "admin":
      redirect("/admin");
    default:
      redirect("/onboarding");
  }
}
