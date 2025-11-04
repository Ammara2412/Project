import React, { useState } from 'react';
import { Container, TextField, Button, Box, Typography, Card } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import Grid from '@mui/material/Grid2';
import * as Yup from 'yup';
import { loginUser } from '../services/APIservice.jsx';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import '../styles/Registration.css';
import loginImage from '../assets/images/Login.jpeg';
import '../App.css';
import bgImage from '../assets/images/BIGIMG.jpg';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Enter a valid email address')
    .matches(/@.*\.com$/, 'Email must contain "@" and end with ".com"')
    .required('Email is required'),
  password: Yup.string()
    .test(
      'no-spaces-only',
      'Password cannot contain only spaces',
      (value) => value && value.trim().length > 0
    )
    .test(
      'trimmed-length',
      'Password must be between 8 and 15 characters',
      (value) => value && value.trim().length >= 8 && value.trim().length <= 15
    )
    .min(8, 'Password must be at least 8 characters')
    .max(15, 'Password must not exceed 15 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
    .required('Password is required'),
});

const LoginPage = () => {
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  
  
  const navigate = useNavigate();

  const initialValues = {
    email: '',
    password: '',
  };

  const handleSubmit = async (values) => {
    try {
      const response = await loginUser(values);
      if (response && response?.status == 200 && response?.data?.status == "success") {
        setSuccessMessage('Success! You have logged in successfully');
        setErrorMessage(null);
        const token = response.data.token;
        const userId = response.data.id; // get from backend
        sessionStorage.setItem("token", token);
         console.log("Token:", token);
         sessionStorage.setItem("userId", userId);
         console.log("userId:", userId);

        navigate('/');
      }
    } catch (error) {
      if (error && error?.status == 404 && error?.response?.data?.message == "User not found") {
        setSuccessMessage(null);
        setErrorMessage('No account associated with this email address. Please check your email or create a new account.');
      } else if (error?.status === 400) {
        const errorMessage = error?.response?.data?.message;
        if (errorMessage === "Incorrect password") {
          setErrorMessage('Oops! The password you entered is incorrect. Please try again.');
        } else if (error?.response?.data?.error?.password) {
          setErrorMessage(error?.response?.data?.error?.password);
        } else {
          setErrorMessage(errorMessage || 'An error occurred. Please try again.');
        }
      } else {
        setSuccessMessage(null);
        setErrorMessage('An unexpected error occurred. Please try again later.');
      }
    }
  };

  return (
    
      <div className="tab-container" style={{
        minHeight: "100vh",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}>
      <Container maxWidth="md">
        <Card sx={{ mt: 4, display: "flex", flexDirection: { xs: "column", md: "row" } }}>
          {/* ✅ Left Side - Form Section */}
          <div className="form-section" style={{ flex: 1, padding: "20px" }}>
            <Typography
              variant="subtitle1"
              align="center"
              className="subtitle"
              sx={{ fontWeight: "bold", mb: 2 }}
            >
              Welcome Back!
            </Typography>

            {successMessage && (
              <Stack sx={{ width: "100%", mt: 1 }} spacing={1}>
                <Alert severity="success">{successMessage}</Alert>
              </Stack>
            )}
            {errorMessage && (
              <Stack sx={{ width: "100%", mt: 1 }} spacing={1}>
                <Alert severity="error">{errorMessage}</Alert>
              </Stack>
            )}

            <Box
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ errors, touched, handleChange, handleBlur, values }) => (
                  <Form style={{ width: "100%" }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Email Address"
                          name="email"
                          variant="outlined"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.email && Boolean(errors.email)}
                          helperText={touched.email && errors.email}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Password"
                          name="password"
                          type="password"
                          id="pwd"
                          variant="outlined"
                          value={values.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.password && Boolean(errors.password)}
                          helperText={touched.password && errors.password}
                        />
                      </Grid>
                    </Grid>

                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
                      Sign In
                    </Button>
                  </Form>
                )}
              </Formik>

              <Typography variant="body2" sx={{ mt: 2 }}>
                Don’t have an account?{" "}
                <Link to="/register" className="Loginlink">
                  Sign Up here
                </Link>
              </Typography>
            </Box>
          </div>

          {/* ✅ Right Side - Illustration Section */}
          <div
            className="illustration-section"
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#fdf6f0",
              borderLeft: "1px solid #f0e6e6",
            }}
          >
            <img
              src={loginImage}
              alt="Login Illustration"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </Card>
      </Container>
    </div>
  );
};


export default LoginPage;
