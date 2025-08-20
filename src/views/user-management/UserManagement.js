import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Tooltip,
  Button,
  Chip,
  Avatar
} from '@mui/material';
import {
  IconRefresh,
  IconLock,
  IconLockOpen,
  IconUser,
  IconMail,
  IconPhone,
  IconGenderMale,
  IconGenderFemale
} from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import { userManagementService } from 'src/services/userManagementService.js';
import { mockUserManagementService } from 'src/services/mockUserManagementService.js';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [openBlockDialog, setOpenBlockDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Chọn service để sử dụng (real API hoặc mock)
  const userServiceToUse = userManagementService; // Thay đổi thành userManagementService để dùng real API

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await userServiceToUse.getUsers();
      const formattedUsers = data.map(user => 
        userServiceToUse.formatUser(user)
      );
      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = (user) => {
    setSelectedUser(user);
    setOpenBlockDialog(true);
  };

  const handleConfirmToggleBlock = async () => {
    try {
      setActionLoading(true);
      setError('');
      // Gửi trạng thái block ngược lại với hiện tại
      const newBlockStatus = !selectedUser.block;
      const result = await userServiceToUse.toggleUserBlock(selectedUser._id, newBlockStatus);
      fetchUsers();
      setOpenBlockDialog(false);
      setSelectedUser(null);
      // Hiển thị thông báo thành công
      console.log(result.message);
    } catch (error) {
      console.error('Error toggling user block:', error);
      setError('Không thể thay đổi trạng thái người dùng');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCloseBlockDialog = () => {
    setOpenBlockDialog(false);
    setSelectedUser(null);
  };

  const getGenderIcon = (gender) => {
    return gender === 'Nam' ? <IconGenderMale size={16} color="#1976d2" /> : <IconGenderFemale size={16} color="#e91e63" />;
  };

  const getAvatarUrl = (user) => {
    const avatarUrl = userServiceToUse.getAvatarUrl(user.avatar_url);
    return avatarUrl || null;
  };

  if (loading) {
    return (
      <PageContainer title="User Management" description="Quản lý người dùng">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="User Management" description="Quản lý người dùng">
      <Box>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4" fontWeight="bold">
                Quản lý Người dùng
              </Typography>
              <Button
                variant="outlined"
                startIcon={<IconRefresh />}
                onClick={fetchUsers}
              >
                Làm mới
              </Button>
            </Box>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Người dùng</TableCell>
                    <TableCell>Thông tin liên hệ</TableCell>
                    <TableCell>Giới tính</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell align="center">Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar 
                            src={getAvatarUrl(user)}
                            sx={{ bgcolor: 'primary.main' }}
                          >
                            <IconUser size={20} />
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="bold">
                              {user.name}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              ID: {user._id?.slice(-8)}
                            </Typography>
                            <Typography variant="caption" color="textSecondary" display="block">
                              Role: {user.role}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconMail size={16} color="#666" />
                            <Typography variant="body2">
                              {user.email}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconPhone size={16} color="#666" />
                            <Typography variant="body2">
                              {user.phone}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getGenderIcon(user.gender)}
                          <Typography variant="body2">
                            {user.gender}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.statusText}
                          color={user.statusColor}
                          size="small"
                          icon={user.block ? <IconLock size={16} /> : <IconLockOpen size={16} />}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title={user.block ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}>
                          <IconButton 
                            size="small" 
                            color={user.block ? 'success' : 'error'}
                            onClick={() => handleToggleBlock(user)}
                          >
                            {user.block ? <IconLockOpen size={16} /> : <IconLock size={16} />}
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {users.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <IconUser size={48} color="grey" />
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  Chưa có người dùng nào
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Block/Unblock Confirmation Dialog */}
        <Dialog 
          open={openBlockDialog} 
          onClose={handleCloseBlockDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {selectedUser?.block ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Bạn có chắc chắn muốn {selectedUser?.block ? 'mở khóa' : 'khóa'} tài khoản của{' '}
              <strong>"{selectedUser?.name}"</strong>?
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              {selectedUser?.block 
                ? 'Người dùng sẽ có thể đăng nhập và sử dụng hệ thống bình thường.'
                : 'Người dùng sẽ không thể đăng nhập vào hệ thống.'
              }
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseBlockDialog} disabled={actionLoading}>
              Hủy
            </Button>
            <Button 
              variant="contained" 
              color={selectedUser?.block ? 'success' : 'error'}
              onClick={handleConfirmToggleBlock}
              disabled={actionLoading}
              startIcon={actionLoading ? <CircularProgress size={16} /> : null}
            >
              {actionLoading ? 'Đang xử lý...' : (selectedUser?.block ? 'Mở khóa' : 'Khóa')}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </PageContainer>
  );
};

export default UserManagement; 