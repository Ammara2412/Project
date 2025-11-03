import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert, Stack } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { resetPassword } from '../services/APIservice.jsx'; // Import the resetPassword function

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email format')
    .matches(/@.*\.com$/, 'Email must contain "@" and end with ".com"')
    .required('Email is mandatory'),
});

const ResetPassword = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [generatedPassword, setGeneratedPassword] = useState(null);

  const navigate = useNavigate();
  const initialValues = { email: '' };

  const handleSubmit = async (values) => {
    try {
      const data = await resetPassword({ email: values.email });
      setGeneratedPassword(data.message); // Assuming backend returns new password in data.message
      setErrorMessage(null);
       navigate('/login');
      
    } catch (error) {
      setGeneratedPassword(null);
      if (error.response?.status === 400) {
        setErrorMessage(error.response.data.message || 'Validation failed');
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: 'auto',
        mt: 6,
        p: 3,
        border: '1px solid #ddd',
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
        Forgot Password
      </Typography>

      {errorMessage && (
        <Stack sx={{ width: '100%', mb: 2 }} spacing={2}>
          <Alert severity="error">{errorMessage}</Alert>
        </Stack>
      )}

      {!generatedPassword ? (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, handleChange, handleBlur, values }) => (
            <Form>
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
                sx={{ mb: 2 }}
              />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
                Continue
              </Button>
            </Form>
          )}
        </Formik>
      ) : (
        <Stack sx={{ width: '100%', mb: 2 }} spacing={2}>
          <Alert severity="info">{generatedPassword}</Alert>
        </Stack>
      )}
    </Box>
  );
};

export default ResetPassword;
