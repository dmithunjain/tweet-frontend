import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:7000/api/login", {
        email,
        password,
      });

      console.log("LOGIN RESPONSE:", res.data);

      if (res.data.success) {
        // ✅ STORE TOKEN
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.userId);

        alert(res.data.message || "Login successful");
        navigate("/tweets");
      } else {
        alert(res.data.message || "Login failed");
      }

    } catch (error) {
      console.error(error);
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ===== CSS (UNCHANGED) ===== */}
      <style>{`
        body {
          background: linear-gradient(120deg, #671ce0, #005126);
        }

        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .login-card {
          width: 360px;
          padding: 35px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(12px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);
          color: #fff;
          text-align: center;
        }

        .login-card h2 {
          font-size: 26px;
          font-weight: 700;
          margin-bottom: 6px;
        }

        .subtitle {
          font-size: 14px;
          opacity: 0.85;
          margin-bottom: 25px;
        }

        .input-group {
          position: relative;
          margin-bottom: 22px;
        }

        .input-group input {
          width: 100%;
          padding: 14px 12px;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.4);
          border-radius: 8px;
          color: #fff;
          font-size: 14px;
          outline: none;
        }

        .input-group label {
          position: absolute;
          top: 50%;
          left: 12px;
          transform: translateY(-50%);
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
          pointer-events: none;
          transition: 0.3s ease;
        }

        .input-group input:focus + label,
        .input-group input:not(:placeholder-shown) + label {
          top: -6px;
          background: rgba(0, 0, 0, 0.6);
          padding: 0 6px;
          font-size: 11px;
          color: #00f260;
        }

        .login-btn {
          width: 100%;
          padding: 14px;
          border-radius: 8px;
          border: none;
          background: linear-gradient(135deg, #00f260, #0575e6);
          color: #fff;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 10px;
        }

        .login-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>

      {/* ===== UI (UNCHANGED) ===== */}
      <div className="login-page">
        <div className="login-card">
          <h2>Welcome Back</h2>
          <p className="subtitle">Login to your account</p>

          <div className="input-group">
            <input
              type="email"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>Email Address</label>
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label>Password</label>
          </div>

          <button
            className="login-btn"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </div>
    </>
  );
};

export default Login;
