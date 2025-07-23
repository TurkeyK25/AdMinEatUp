import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, CircularProgress, Alert } from '@mui/material';
import { IconMail } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { settingsService } from 'src/services/settingsService.js';
import PageContainer from 'src/components/container/PageContainer';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      await settingsService.forgotPassword(email);
      setSuccess('Đã gửi mã xác thực về email.');
      setTimeout(() => {
        navigate('/reset-password', { state: { email } });
      }, 1000);
    } catch (err) {
      setError(err.message || 'Không gửi được mã xác thực');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer title="Forgot Password" description="Quên mật khẩu">
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Card sx={{ maxWidth: 400, width: '100%' }}>
          <CardContent>
            <Typography variant="h5" fontWeight={700} mb={2}>Quên mật khẩu</Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: <IconMail size={20} style={{ marginRight: 8, color: '#666' }} />
                }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                startIcon={loading ? <CircularProgress size={16} /> : null}
              >
                {loading ? 'Đang gửi...' : 'Gửi mã xác thực'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </PageContainer>
  );
};

export default ForgotPassword; 