import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const defaultTheme = createTheme();

export default function RegisterPage() {
  const navigate = useNavigate();
  
  // State for error messages
  const [firstNameError, setFirstNameError] = React.useState("");
  const [lastNameError, setLastNameError] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");
  const [generalError, setGeneralError] = React.useState("");

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
        // Handle errors based on the response
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
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  error={!!firstNameError}
                  helperText={firstNameError}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  error={!!lastNameError}
                  helperText={lastNameError}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  error={!!emailError}
                  helperText={emailError}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  error={!!passwordError}
                  helperText={passwordError}
                />
              </Grid>
            </Grid>
            {generalError && (
              <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                {generalError}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
