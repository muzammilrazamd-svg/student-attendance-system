import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const [dark, setDark] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  function fetchStudents() {
    fetch("http://localhost:5000/students")
      .then((res) => res.json())
      .then((data) => setStudents(data));
  }

  function addStudent() {
    if (name.trim() === "") return;

    fetch("http://localhost:5000/students", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    })
      .then((res) => res.json())
      .then((data) => {
        setStudents(data);
        setName("");
      });
  }

  function updateData(url, method = "PUT", body = null) {
    fetch(url, {
      method,
      headers: body
        ? {
            "Content-Type": "application/json",
          }
        : {},
      body: body ? JSON.stringify(body) : null,
    })
      .then((res) => res.json())
      .then((data) => setStudents(data));
  }

  function exportCSV() {
    let csv = "Name,Present,Absent\n";

    students.forEach((student) => {
      csv += `${student.name},${student.present_count},${student.absent_count}\n`;
    });

    const blob = new Blob([csv], {
      type: "text/csv",
    });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "attendance.csv";
    a.click();
  }

  const filtered = students.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase())
  );

  const total = students.length;

  return (
    <div className={dark ? "dark" : "container"}>
      <h1>🎓 ANITS Student Attendance System</h1>

      <button onClick={() => setDark(!dark)}>
        {dark ? "Light Mode" : "Dark Mode"}
      </button>

      <button onClick={exportCSV}>Export CSV</button>

      <br />

      <input
        placeholder="Search Student"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <input
        placeholder="Enter Student Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button onClick={addStudent}>Add Student</button>

      <div className="dashboard">
        <div>Total Students: {total}</div>
      </div>

      {filtered.map((student) => {
        const totalAttendance =
          student.present_count + student.absent_count;

        const percentage =
          totalAttendance === 0
            ? 0
            : (
                (student.present_count / totalAttendance) *
                100
              ).toFixed(1);

        return (
          <div
            key={student.id}
            className="student-card"
          >
            <h2>{student.name}</h2>

            <p>Present: {student.present_count}</p>

            <p>Absent: {student.absent_count}</p>

            <p>
              Attendance Percentage:
              {" "}
              {percentage}%
            </p>

            <button
              onClick={() =>
                updateData(
                  `http://localhost:5000/students/${student.id}/present`
                )
              }
            >
              Present
            </button>

            <button
              onClick={() =>
                updateData(
                  `http://localhost:5000/students/${student.id}/absent`
                )
              }
            >
              Absent
            </button>

            <button
              onClick={() =>
                updateData(
                  `http://localhost:5000/students/${student.id}/reset`
                )
              }
            >
              Reset
            </button>

            <button
              onClick={() => {
                const newName =
                  prompt("Enter new name");

                if (newName) {
                  updateData(
                    `http://localhost:5000/students/${student.id}/edit`,
                    "PUT",
                    { name: newName }
                  );
                }
              }}
            >
              Edit
            </button>

            <button
              onClick={() => {
                const confirmDelete =
                  window.confirm(
                    "Are you sure you want to delete this student?"
                  );

                if (confirmDelete) {
                  updateData(
                    `http://localhost:5000/students/${student.id}`,
                    "DELETE"
                  );
                }
              }}
            >
              Delete
            </button>
          </div>
        );
      })}

      <footer>
        <h3>Student Attendance Management System</h3>

        <p>
          Developed By:
          M.D Muzammil Raza
        </p>

        <p>B.Tech CSE | ANITS</p>

        <p>React • Express.js • MySQL</p>
      </footer>
    </div>
  );
}

export default App;