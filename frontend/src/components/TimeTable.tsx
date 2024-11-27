import { TimetableEntry } from "@api/fetchTimetable";

interface TimeTableProps {
  timeTable: TimetableEntry[];
}

export function TimeTable({ timeTable }: TimeTableProps): JSX.Element {
  return (
    <ul>
      {timeTable.map((entry) => (
        <li key={entry.id}>
          {entry.courseName} - {entry.day} at {entry.time}
        </li>
      ))}
    </ul>
  );
}
