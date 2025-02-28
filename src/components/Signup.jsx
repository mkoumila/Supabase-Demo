import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';

export function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      // 1. Create the user
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;

      // 2. Add admin role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert([
          { user_id: user.id, role: 'admin' }
        ]);

      if (roleError) throw roleError;

      setMessage('Admin user created successfully!');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Create Admin User</h2>
      {error && <div className="error">{error}</div>}
      {message && <div className="success">{message}</div>}
      <form onSubmit={handleSignup}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input-field"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input-field"
        />
        <button type="submit" className="button button-primary" disabled={loading}>
          {loading ? 'Creating...' : 'Create Admin'}
        </button>
      </form>
    </div>
  );
} 