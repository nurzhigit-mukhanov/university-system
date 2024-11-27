export interface Course {
  id: number;
  name: string;
}

export async function fetchCoursesByGroup(groupId: string): Promise<Course[]> {
  const response = await fetch(`/api/courses/${groupId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch courses for group ${groupId}`);
  }
  return await response.json();
}
