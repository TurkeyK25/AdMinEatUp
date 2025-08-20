import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Box
} from '@mui/material';
import { IconBuilding, IconMapPin, IconPhone, IconFileDescription } from '@tabler/icons-react';

const RestaurantForm = ({ open, onClose, restaurant = null, onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (restaurant) {
      setFormData({
        name: restaurant.name || '',
        address: restaurant.address || '',
        phone: restaurant.phone || '',
        description: restaurant.description || ''
      });
    } else {
      setFormData({
        name: '',
        address: '',
        phone: '',
        description: ''
      });
    }
    setErrors({});
    setSubmitError('');
  }, [restaurant, open]);

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Tên nhà hàng là bắt buộc';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Địa chỉ là bắt buộc';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Số điện thoại là bắt buộc';
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ (10-11 số)';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Mô tả là bắt buộc';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitError('');
      await onSubmit(formData);
      onClose();
    } catch (error) {
      setSubmitError(error.message || 'Có lỗi xảy ra khi lưu nhà hàng');
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {restaurant ? 'Chỉnh sửa nhà hàng' : 'Thêm nhà hàng mới'}
      </DialogTitle>
      
      <DialogContent>
        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        )}
        
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Tên nhà hàng"
              value={formData.name}
              onChange={handleChange('name')}
              error={!!errors.name}
              helperText={errors.name}
              InputProps={{
                startAdornment: <IconBuilding size={20} style={{ marginRight: 8, color: '#666' }} />
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Địa chỉ"
              value={formData.address}
              onChange={handleChange('address')}
              error={!!errors.address}
              helperText={errors.address}
              InputProps={{
                startAdornment: <IconMapPin size={20} style={{ marginRight: 8, color: '#666' }} />
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Số điện thoại"
              value={formData.phone}
              onChange={handleChange('phone')}
              error={!!errors.phone}
              helperText={errors.phone}
              InputProps={{
                startAdornment: <IconPhone size={20} style={{ marginRight: 8, color: '#666' }} />
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Mô tả"
              value={formData.description}
              onChange={handleChange('description')}
              error={!!errors.description}
              helperText={errors.description}
              multiline
              rows={4}
              InputProps={{
                startAdornment: <IconFileDescription size={20} style={{ marginRight: 8, color: '#666', marginTop: 8 }} />
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Hủy
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : null}
        >
          {loading ? 'Đang lưu...' : (restaurant ? 'Cập nhật' : 'Thêm mới')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RestaurantForm; 