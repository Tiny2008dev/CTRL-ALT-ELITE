import { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="auth-container">
      <h2>Smart Alumni Connect</h2>

      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />

      <button className="primary-btn">Login</button>

      <hr />

      <button className="linkedin-btn">Login with LinkedIn</button>

      <p className="link-text">
        New here? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default Login;
