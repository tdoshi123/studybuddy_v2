import { MOCK_COURSES } from "@/lib/constants/courses";
import AssignmentsClient from "./client";

export async function generateStaticParams() {
  return MOCK_COURSES.map((course) => ({
    id: course.id,
  }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AssignmentsPage({ params }: PageProps) {
  return <AssignmentsClient params={params} />;
}
