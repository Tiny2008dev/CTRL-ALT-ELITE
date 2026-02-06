import { Link } from "react-router-dom";
import { useState } from "react";

function Register() {
  const [role, setRole] = useState("alumni");

  return (
    <div className="auth-container">
      <h2>Register</h2>

      <select onChange={(e) => setRole(e.target.value)}>
        <option value="alumni">Alumni</option>
        <option value="student">Student</option>
      </select>

      <input type="text" placeholder="Full Name" />
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />
      <input type="text" placeholder="College" />
      <input type="text" placeholder="Department" />

      {role === "alumni" && (
        <input type="number" placeholder="Passing Year" />
      )}

      {role === "student" && (
        <input type="number" placeholder="Current Year" />
      )}

      <button className="primary-btn">Register</button>

      <p className="link-text">
        Already have an account? <Link to="/">Login</Link>
      </p>
    </div>
  );
}

export default Register;
