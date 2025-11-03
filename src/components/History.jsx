import React, { useState, useEffect } from "react";
import { Typography, Box, Paper, CircularProgress, Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow} from "@mui/material";
import axios from "axios";
import Header from "../components/header";
import { useNavigate } from "react-router-dom";

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const userId = sessionStorage.getItem("userId");

    if (!token || !userId) {
      navigate('/login')
      setLoading(false);
      setError("User is not authenticated.");
      return;
    }

    const fetchHistory = async () => {
      
      try {
        const response = await axios.get(
          `http://localhost:8081/api/history/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setHistory(response.data);
      } catch (err) {
        console.error(
          "Error fetching history:",
          err.response ? err.response.data : err.message
        );
        setError("Failed to load history. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box style={{ padding: "20px" }}>
      <Header />
     

      {history.length === 0 ? (
        <Typography>No borrowed books yet.</Typography>
      ) : (
         <Box mt={1}> {/* Add margin-top */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Borrowed Book Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {/* Keep your original Paper card inside the TableCell */}
                    <Paper
                      elevation={3}
                      style={{
                        display: "flex",
                        padding: "10px",
                        alignItems: "flex-start",
                        marginBottom: "10px",
                      }}
                    >
                      <Box>
                        <img
                          src={`http://localhost:8081${item.imagePath}`}
                          alt={item.bookName}
                          style={{ width: "100px", marginRight: "15px" }}
                        />
                      </Box>
                      <Box display="flex" flexDirection="column" gap={0.5}>
                        <Typography variant="h6">{item.bookName}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          Genre: {item.genre}
                        </Typography>
                        <Typography variant="body2">
                          Borrowed: {item.borrowDate}
                        </Typography>
                        <Typography variant="body2">
                          Due: {item.dueDate}
                        </Typography>
                        <Typography
                          variant="body2"
                          style={{
                            color:
                              item.status === "BORROWED" ? "white" : "green",
                            fontWeight: "bold",
                          }}
                        >
                          Status: {item.status}
                        </Typography>
                      </Box>
                    </Paper>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        </Box>
      )}
    </Box>
  );
};
export default History;
