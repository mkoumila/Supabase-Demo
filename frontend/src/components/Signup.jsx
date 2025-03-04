import { useState } from "react";
import { supabase } from "../utils/supabaseClient";

export function Signup({ onToggleLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const {
        data: { user },
        error: signUpError,
      } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;

      // Add user role (default to 'user')
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert([{ user_id: user.id, role: "user" }]);

      if (roleError) throw roleError;

      setMessage(
        "Account created successfully! Please check your email for verification."
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Create Account</h2>
      {error && <div>{error}</div>}
      {message && <div>{message}</div>}
      <form onSubmit={handleSignup}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Sign Up"}
        </button>
      </form>
      <p>
        Already have an account? <button onClick={onToggleLogin}>Login</button>
      </p>
    </div>
  );
}
