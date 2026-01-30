import { MOCK_COURSES } from "@/lib/constants/courses";
import AssignmentDetailClient from "./client";

export function generateStaticParams() {
  const assignmentIds = ["1", "3", "4", "5", "6", "7", "9"];
  const courseIds = MOCK_COURSES.map(c => c.id);
  
  // Generate all combinations
  const params: { id: string; assignmentId: string }[] = [];
  for (const id of courseIds) {
    for (const assignmentId of assignmentIds) {
      params.push({ id, assignmentId });
    }
  }
  
  return params;
}

interface PageProps {
  params: Promise<{ id: string; assignmentId: string }>;
}

export default function AssignmentDetailPage({ params }: PageProps) {
  return <AssignmentDetailClient params={params} />;
}
