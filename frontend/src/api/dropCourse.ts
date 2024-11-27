export async function dropCourse(
  courseId: string,
  studentId: string
): Promise<void> {
  const response = await fetch(`/api/dropCourse`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ courseId, studentId }),
  });

  if (!response.ok) {
    throw new Error(`Failed to drop course ${courseId}`);
  }
}
