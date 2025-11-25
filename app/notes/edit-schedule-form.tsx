"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function EditScheduleForm() {
  const [sundays, setSundays] = useState<string[]>([]);
  const [students, setStudents] = useState<string[]>([]);
  const [teachers, setTeachers] = useState<string[]>([
    "Faye",
    "Jocelyn",
    "by himself",
    "Ling-Ling",
    "Jarrett",
    "Jianglin",
    "MaxLi",
    "Boyan's parent",
    "Xinghua",
    "Yvonne",
    "Youyou",
    "Shuyan",
    "Yong",
    "Sophie",
    "Tricia",
    "Qingli",
    "Muduo's parent",
    "Audrey's parent",
    "Fei Ying",
    "Parent requested off",
  ]);
  const [selectedSunday, setSelectedSunday] = useState<string>("");
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [oldTeacher, setOldTeacher] = useState<string>("");
  const [newTeacher, setNewTeacher] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    // Generate Sundays
    const sundaysList = [];
    // Use UTC to avoid timezone issues
    let currentDate = new Date(Date.UTC(2025, 10, 23)); // November is month 10
    const endDate = new Date(Date.UTC(2026, 11, 31)); // December is month 11

    // Find the first Sunday on or after the start date
    while (currentDate.getUTCDay() !== 0) {
      currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }

    // Add all subsequent Sundays until the end date
    while (currentDate <= endDate) {
      sundaysList.push(currentDate.toISOString().split("T")[0]);
      currentDate.setUTCDate(currentDate.getUTCDate() + 7);
    }
    setSundays(sundaysList);

    // Fetch students from a predefined list or another source
    setStudents([
      "Dana",
      "Benjamin",
      "Christina",
      "MaxLee",
      "Raymond",
      "Boyan1",
      "Boyan2",
      "Muduo1",
      "Muduo2",
      "Audrey1",
      "Audrey2",
    ]);
  }, []);

  useEffect(() => {
    const fetchOldTeacher = async () => {
      if (selectedSunday && selectedStudent) {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("schedules")
          .select(selectedStudent)
          .eq("Date", selectedSunday)
          .single();

        if (data) {
          setOldTeacher((data as any)[selectedStudent]);
        } else {
          setOldTeacher("");
        }
      }
    };

    fetchOldTeacher();
  }, [selectedSunday, selectedStudent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    const { data, error } = await supabase
      .from("schedules")
      .update({ [selectedStudent]: newTeacher })
      .eq("Date", selectedSunday);

    if (error) {
      setMessage(`Error updating schedule: ${error.message}`);
    } else {
      setMessage("Schedule updated successfully!");
      // Refresh old teacher value
      const { data: updatedData } = await supabase
        .from("schedules")
        .select(selectedStudent)
        .eq("Date", selectedSunday)
        .single();
      if (updatedData) {
        setOldTeacher((updatedData as any)[selectedStudent]);
      }
    }
  };

  return (
    <div className="p-4 border rounded-md max-w-md mx-auto my-8 bg-gray-100">
      <h2>Edit Schedule</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Sunday:</label>
          <select
            value={selectedSunday}
            onChange={(e) => setSelectedSunday(e.target.value)}
            required
          >
            <option value="">Select a Sunday</option>
            {sundays.map((sunday) => (
              <option key={sunday} value={sunday}>
                {sunday}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Student:</label>
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            required
          >
            <option value="">Select a Student</option>
            {students.map((student) => (
              <option key={student} value={student}>
                {student}
              </option>
            ))}
          </select>
        </div>
        {selectedSunday && selectedStudent && (
          <div>
            <p>Currently Assigned Teacher: {oldTeacher}</p>
          </div>
        )}
        <div>
          <label>New Teacher:</label>
          <select
            value={newTeacher}
            onChange={(e) => setNewTeacher(e.target.value)}
            required
          >
            <option value="">Select a Teacher</option>
            {teachers.map((teacher) => (
              <option key={teacher} value={teacher}>
                {teacher}
              </option>
            ))}
          </select>
        </div>
        <button className="border p-2 mt-2 hover:bg-gray-500" type="submit">
          Update Schedule
        </button>
      </form>
      {message && <p>{message}</p>}
      <div className="h-32">&nbsp;</div>
    </div>
  );
}
