import { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="auth-container">
      <h2>Smart Alumni Connect</h2>
      <p>Login to your account</p>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="primary-btn">Login</button>

      <hr />

      <button className="linkedin-btn">
        Login with LinkedIn
      </button>

      <p className="link-text">New here? Register</p>
    </div>
  );
}

export default Login;
