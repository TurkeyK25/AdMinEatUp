import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Grid,
  Divider,
  LinearProgress,
  Chip,
  IconButton,
  InputAdornment,
  Avatar
} from '@mui/material';
import {
  IconMail,
  IconLock,
  IconEye,
  IconEyeOff,
  IconUser,
  IconPhone,
  IconCheck,
  IconX
} from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import { settingsService } from 'src/services/settingsService.js';
import { mockSettingsService } from 'src/services/mockSettingsService.js';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('forgot-password');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [verifySent, setVerifySent] = useState(false);
  const [owner, setOwner] = useState(null);

  // Chọn service để sử dụng (real API hoặc mock)
  const settingsServiceToUse = settingsService;

  // Form states
  const [forgotForm, setForgotForm] = useState({ email: '' });
  const [resetForm, setResetForm] = useState({ email: '', code: '', newPassword: '', confirmPassword: '' });
  const [profileForm, setProfileForm] = useState({ name: '', email: '', phone: '', gender: '', avatar_url: '' });
  const [changePasswordForm, setChangePasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Password visibility states
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
    resetPassword: false,
    resetConfirmPassword: false
  });

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError('');
    setSuccess('');
  };

  // Khi vào tab profile, fetch owner info
  useEffect(() => {
    if (activeTab === 'profile') {
      fetchOwnerInfo();
    }
  }, [activeTab]);

  const fetchOwnerInfo = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await settingsServiceToUse.getOwnerInfo();
      setOwner(data);
      setProfileForm({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        gender: data.gender || '',
        avatar_url: data.avatar_url || ''
      });
    } catch (err) {
      setError('Không thể tải thông tin cá nhân');
    } finally {
      setLoading(false);
    }
  };

  // Forgot password: gửi verify code
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      await settingsServiceToUse.forgotPassword(forgotForm.email);
      setSuccess('Đã gửi mã xác thực về email.');
      setVerifySent(true);
      setResetForm(r => ({ ...r, email: forgotForm.email }));
    } catch (err) {
      setError(err.message || 'Không gửi được mã xác thực');
    } finally {
      setLoading(false);
    }
  };

  // Reset password: nhập code + mật khẩu mới
  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      if (resetForm.newPassword !== resetForm.confirmPassword) {
        setError('Mật khẩu xác nhận không khớp');
        return;
      }
      await settingsServiceToUse.resetPassword(resetForm.email, resetForm.code, resetForm.newPassword);
      setSuccess('Đổi mật khẩu thành công!');
      setVerifySent(false);
      setForgotForm({ email: '' });
      setResetForm({ email: '', code: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.message || 'Không đổi được mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  // Change password: chỉ cần nhập mật khẩu hiện tại, mật khẩu mới, xác nhận mật khẩu mới
  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      if (changePasswordForm.newPassword !== changePasswordForm.confirmPassword) {
        setError('Mật khẩu xác nhận không khớp');
        return;
      }
      await settingsServiceToUse.changePassword(changePasswordForm.currentPassword, changePasswordForm.newPassword);
      setSuccess('Đổi mật khẩu thành công!');
      setChangePasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.message || 'Không đổi được mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  // Update profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      await settingsServiceToUse.updateOwnerInfo(owner._id, profileForm);
      setSuccess('Cập nhật thông tin thành công!');
      fetchOwnerInfo();
    } catch (err) {
      setError(err.message || 'Không cập nhật được thông tin');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const getPasswordStrength = (password) => {
    return settingsServiceToUse.getPasswordStrength(password);
  };

  const renderPasswordStrength = (password) => {
    if (!password) return null;
    
    const strength = getPasswordStrength(password);
    const progress = password.length > 0 ? Math.min((password.length / 8) * 100, 100) : 0;
    
    return (
      <Box sx={{ mt: 1 }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          color={strength.color}
          sx={{ height: 4, borderRadius: 2 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
          <Typography variant="caption" color="textSecondary">
            Độ mạnh mật khẩu
          </Typography>
          <Chip
            label={strength.text}
            color={strength.color}
            size="small"
            sx={{ fontSize: '0.7rem' }}
          />
        </Box>
      </Box>
    );
  };

  const tabs = [
    { id: 'change-password', label: 'Đổi mật khẩu', icon: IconLock },
    { id: 'profile', label: 'Thông tin cá nhân', icon: IconUser }
  ];

  return (
    <PageContainer title="Settings" description="Cài đặt tài khoản">
      <Box>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>
        )}
        <Card>
          <CardContent>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
              Cài đặt tài khoản
            </Typography>
            {/* Tab Navigation */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <Button
                      key={tab.id}
                      variant={activeTab === tab.id ? 'contained' : 'outlined'}
                      startIcon={<IconComponent size={18} />}
                      onClick={() => setActiveTab(tab.id)}
                      sx={{ mb: 1 }}
                    >
                      {tab.label}
                    </Button>
                  );
                })}
              </Box>
            </Box>

            {/* Change Password Tab */}
            {activeTab === 'change-password' && (
              <Box component="form" onSubmit={handleChangePassword}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Đổi mật khẩu
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                  Nhập mật khẩu hiện tại, mật khẩu mới và xác nhận mật khẩu mới
                </Typography>
                <TextField
                  fullWidth
                  label="Mật khẩu hiện tại"
                  type="password"
                  value={changePasswordForm.currentPassword}
                  onChange={e => setChangePasswordForm({ ...changePasswordForm, currentPassword: e.target.value })}
                  required
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: <IconLock size={20} style={{ marginRight: 8, color: '#666' }} />
                  }}
                />
                <TextField
                  fullWidth
                  label="Mật khẩu mới"
                  type="password"
                  value={changePasswordForm.newPassword}
                  onChange={e => setChangePasswordForm({ ...changePasswordForm, newPassword: e.target.value })}
                  required
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: <IconLock size={20} style={{ marginRight: 8, color: '#666' }} />
                  }}
                />
                <TextField
                  fullWidth
                  label="Xác nhận mật khẩu mới"
                  type="password"
                  value={changePasswordForm.confirmPassword}
                  onChange={e => setChangePasswordForm({ ...changePasswordForm, confirmPassword: e.target.value })}
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
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && owner && (
              <Box component="form" onSubmit={handleUpdateProfile}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Thông tin cá nhân
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar src={owner.avatar_url ? (owner.avatar_url.startsWith('http') ? owner.avatar_url : `http://localhost:3000/${owner.avatar_url.replace(/^\/+/, '')}`) : ''} sx={{ width: 64, height: 64 }} />
                  <Box>
                    <Typography variant="subtitle1" fontWeight={700}>{owner.name}</Typography>
                    <Typography variant="caption" color="textSecondary">ID: {owner._id?.slice(-8)}</Typography>
                    <Typography variant="caption" color="textSecondary" display="block">Role: {owner.role}</Typography>
                  </Box>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Họ và tên"
                      value={profileForm.name}
                      onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                      required
                      InputProps={{
                        startAdornment: <IconUser size={20} style={{ marginRight: 8, color: '#666' }} />
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={profileForm.email}
                      onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                      required
                      InputProps={{
                        startAdornment: <IconMail size={20} style={{ marginRight: 8, color: '#666' }} />
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Số điện thoại"
                      value={profileForm.phone}
                      onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                      InputProps={{
                        startAdornment: <IconPhone size={20} style={{ marginRight: 8, color: '#666' }} />
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Giới tính"
                      value={profileForm.gender}
                      onChange={e => setProfileForm({ ...profileForm, gender: e.target.value })}
                      InputProps={{
                        startAdornment: <IconUser size={20} style={{ marginRight: 8, color: '#666' }} />
                      }}
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={16} /> : null}
                  sx={{ mt: 3 }}
                >
                  {loading ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
                </Button>
              </Box>
            )}

          </CardContent>
        </Card>
      </Box>
    </PageContainer>
  );
};

export default Settings; 