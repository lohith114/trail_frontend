import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import {
  Typography,
  Container,
  List,
  ListItem,
  Card,
  CardContent,
  CardActions,
  IconButton,
  TextField,
  Button,
  Box,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

const colors = ['#880e4f', '#4a148c', '#004d40'];

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const PostList = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [posts, setPosts] = useState([]);
  const [expandedPostIndex, setExpandedPostIndex] = useState(null);
  const [editingPostIndex, setEditingPostIndex] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [deleteSnackbarOpen, setDeleteSnackbarOpen] = useState(false); // New state for delete success message
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${apiUrl}/get-posts`);
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const handleExpandClick = (index) => {
    setExpandedPostIndex(index === expandedPostIndex ? null : index);
  };

  const handleEditClick = (index, post) => {
    setEditingPostIndex(index);
    setEditedTitle(post.title);
    setEditedDescription(post.description);
  };

  const handleSaveClick = async (index) => {
    const updatedPost = { title: editedTitle, description: editedDescription };
    try {
      const response = await fetch(`${apiUrl}/update-post/${index}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPost),
      });

      if (response.ok) {
        const updatedPosts = [...posts];
        updatedPosts[index] = { ...updatedPost, timestamp: posts[index].timestamp };
        setPosts(updatedPosts);
        setEditingPostIndex(null);
        setSnackbarOpen(true);
      } else {
        alert('Failed to update post');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeleteClick = (index) => {
    setPostToDelete(index);
    setDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (postToDelete !== null) {
      try {
        const response = await fetch(`${apiUrl}/delete-post/${postToDelete}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          const updatedPosts = posts.filter((_, i) => i !== postToDelete);
          setPosts(updatedPosts);
          setDialogOpen(false);
          setPostToDelete(null);
          setDeleteSnackbarOpen(true); // Show delete success message
        } else {
          alert('Failed to delete post');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handleDeleteAllClick = () => {
    setDeleteAllDialogOpen(true);
  };

  const confirmDeleteAll = async () => {
    try {
      const response = await fetch(`${apiUrl}/delete-all-posts`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPosts([]);
        setDeleteAllDialogOpen(false);
      } else {
        alert('Failed to delete all posts');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleDeleteSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setDeleteSnackbarOpen(false);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setPostToDelete(null);
  };

  const handleDeleteAllDialogClose = () => {
    setDeleteAllDialogOpen(false);
  };

  const handleBackToDashboard = () => {
    navigate('/notice-dashboard'); // Navigate back to NoticeDashboard
  };

  return (
    <Container maxWidth="md" sx={{ padding: 4, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#880e4f' }}>
          Notices
        </Typography>
        <Box display="flex" gap={2} alignItems="center">
          <TextField
            label="Search Titles"
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
            }}
          />
          <Button
            onClick={handleDeleteAllClick}
            variant="contained"
            sx={{
              backgroundColor: '#d32f2f',
              '&:hover': {
                backgroundColor: '#b71c1c',
              },
            }}
          >
            Delete All Posts
          </Button>
          <Button
            onClick={handleBackToDashboard}
            variant="contained"
            sx={{
              backgroundColor: '#8bc34a',
              '&:hover': {
                backgroundColor: '#689f38',
              },
            }}
          >
            Back to Dashboard
          </Button>
        </Box>
      </Box>
      <List>
        {filteredPosts.map((post, index) => (
          <ListItem key={index} sx={{ padding: 0, marginBottom: 2 }}>
            <Card sx={{ width: '100%', borderRadius: '12px', boxShadow: 3 }}>
              <CardContent>
                {editingPostIndex === index ? (
                  <Box width="100%">
                    <TextField
                      label="Title"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      required
                      fullWidth
                      margin="normal"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                        },
                      }}
                    />
                    <TextField
                      label="Description"
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                      required
                      fullWidth
                      multiline
                      rows={4}
                      margin="normal"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                        },
                      }}
                    />
                    <Button onClick={() => handleSaveClick(index)} variant="contained" color="primary">
                      Save
                    </Button>
                  </Box>
                ) : (
                  <>
                    <Typography
                      sx={{
                        color: colors[index % colors.length],
                        fontSize: '20px',
                        fontFamily: 'Times New Roman',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleExpandClick(index)}
                    >
                      {post.title}
                    </Typography>
                    {expandedPostIndex === index && (
                      <Typography
                        sx={{ color: 'black', fontSize: '18px', fontFamily: 'Times New Roman', marginTop: 2 }}
                      >
                        {post.description}
                      </Typography>
                    )}
                  </>
                )}
                <Box display="flex" justifyContent="flex-end">
                  <IconButton onClick={() => handleEditClick(index, post)} sx={{ color: 'blue' }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClick(index)} sx={{ color: 'red' }}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between' }}>
                <IconButton onClick={() => handleExpandClick(index)}>
                  {expandedPostIndex === index ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
                <Typography
                  sx={{ color: '#888888', fontSize: '14px', marginLeft: '10px', alignSelf: 'flex-end' }}
                >
                  {new Date(post.timestamp).toLocaleString()}
                </Typography>
              </CardActions>
            </Card>
          </ListItem>
        ))}
      </List>
      {/* Snackbar for successful modification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          Modified successfully!
        </Alert>
      </Snackbar>
      {/* Snackbar for successful deletion */}
      <Snackbar
        open={deleteSnackbarOpen}
        autoHideDuration={2000} // Auto-close after 2 seconds
        onClose={handleDeleteSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleDeleteSnackbarClose} severity="success">
          Successfully deleted!
        </Alert>
      </Snackbar>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this post?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteAllDialogOpen} onClose={handleDeleteAllDialogClose}>
        <DialogTitle>Confirm Delete All</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete all posts?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteAllDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDeleteAll} color="primary">
            Delete All
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PostList;
