import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      // 🔁 TEMP TEST API (works without backend)
      const res = await axios.post(
        "http://localhost:7000/api/register",   
        formData
      );

      console.log(res.data);
      alert("Registered successfully!");

      setFormData({
        name: "",
        email: "",
        password: "",
      });
    } catch (error) {
      alert("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ===== CSS (NORMAL CSS IN SAME FILE) ===== */}
      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-family: "Segoe UI", sans-serif;
        }

        body {
          background: linear-gradient(120deg, #1cb5e0, #000851);
        }

        .register-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .register-card {
          width: 360px;
          padding: 35px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(12px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);
          color: #fff;
          text-align: center;
        }

        .register-card h1 {
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

        .register-btn {
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
          transition: 0.2s ease;
        }

        .register-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .footer-text {
          margin-top: 18px;
          font-size: 13px;
          opacity: 0.9;
        }

        .footer-text span {
          color: #00f260;
          font-weight: 600;
          cursor: pointer;
        }
      `}</style>

      {/* ===== UI ===== */}
      <div className="register-page">
        <div className="register-card">
          <h1>Create Account</h1>
          <p className="subtitle">Join us and start your journey</p>

          <div className="input-group">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder=" "
            />
            <label>Full Name</label>
          </div>

          <div className="input-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder=" "
            />
            <label>Email Address</label>
          </div>

          <div className="input-group">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder=" "
            />
            <label>Password</label>
          </div>

          <button
            className="register-btn"
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <p className="footer-text">
            Already have an account? <span>Login</span>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;
