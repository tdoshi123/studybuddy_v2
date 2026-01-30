import { MOCK_COURSES } from "@/lib/constants/courses";
import ClasslistClient from "./client";

export async function generateStaticParams() {
  return MOCK_COURSES.map((course) => ({
    id: course.id,
  }));
}

export default function ClasslistPage() {
  return <ClasslistClient />;
}
