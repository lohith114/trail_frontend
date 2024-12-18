import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../Firebase/Firebase';
import { onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';
import Header from './Header';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    CircularProgress,
    Button,
} from '@mui/material';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Welcome = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [studentCount, setStudentCount] = useState(0);
    const [userCount, setUserCount] = useState(0);
    const [paymentStatusCounts, setPaymentStatusCounts] = useState({ paid: 0, unpaid: 0, partiallyPaid: 0 });
    const [attendanceData, setAttendanceData] = useState([]);
    const [selectedClass, setSelectedClass] = useState("");
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL;


    const classButtons = [
        { label: "C1", class: "Class1", color: "#FF5733" },
        { label: "C2", class: "Class2", color: "#33FF57" },
        { label: "C3", class: "Class3", color: "#3357FF" },
        { label: "C4", class: "Class4", color: "#FF33A1" },
        { label: "C5", class: "Class5", color: "#FFD433" },
        { label: "C6", class: "Class6", color: "#33D4FF" },
        { label: "C7", class: "Class7", color: "#FF8C33" },
        { label: "C8", class: "Class8", color: "#33FFDD" },
        { label: "C9", class: "Class9", color: "#F333FF" },
        { label: "C10", class: "Class10", color: "#FF3357" },
    ];

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                navigate('/'); // Redirect to login if not authenticated
            }
            setIsLoading(false);
        });

        const fetchStudentCount = async () => {
            try {
                const response = await axios.get(`${apiUrl}/studentcount`);
                setStudentCount(response.data.studentCount);
            } catch (error) {
                console.error('Error fetching student count:', error);
            }
        };

        const fetchUserCount = async () => {
            try {
                const response = await axios.get(`${apiUrl}/getUsers`);
                setUserCount(response.data.length);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        const fetchPaymentStatusCounts = async () => {
            try {
                const response = await axios.get(`${apiUrl}/feestatuscount`);
                setPaymentStatusCounts({
                    paid: response.data.paid || 0,
                    unpaid: response.data.unpaid || 0,
                    partiallyPaid: response.data.partiallyPaid || 0,
                });
            } catch (error) {
                console.error('Error fetching payment status counts:', error);
            }
        };

        fetchStudentCount();
        fetchUserCount();
        fetchPaymentStatusCounts();

        if (selectedClass) {
            fetchAttendanceData(selectedClass);
        }

        return () => unsubscribe();
    }, [navigate, selectedClass]);

    const fetchAttendanceData = async (classSheet) => {
        try {
            const response = await axios.post(`${apiUrl}/attendance/tracker`, { classSheet });
            setAttendanceData(response.data.tracker);
        } catch (error) {
            console.error('Error fetching attendance data:', error);
        }
    };

    const handleClassChange = (className) => {
        setSelectedClass(className);
        setAttendanceData([]);
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <div>
            <Header />
            <Box sx={{ marginTop: '100px', padding: 3, backgroundColor: '#f5f7fa', borderRadius: 2 }}>
                <Grid container spacing={3}>
                    {/* Card for Registered Students Count */}
                    <Grid item xs={12} md={4}>
                        <Card sx={{ backgroundColor: '#fce4ec', borderRadius: 2, padding: 3, boxShadow: 3, textAlign: 'center' }}>
                            <CardContent>
                                <Typography variant="h6" color="textSecondary" gutterBottom>Registered Students</Typography>
                                <Typography variant="h4" color="#D81B60" sx={{ fontWeight: 'bold' }}>{studentCount}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Card for User Count */}
                    <Grid item xs={12} md={4}>
                        <Card sx={{ backgroundColor: '#e8f5e9', borderRadius: 2, padding: 3, boxShadow: 3, textAlign: 'center' }}>
                            <CardContent>
                                <Typography variant="h6" color="textSecondary" gutterBottom>Total Users</Typography>
                                <Typography variant="h4" color="#388E3C" sx={{ fontWeight: 'bold' }}>{userCount}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Card for Payment Status */}
                    <Grid item xs={12} md={4}>
                        <Card sx={{ backgroundColor: '#e3f2fd', borderRadius: 2, padding: 3, boxShadow: 3, textAlign: 'center' }}>
                            <CardContent>
                                <Typography variant="h6" color="textSecondary" gutterBottom>Payment Status</Typography>
                                <div>
                                    <Typography variant="body1" sx={{ color: '#388E3C', fontWeight: 'bold' }}>Paid: {paymentStatusCounts.paid}</Typography>
                                    <Typography variant="body1" sx={{ color: '#D32F2F', fontWeight: 'bold' }}>Unpaid: {paymentStatusCounts.unpaid}</Typography>
                                    <Typography variant="body1" sx={{ color: '#FF9800', fontWeight: 'bold' }}>Partially Paid: {paymentStatusCounts.partiallyPaid}</Typography>
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Main container with buttons on the left */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mt: 2 }}>
                    {/* Left side: Class Buttons */}
                    <Box sx={{ width: '250px', display: 'flex', flexDirection: 'column', gap: 2, mt: 16 }}>
                        {/* Row 1: C1 to C5 */}
                        <Box sx={{ display: 'flex', gap: 0.4 }}>
                            {classButtons.slice(0, 5).map((button, index) => (
                                <Button
                                    key={index}
                                    variant="contained"
                                    onClick={() => handleClassChange(button.class)}
                                    sx={{
                                        width: '50px',
                                        height: '50px',
                                        fontSize: '14px',
                                        borderRadius: '12px',
                                        backgroundColor: button.color,
                                        textTransform: 'none',
                                        '&:hover': {
                                            backgroundColor: `${button.color}cc`,
                                        },
                                    }}
                                >
                                    {button.label}
                                </Button>
                            ))}
                        </Box>

                        {/* Row 2: C6 to C10 */}
                        <Box sx={{ display: 'flex', gap: 0.4 }}>
                            {classButtons.slice(5).map((button, index) => (
                                <Button
                                    key={index}
                                    variant="contained"
                                    onClick={() => handleClassChange(button.class)}
                                    sx={{
                                        width: '50px',
                                        height: '50px',
                                        fontSize: '14px',
                                        borderRadius: '12px',
                                        backgroundColor: button.color,
                                        textTransform: 'none',
                                        '&:hover': {
                                            backgroundColor: `${button.color}cc`,
                                        },
                                    }}
                                >
                                    {button.label}
                                </Button>
                            ))}
                        </Box>
                    </Box>

                    {/* Right side: Graph Container */}
                    <Box sx={{ width: 'calc(100% - 300px)', padding: 2 }}>
                        {/* Attendance Bar Chart */}
                        {selectedClass && (
                            <>
                                <Typography variant="h5" gutterBottom align="center">{selectedClass} %</Typography>
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart data={attendanceData} margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="studentName" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="attendancePercentage" fill="#8884d8" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </>
                        )}
                    </Box>
                </Box>
            </Box>
        </div>
    );
};

export default Welcome;
