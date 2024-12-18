import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import logo from '../Components/text.png';
import axios from 'axios';
import {
    TextField,
    Button,
    Grid,
    Paper,
    Typography,
    CircularProgress,
    Container,
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
import { auth } from '../Firebase/Firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const RegistrationForm = () => {
    const { register, handleSubmit, reset } = useForm();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [registeredData, setRegisteredData] = useState({});
    const navigate = useNavigate();

    // Check if the user is authenticated
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                navigate('/login'); // Redirect to login if not authenticated
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    // Function to handle form submission
    const apiUrl = process.env.REACT_APP_API_URL;
    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await axios.post(`${apiUrl}/register`, data);
            setRegisteredData(data);
            setOpen(true);
        } catch (error) {
            console.error('Error registering student:', error);
            alert('Registration failed!');
        }
        setLoading(false);
    };

    // Function to handle dialog close and form reset
    const handleClose = () => {
        setOpen(false);
        reset();
    };

    return (
        <Container component="main" maxWidth="md">
            <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
                <Box display="flex" alignItems="center" justifyContent="center" mb={3}>
                    <img src={logo} alt="logo" style={{ width: '80px', height: 'auto' }} />
                </Box>
                <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    align="center"
                    fontWeight="bold"
                    style={{ color: '#7D0541' }}
                >
                    Student Registration
                </Typography>
                <Typography variant="body1" align="center" color="textSecondary" gutterBottom>
                    Please fill out the form below to register a new student.
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="First Name"
                                variant="outlined"
                                fullWidth
                                {...register('firstName')}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Last Name"
                                variant="outlined"
                                fullWidth
                                {...register('lastName')}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Gender"
                                variant="outlined"
                                fullWidth
                                {...register('gender')}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Date of Birth"
                                type="date"
                                variant="outlined"
                                fullWidth
                                {...register('dob')}
                                required
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Address"
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={3}
                                {...register('address')}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Parent Name"
                                variant="outlined"
                                fullWidth
                                {...register('parentName')}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Parent Email"
                                type="email"
                                variant="outlined"
                                fullWidth
                                {...register('parentEmail')}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Parent Contact"
                                variant="outlined"
                                fullWidth
                                {...register('parentContact')}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Cast"
                                variant="outlined"
                                fullWidth
                                {...register('cast')}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Region"
                                variant="outlined"
                                fullWidth
                                {...register('region')}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Year of Admission"
                                type="number"
                                variant="outlined"
                                fullWidth
                                {...register('yearOfAdmission')}
                                InputProps={{
                                    inputProps: {
                                        min: 1900,
                                        max: 2100,
                                        step: 1,
                                    },
                                }}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} align="center">
                            <Button
                                variant="contained"
                                type="submit"
                                fullWidth
                                disabled={loading}
                                sx={{
                                    py: 1.5,
                                    fontWeight: 'bold',
                                    color: 'white',
                                    background: 'linear-gradient(45deg, #7D0541, #FF5C93)',
                                    borderRadius: '30px',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                                    '&:hover': {
                                        background: 'linear-gradient(45deg, #FF5C93, #7D0541)',
                                        transform: 'scale(1.05)',
                                        boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.3)',
                                    },
                                    '&:disabled': {
                                        background: '#ccc',
                                        color: '#666',
                                    },
                                }}
                            >
                                {loading ? (
                                    <CircularProgress size={24} sx={{ color: 'white' }} />
                                ) : (
                                    'Register'
                                )}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Registration Successful</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            The student has been successfully registered with the following details:
                        </DialogContentText>
                        <Box mt={2}>
                            <Typography variant="body2">
                                <strong>First Name:</strong> {registeredData.firstName}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Last Name:</strong> {registeredData.lastName}
                            </Typography>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>
            </Paper>
        </Container>
    );
};

export default RegistrationForm;
