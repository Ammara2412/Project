import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Box,
  Paper,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const ChangePassword = () => {
  const [apiMessage, setApiMessage] = useState("");
  const [loading, setLoading] = useState(false);

   const navigate = useNavigate();
  // ✅ Validation schema
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    oldPassword: Yup.string().required("Old password is required"),
    newPassword: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("New password is required"),
  });

  // ✅ Handle form submission
  const handleSubmit = async (values, { resetForm }) => {
    setLoading(true);
    setApiMessage("");

    try {
      const response = await axios.put(
        "http://localhost:8081/api/users/change-password",
        values
      );

      if (response.data.status === "success") {
        setApiMessage("✅ Password changed successfully!");
        resetForm();
        navigate('/login');
      } else {
        setApiMessage(response.data.message || "Something went wrong");
      }
    } catch (error) {
      if (error.response) {
        setApiMessage(error.response.data.message || "Server error");
      } else {
        setApiMessage("Network error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          Change Password
        </Typography>

        {apiMessage && (
          <Alert
            severity={apiMessage.includes("success") ? "success" : "error"}
            sx={{ mb: 2 }}
          >
            {apiMessage}
          </Alert>
        )}

        <Formik
          initialValues={{ email: "", oldPassword: "", newPassword: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form>
              <Box mb={2}>
                <Field
                  as={TextField}
                  name="email"
                  label="Email"
                  fullWidth
                  variant="outlined"
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />
              </Box>

              <Box mb={2}>
                <Field
                  as={TextField}
                  name="oldPassword"
                  label="Old Password"
                  type="password"
                  fullWidth
                  variant="outlined"
                  error={touched.oldPassword && Boolean(errors.oldPassword)}
                  helperText={touched.oldPassword && errors.oldPassword}
                />
              </Box>

              <Box mb={3}>
                <Field
                  as={TextField}
                  name="newPassword"
                  label="New Password"
                  type="password"
                  fullWidth
                  variant="outlined"
                  error={touched.newPassword && Boolean(errors.newPassword)}
                  helperText={touched.newPassword && errors.newPassword}
                />
              </Box>

              <Box textAlign="center">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  sx={{
                    textTransform: "none",
                    borderRadius: 2,
                    px: 4,
                    py: 1,
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Change Password"
                  )}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
};

export default ChangePassword;
