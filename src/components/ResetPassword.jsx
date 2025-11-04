import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "./header";

// ✅ Validation Schema
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email field can't be empty"),
});

const ResetPassword = () => {
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  // ✅ Handle Submit
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setError(null);
      const response = await axios.post("http://localhost:8081/api/users/reset-password", {
        email: values.email,
      });

      if (response.data.status === "success") {
        // Extract new password from response message
        const message = response.data.message;
        const passwordMatch = message.match(/New Password is:\s*(.*)/);
        const extractedPassword = passwordMatch ? passwordMatch[1] : "";

        setNewPassword(extractedPassword);
        setOpenDialog(true);
        resetForm();
      } else {
        setError("Unexpected response from server.");
      }
    } catch (err) {
      if (err.response && err.response.data) {
        const backendError = err.response.data.details?.email || err.response.data.message;
        setError(backendError || "Something went wrong. Please try again.");
      } else {
        setError("Unable to connect to the server. Please check your backend.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Handle dialog close
  const handleDialogClose = () => {
    setOpenDialog(false);
    navigate("/login");
  };

  return (
    <div> <Header/>
   
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Box
        sx={{
          width: 400,
          backgroundColor: "#fff",
          borderRadius: 2,
          boxShadow: 3,
          p: 4,
        }}
      >
        <Typography variant="h5" align="center" gutterBottom fontWeight="bold">
          Reset Password
        </Typography>

        <Formik
          initialValues={{ email: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, isSubmitting }) => (
            <Form>
              <Stack spacing={2}>
                <TextField
                  label="Email Address"
                  name="email"
                  variant="outlined"
                  fullWidth
                  value={values.email}
                  onChange={handleChange}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Continue"}
                </Button>

                {error && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                  </Alert>
                )}
              </Stack>
            </Form>
          )}
        </Formik>
      </Box>

      {/* ✅ Success Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Password Reset Successful</DialogTitle>
        <DialogContent>
          <Typography>
            Your password has been reset successfully.
          </Typography>
          <Typography sx={{ mt: 1 }}>
            <strong>New Password:</strong> {newPassword}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} variant="contained" color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
    </div>
  );
};

export default ResetPassword;
