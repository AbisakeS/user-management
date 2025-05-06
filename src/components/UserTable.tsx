import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type RootState } from '../store';
import { setEditUser } from '../store/userSlice';
import {
  Button, Collapse, Paper, Table, TableContainer, TableHead, TableRow,
  Typography, IconButton, Dialog,
  DialogTitle, DialogContent, TableBody, TableCell, Box, Container, Chip, Avatar
} from '@mui/material';
import {
  ExpandMore, ExpandLess, Edit, Visibility,
  LinkedIn, Email, Person, LocationOn,
} from '@mui/icons-material';
import Add from '@mui/icons-material/Add';


interface IUserTableProps {
  handleOpenAddDialog: () => void;

}
const UserTable = ({ handleOpenAddDialog }: IUserTableProps) => {
  const users = useSelector((state: RootState) => state.user.users);
  const config = useSelector((state: RootState) => state.config);
  const dispatch = useDispatch();

  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [viewUser, setViewUser] = useState<any>(null);

  const handleExpandRow = (id: string) => {
    setExpandedRows(prev => {
      const newExpandedRows = new Set(prev);
      if (newExpandedRows.has(id)) {
        newExpandedRows.delete(id);
      } else {
        newExpandedRows.add(id);
      }
      return newExpandedRows;
    });
  };

  const handleViewDetails = (user: any) => {
    setViewUser(user);
  };

  const getInitials = (name: any) => {
    return name
      .split(' ')
      .map((word: any) => word[0])
      .join('')
      .toUpperCase();
  };

  const getAvatarColor = (name: any) => {
    const colors = [
      '#F0E68C', '#DDA0DD', '#B0E0E6', '#FFA07A',
      '#98FB98', '#FFB6C1', '#87CEFA', '#D3D3D3'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              color: '#333',
              position: 'relative',
              '&:after': {
                content: '""',
                position: 'absolute',
                bottom: -8,
                left: 0,
                width: 100,
                height: 4,
                backgroundColor: 'primary.main',
                borderRadius: 4
              }
            }}
          >
            User Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpenAddDialog}
            sx={{
              float: 'right',
              borderRadius: 2,
              px: 3,
              py: 1,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Add User
          </Button>

        </Box>

        {users.length === 0 ? (
          <Box sx={{
            p: 8,
            textAlign: 'center',
            backgroundColor: '#f9f9f9',
            borderRadius: 2
          }}>
            <Typography variant="h6" color="textSecondary">
              No users found. Please add a user to get started.
            </Typography>
          </Box>
        ) : (
          <TableContainer sx={{ borderRadius: 1, overflow: 'hidden' }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>User</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>LinkedIn</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Gender</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <React.Fragment key={user.id}>
                    <TableRow
                      sx={{
                        '&:hover': { backgroundColor: '#f9f9f9' },
                        borderBottom: expandedRows.has(user.id) ? 'none' : ''
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar
                            sx={{
                              bgcolor: getAvatarColor(user.name),
                              color: '#333',
                              fontWeight: 'bold'
                            }}
                          >
                            {getInitials(user.name)}
                          </Avatar>
                          <Typography variant="body1" fontWeight={500}>{user.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Email fontSize="small" color="action" />
                          {user.email}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="text"
                          startIcon={<LinkedIn color="primary" />}
                          href={user.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ textTransform: 'none' }}
                        >
                          Profile
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={<Person fontSize="small" />}
                          label={user.gender}
                          size="small"
                          sx={{
                            backgroundColor: user.gender === 'Male' ? '#e3f2fd' : '#fce4ec',
                            color: user.gender === 'Male' ? '#0277bd' : '#c2185b'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                          <Button
                            variant="outlined"
                            color="info"
                            size="small"
                            startIcon={<Visibility />}
                            onClick={() => handleViewDetails(user)}
                            sx={{ borderRadius: 2, textTransform: 'none' }}
                          >
                            View
                          </Button>

                          {config.editable && (
                            <Button
                              variant="outlined"
                              color="secondary"
                              size="small"
                              startIcon={<Edit />}
                              onClick={() => dispatch(setEditUser(user))}
                              sx={{ borderRadius: 2, textTransform: 'none' }}
                            >
                              Edit
                            </Button>
                          )}

                          <IconButton
                            onClick={() => handleExpandRow(user.id)}
                            color="primary"
                            size="small"
                            sx={{
                              border: '1px solid #e0e0e0',
                              borderRadius: 1
                            }}
                          >
                            {expandedRows.has(user.id) ? <ExpandLess /> : <ExpandMore />}
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell colSpan={5} sx={{ py: 0 }}>
                        <Collapse in={expandedRows.has(user.id)} timeout="auto" unmountOnExit>
                          <Box sx={{
                            p: 3,
                            my: 1,
                            backgroundColor: '#f8f9fa',
                            borderRadius: 2,
                            border: '1px solid #e0e0e0'
                          }}>
                            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
                              User Details
                            </Typography>

                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mt: 2 }}>
                              <Box>
                                <Typography variant="subtitle2" color="textSecondary" gutterBottom>Personal Information</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                  <Person fontSize="small" color="action" />
                                  <Typography><strong>Name:</strong> {user.name}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                  <Email fontSize="small" color="action" />
                                  <Typography><strong>Email:</strong> {user.email}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                  <LinkedIn fontSize="small" color="action" />
                                  <Typography>
                                    <strong>LinkedIn:</strong> <a href={user.linkedin} target="_blank" rel="noopener noreferrer">View Profile</a>
                                  </Typography>
                                </Box>
                              </Box>

                              <Box>
                                <Typography variant="subtitle2" color="textSecondary" gutterBottom>Address Information</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                  <LocationOn fontSize="small" color="action" sx={{ mt: 0.5 }} />
                                  <Typography>
                                    <strong>Address:</strong><br />
                                    {user.address.line1},
                                    {user.address.line2 && `${user.address.line2},`}
                                    {user.address.city}, {user.address.state}, {user.address.pin}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Dialog
          open={!!viewUser}
          onClose={() => setViewUser(null)}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            sx: { borderRadius: 2 }
          }}
        >
          <DialogTitle sx={{
            backgroundColor: 'primary.main',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <Person /> User Details
          </DialogTitle>
          <DialogContent sx={{ p: 4, mt: 2 }}>
            {viewUser && (
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Avatar
                    sx={{
                      width: 64,
                      height: 64,
                      bgcolor: getAvatarColor(viewUser.name),
                      color: '#333',
                      fontWeight: 'bold',
                      fontSize: '1.5rem'
                    }}
                  >
                    {getInitials(viewUser.name)}
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight={600}>{viewUser.name}</Typography>
                    <Chip
                      icon={<Person fontSize="small" />}
                      label={viewUser.gender}
                      size="small"
                      sx={{
                        mt: 1,
                        backgroundColor: viewUser.gender === 'Male' ? '#e3f2fd' : '#fce4ec',
                        color: viewUser.gender === 'Male' ? '#0277bd' : '#c2185b'
                      }}
                    />
                  </Box>
                </Box>

                <Box sx={{
                  display: 'grid',
                  gridTemplateColumns: '120px 1fr',
                  rowGap: 2,
                  '& > p': { m: 0 }
                }}>
                  <Typography variant="body1" fontWeight={500}>Email:</Typography>
                  <Typography variant="body1">{viewUser.email}</Typography>

                  <Typography variant="body1" fontWeight={500}>LinkedIn:</Typography>
                  <Typography variant="body1">
                    <Button
                      variant="text"
                      startIcon={<LinkedIn color="primary" />}
                      href={viewUser.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ textTransform: 'none', p: 0, minWidth: 'auto' }}
                    >
                      View Profile
                    </Button>
                  </Typography>

                  <Typography variant="body1" fontWeight={500}>Address:</Typography>
                  <Typography variant="body1">
                    {viewUser.address.line1},<br />
                    {viewUser.address.line2 && `${viewUser.address.line2},`}<br />
                    {viewUser.address.city}, {viewUser.address.state}, {viewUser.address.pin}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                  <Button
                    variant="contained"
                    onClick={() => setViewUser(null)}
                    sx={{ borderRadius: 2, textTransform: 'none' }}
                  >
                    Close
                  </Button>
                </Box>
              </Box>
            )}
          </DialogContent>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default UserTable;