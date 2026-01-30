import { MOCK_COURSES } from "@/lib/constants/courses";
import GradesClient from "./client";

export async function generateStaticParams() {
  return MOCK_COURSES.map((course) => ({
    id: course.id,
  }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function GradesPage({ params }: PageProps) {
  return <GradesClient params={params} />;
}
