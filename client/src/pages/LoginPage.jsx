import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../util/AuthContext";
import "./LoginPage.css"; // Import the CSS file

export default function LoginPage() {
  const navigate = useNavigate();
  const { setLoggedIn } = useAuth();

  // State for error messages
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setEmailError("");
    setPasswordError("");
    setGeneralError("");
    const data = new FormData(event.currentTarget);

    try {
      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: data.get("email"),
          password: data.get("password"),
        }),
      });

      if (response.ok) {
        const res = await response.json();
        setLoggedIn(true);
        alert(res.message);
        navigate("/");
      } else {
        const errorData = await response.json();
        switch (errorData.errorCode) {
          case "MISSING_FIELDS":
            setGeneralError("Please fill in both email and password.");
            break;
          case "INVALID_EMAIL":
            setEmailError("No account found with this email.");
            break;
          case "INVALID_PASSWORD":
            setPasswordError("The password you entered is incorrect.");
            break;
          case "VALIDATION_ERROR":
            errorData.errors.forEach((error) => {
              if (error.field === "email") setEmailError(error.message);
              if (error.field === "password") setPasswordError(error.message);
            });
            break;
          default:
            setGeneralError("An unexpected error occurred. Please try again.");
        }
      }
    } catch (err) {
      console.error(err);
      setGeneralError("Failed to connect to the server. Please try again.");
    }
  }

  return (
    <div className="Login-container">
      <div className="Login-avatar">
        <i className="fa fa-lock"></i>
      </div>
      <h1 className="Login-title">Sign in</h1>
      <form onSubmit={handleSubmit} noValidate className="Login-form">
        <div className="Login-formGroup">
          <label htmlFor="email" className="Login-label">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            className={`Login-input ${emailError ? "Login-errorBorder" : ""}`}
            required
            autoComplete="email"
            autoFocus
          />
          {emailError && <small className="Login-errorText">{emailError}</small>}
        </div>

        <div className="Login-formGroup">
          <label htmlFor="password" className="Login-label">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className={`Login-input ${passwordError ? "Login-errorBorder" : ""}`}
            required
            autoComplete="current-password"
          />
          {passwordError && <small className="Login-errorText">{passwordError}</small>}
        </div>

        {generalError && <p className="Login-errorText Login-generalError">{generalError}</p>}

        <button type="submit" className="Login-button">
          Sign In
        </button>

        <div className="Login-links">
          <a href="#" className="Login-link">Forgot password?</a>
          <a href="/register" className="Login-link">Don't have an account? Sign Up</a>
        </div>
      </form>
    </div>
  );
}
