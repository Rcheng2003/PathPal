import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterPage.css"; // Import the new CSS file

export default function RegisterPage() {
  const navigate = useNavigate();

  // State for error messages
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setFirstNameError("");
    setLastNameError("");
    setEmailError("");
    setPasswordError("");
    setGeneralError("");

    const data = new FormData(event.currentTarget);

    try {
      const response = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: data.get("firstName"),
          lastName: data.get("lastName"),
          email: data.get("email"),
          password: data.get("password"),
        }),
      });

      const res = await response.json();

      if (response.ok && res.status === "ok") {
        navigate("/login");
      } else {
        if (res.errorCode === "VALIDATION_ERROR") {
          res.errors.forEach((error) => {
            if (error.field === "firstName") setFirstNameError(error.message);
            if (error.field === "lastName") setLastNameError(error.message);
            if (error.field === "email") setEmailError(error.message);
            if (error.field === "password") setPasswordError(error.message);
          });
        } else if (res.errorCode === "EMAIL_ALREADY_EXISTS") {
          setEmailError("An account with this email already exists.");
        } else {
          setGeneralError(res.errorMessage || "An unexpected error occurred. Please try again.");
        }
      }
    } catch (err) {
      console.error("Error connecting to server:", err);
      setGeneralError("Failed to connect to the server. Please try again.");
    }
  }

  return (
    <div className="Register-container">
      <div className="Register-avatar">
        <i className="fa fa-lock"></i>
      </div>
      <h1 className="Register-title">Sign up</h1>
      <form onSubmit={handleSubmit} noValidate className="Register-form">
        <div className="Register-grid">
          <div className="Register-formGroup">
            <label htmlFor="firstName" className="Register-label">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              className={`Register-input ${firstNameError ? "Register-errorBorder" : ""}`}
              required
              autoComplete="given-name"
              autoFocus
            />
            {firstNameError && <small className="Register-errorText">{firstNameError}</small>}
          </div>

          <div className="Register-formGroup">
            <label htmlFor="lastName" className="Register-label">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              className={`Register-input ${lastNameError ? "Register-errorBorder" : ""}`}
              required
              autoComplete="family-name"
            />
            {lastNameError && <small className="Register-errorText">{lastNameError}</small>}
          </div>
        </div>

        <div className="Register-formGroup">
          <label htmlFor="email" className="Register-label">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            className={`Register-input ${emailError ? "Register-errorBorder" : ""}`}
            required
            autoComplete="email"
          />
          {emailError && <small className="Register-errorText">{emailError}</small>}
        </div>

        <div className="Register-formGroup">
          <label htmlFor="password" className="Register-label">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className={`Register-input ${passwordError ? "Register-errorBorder" : ""}`}
            required
            autoComplete="new-password"
          />
          {passwordError && <small className="Register-errorText">{passwordError}</small>}
        </div>

        {generalError && <p className="Register-errorText Register-generalError">{generalError}</p>}

        <button type="submit" className="Register-button">Sign Up</button>

        <div className="Register-links">
          <a href="/login" className="Register-link">Already have an account? Sign in</a>
        </div>
      </form>
    </div>
  );
}
