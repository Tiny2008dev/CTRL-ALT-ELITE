import { useState } from "react";

function Register() {
  const [role, setRole] = useState("alumni");

  return (
    <div className="auth-container">
      <h2>Register</h2>

      {/* Role Selection */}
      <select onChange={(e) => setRole(e.target.value)}>
        <option value="alumni">Alumni</option>
        <option value="student">Student</option>
      </select>

      <input type="text" placeholder="Full Name" />
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />

      <input type="text" placeholder="College Name" />
      <input type="text" placeholder="Department" />

      {/* Alumni-specific */}
      {role === "alumni" && (
        <input type="number" placeholder="Passing Year" />
      )}

      {/* Student-specific */}
      {role === "student" && (
        <input type="number" placeholder="Current Year" />
      )}

      <button className="primary-btn">Register</button>
    </div>
  );
}

export default Register;
