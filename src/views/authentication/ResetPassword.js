import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, CircularProgress, Alert } from '@mui/material';
import { IconMail, IconLock, IconCheck } from '@tabler/icons-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { settingsService } from 'src/services/settingsService.js';
import PageContainer from 'src/components/container/PageContainer';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: location.state?.email || '',
    code: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      if (form.newPassword !== form.confirmPassword) {
        setError('Mật khẩu xác nhận không khớp');
        return;
      }
      await settingsService.resetPassword(form.email, form.code, form.newPassword);
      setSuccess('Đổi mật khẩu thành công!');
      setTimeout(() => {
        navigate('/auth/login');
      }, 1200);
    } catch (err) {
      setError(err.message || 'Không đổi được mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer title="Đặt lại mật khẩu" description="Reset Password">
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Card sx={{ maxWidth: 400, width: '100%' }}>
          <CardContent>
            <Typography variant="h5" fontWeight={700} mb={2}>Đặt lại mật khẩu</Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: <IconMail size={20} style={{ marginRight: 8, color: '#666' }} />
                }}
              />
              <TextField
                fullWidth
                label="Mã xác thực"
                value={form.code}
                onChange={e => setForm({ ...form, code: e.target.value })}
                required
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: <IconCheck size={20} style={{ marginRight: 8, color: '#666' }} />
                }}
              />
              <TextField
                fullWidth
                label="Mật khẩu mới"
                type="password"
                value={form.newPassword}
                onChange={e => setForm({ ...form, newPassword: e.target.value })}
                required
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: <IconLock size={20} style={{ marginRight: 8, color: '#666' }} />
                }}
              />
              <TextField
                fullWidth
                label="Xác nhận mật khẩu"
                type="password"
                value={form.confirmPassword}
                onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                required
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: <IconLock size={20} style={{ marginRight: 8, color: '#666' }} />
                }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                startIcon={loading ? <CircularProgress size={16} /> : null}
              >
                {loading ? 'Đang đổi...' : 'Đổi mật khẩu'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </PageContainer>
  );
};

export default ResetPassword; 