import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type RootState } from '../store';
import { addUser, setEditUser, updateUser, UserFormErrors, UserFormDetail } from '../store/userSlice';
import { v4 as uuidv4 } from 'uuid';
import {
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Select, MenuItem, InputLabel, FormControl,
  Typography, Box, Divider, IconButton, Snackbar, Alert,
  FormHelperText
} from '@mui/material';
import { Close, Save, Person } from '@mui/icons-material';


interface IUserFormProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  form: UserFormDetail;
  setForm: React.Dispatch<React.SetStateAction<UserFormDetail>>;
  errors: UserFormErrors;
  setErrors: React.Dispatch<React.SetStateAction<UserFormErrors>>;
  initialFormState:UserFormDetail
}
const UserForm = ({open,setOpen,form,setForm,errors,setErrors,initialFormState}:IUserFormProps) => {
  const dispatch = useDispatch();
  const config = useSelector((state: RootState) => state.config);
  const editingUser = useSelector((state: RootState) => state.user.editUser);

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });


  useEffect(() => {
    if (editingUser) {
      setForm(editingUser);
      setOpen(true);
      setErrors({
        name: '',
        email: '',
        linkedin: '',
        gender: '',
        address: { city: '' }
      });
    }
  }, [editingUser]);

 
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const key = name.split('.')[1];
      setForm({ ...form, address: { ...form.address, [key]: value } });
    } else {
      setForm({ ...form, [name]: value });
    }
    
    if (name === 'name') {
      setErrors({ ...errors, name: '' });
    } else if (name === 'email') {
      setErrors({ ...errors, email: '' });
    } else if (name === 'linkedin') {
      setErrors({ ...errors, linkedin: '' });
    } else if (name === 'gender') {
      setErrors({ ...errors, gender: '' });
    } else if (name === 'address.city') {
      setErrors({ ...errors, address: { ...errors.address, city: '' } });
    }
  };

  const validate = () => {
    let isValid = true;
    const newErrors = {
      name: '',
      email: '',
      linkedin: '',
      gender: '',
      address: { city: '' }
    };

    if (!form.name) {
      newErrors.name = 'Name is required';
      isValid = false;
    } else if (form.name.length < config.nameMin) {
      newErrors.name = `Name must be at least ${config.nameMin} characters`;
      isValid = false;
    } else if (form.name.length > config.nameMax) {
      newErrors.name = `Name cannot exceed ${config.nameMax} characters`;
      isValid = false;
    }

    if (!form.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // LinkedIn URL validation
    if (!form.linkedin) {
      newErrors.linkedin = 'LinkedIn URL is required';
      isValid = false;
    } else if (!/^https?:\/\/.+/.test(form.linkedin)) {
      newErrors.linkedin = 'Please enter a valid URL (starting with http:// or https://)';
      isValid = false;
    }

    // Gender validation
    if (!form.gender) {
      newErrors.gender = 'Please select a gender';
      isValid = false;
    }

    // City validation
    if (!form.address.city) {
      newErrors.address.city = 'City is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e?: any) => {
    if (e) e.preventDefault();
    
    if (!validate()) {
      setSnackbar({
        open: true,
        message: 'Please correct the errors in the form',
        severity: 'error'
      });
      return;
    }
    
    if (editingUser) {
      dispatch(updateUser({ ...form, id: editingUser.id }));
      dispatch(setEditUser(null));
      setSnackbar({
        open: true,
        message: 'User updated successfully!',
        severity: 'success'
      });
    } else {
      dispatch(addUser({ ...form, id: uuidv4() }));
      setSnackbar({
        open: true,
        message: 'User added successfully!',
        severity: 'success'
      });
    }
    
    setForm(initialFormState);
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
    
    if (editingUser) {
      dispatch(setEditUser(null));
    }
  };

  return (
    <Box sx={{ mb: 4 }}>      
      <Dialog 
        open={open} 
        onClose={handleClose} 
        fullWidth 
        maxWidth="md"
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle 
          sx={{ 
            bgcolor: 'primary.main', 
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Person />
            <Typography variant="h6">{editingUser ? 'Edit User' : 'Add New User'}</Typography>
          </Box>
          <IconButton onClick={handleClose} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3, mt: 1 }}>
          <form onSubmit={handleSubmit}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              Personal Information
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
              <TextField 
                label="Name" 
                name="name" 
                value={form.name} 
                onChange={handleChange} 
                error={!!errors.name}
                helperText={errors.name}
                fullWidth 
                required 
              />
              
              <FormControl fullWidth error={!!errors.gender}>
                <InputLabel id="gender-label">Gender</InputLabel>
                <Select
                  labelId="gender-label"
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  label="Gender"
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </Select>
                {errors.gender && <FormHelperText>{errors.gender}</FormHelperText>}
              </FormControl>
            </Box>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mt: 2 }}>
              <TextField 
                label="Email" 
                name="email" 
                type="email"
                value={form.email} 
                onChange={handleChange} 
                error={!!errors.email}
                helperText={errors.email}
                fullWidth 
                required 
              />
              
              <TextField 
                label="LinkedIn URL" 
                name="linkedin" 
                value={form.linkedin} 
                onChange={handleChange} 
                error={!!errors.linkedin}
                helperText={errors.linkedin}
                placeholder="https://linkedin.com/in/username"
                fullWidth 
                required 
              />
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              Address Information
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2 }}>
              <TextField 
                label="Address Line 1" 
                name="address.line1" 
                value={form.address.line1} 
                onChange={handleChange} 
                fullWidth 
              />
              
              <TextField 
                label="Address Line 2" 
                name="address.line2" 
                value={form.address.line2} 
                onChange={handleChange} 
                fullWidth
              />
            </Box>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2, mt: 2 }}>
              <TextField 
                label="City" 
                name="address.city" 
                value={form.address.city} 
                onChange={handleChange} 
                error={!!errors.address.city}
                helperText={errors.address.city}
                fullWidth 
                required
              />
              
              <TextField 
                label="State" 
                name="address.state" 
                value={form.address.state} 
                onChange={handleChange} 
                fullWidth
              />
              
              <TextField 
                label="PIN Code" 
                name="address.pin" 
                value={form.address.pin} 
                onChange={handleChange} 
                fullWidth
              />
            </Box>
          </form>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, py: 2, bgcolor: '#f5f5f5' }}>
          <Button 
            variant="outlined" 
            onClick={handleClose}
            startIcon={<Close />}
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            startIcon={<Save />}
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            {editingUser ? 'Update User' : 'Add User'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Success/Error Snackbar */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity === 'success' ? 'success' : 'error'} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserForm;