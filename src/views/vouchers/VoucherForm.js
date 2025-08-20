import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Button,
  Grid,
  Typography,
  Alert
} from '@mui/material';
import { voucherService } from 'src/services/voucherService.js';
import { getUser } from 'src/services/authService.js';

const VoucherForm = ({ voucher, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(voucherService.formatVoucherForForm(voucher));
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = getUser();
    console.log('User từ localStorage:', user);
    setCurrentUser(user);
    
    // Tự động set restaurant_id từ user đăng nhập
    const updatedFormData = voucherService.formatVoucherForForm(voucher);
    if (user && user._id) {
      updatedFormData.restaurant_id = user._id;
      console.log('Set restaurant_id:', user._id);
    } else {
      console.log('Không tìm thấy user._id');
    }
    setFormData(updatedFormData);
    setErrors({});
  }, [voucher]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Đảm bảo restaurant_id được set từ user đăng nhập
    const user = getUser();
    const finalFormData = {
      ...formData,
      restaurant_id: user?._id || ''
    };
    
    console.log('User đăng nhập:', user);
    console.log('Form data trước khi submit:', finalFormData);
    console.log('restaurant_id được gửi:', finalFormData.restaurant_id);
    console.log('JSON stringify:', JSON.stringify(finalFormData, null, 2));
    
    // Validate form
    const validationErrors = voucherService.validateVoucher(finalFormData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await onSubmit(finalFormData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Mã Voucher"
            name="code"
            value={formData.code}
            onChange={handleInputChange}
            error={!!errors.code}
            helperText={errors.code}
            required
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Mô tả"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            error={!!errors.description}
            helperText={errors.description}
            required
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            // label="Nhà hàng"
            name="restaurant_id"
            value={currentUser?.name || 'Đang tải...'}
            disabled
            helperText="Tự động lấy từ tài khoản đăng nhập"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Loại giảm giá</InputLabel>
            <Select
              name="discount_type"
              value={formData.discount_type}
              onChange={handleInputChange}
              label="Loại giảm giá"
            >
              <MenuItem value="percentage">Phần trăm (%)</MenuItem>
              <MenuItem value="fixed">Số tiền cố định ($)</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Giá trị giảm giá"
            name="discount_value"
            type="number"
            value={formData.discount_value}
            onChange={handleInputChange}
            error={!!errors.discount_value}
            helperText={errors.discount_value}
            required
            inputProps={{
              min: 0,
              step: formData.discount_type === 'percentage' ? 1 : 0.01
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Đơn hàng tối thiểu ($)"
            name="min_order_amount"
            type="number"
            value={formData.min_order_amount}
            onChange={handleInputChange}
            error={!!errors.min_order_amount}
            helperText={errors.min_order_amount}
            required
            inputProps={{ min: 0 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Giảm giá tối đa ($)"
            name="max_discount_amount"
            type="number"
            value={formData.max_discount_amount}
            onChange={handleInputChange}
            inputProps={{ min: 0 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Ngày bắt đầu"
            name="start_date"
            type="date"
            value={formData.start_date}
            onChange={handleInputChange}
            error={!!errors.start_date}
            helperText={errors.start_date}
            required
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Ngày kết thúc"
            name="end_date"
            type="date"
            value={formData.end_date}
            onChange={handleInputChange}
            error={!!errors.end_date}
            helperText={errors.end_date}
            required
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Giới hạn sử dụng"
            name="usage_limit"
            type="number"
            value={formData.usage_limit}
            onChange={handleInputChange}
            inputProps={{ min: 1 }}
            helperText="Để trống nếu không giới hạn"
          />
        </Grid>

        {/* <Grid item xs={12} md={6}>
          <FormControlLabel
            control={
              <Switch
                name="user_specific"
                checked={formData.user_specific}
                onChange={handleInputChange}
              />
            }
            label="Chỉ định cho user cụ thể"
          />
        </Grid> */}

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                name="active"
                checked={formData.active}
                onChange={handleInputChange}
              />
            }
            label="Kích hoạt voucher"
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={onCancel}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
            >
              {loading ? 'Đang lưu...' : (voucher ? 'Cập nhật' : 'Tạo mới')}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VoucherForm; 