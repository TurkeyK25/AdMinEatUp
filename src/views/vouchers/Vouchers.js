import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Tooltip
} from '@mui/material';
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconEye,
  IconTicket
} from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import { voucherService } from 'src/services/voucherService.js';
import { getUser } from 'src/services/authService.js';
import VoucherForm from './VoucherForm';

const Vouchers = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [dialogMode, setDialogMode] = useState('create'); // 'create' or 'edit'
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchVouchers();
    const user = getUser();
    setCurrentUser(user);
  }, []);

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const data = await voucherService.getVouchers();
      setVouchers(data);
    } catch (error) {
      console.error('Error fetching vouchers:', error);
      setError('Không thể tải danh sách voucher');
    } finally {
      setLoading(false);
    }
  };

  const getRestaurantName = (restaurantId) => {
    // Nếu restaurant_id trùng với user đăng nhập, hiển thị tên user
    if (currentUser && restaurantId === currentUser._id) {
      return currentUser.name;
    }
    return 'Không xác định';
  };

  const handleCreateVoucher = () => {
    setSelectedVoucher(null);
    setDialogMode('create');
    setOpenDialog(true);
  };

  const handleEditVoucher = (voucher) => {
    setSelectedVoucher(voucher);
    setDialogMode('edit');
    setOpenDialog(true);
  };

  const handleDeleteVoucher = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa voucher này?')) {
      try {
        await voucherService.deleteVoucher(id);
        fetchVouchers();
      } catch (error) {
        console.error('Error deleting voucher:', error);
        setError('Không thể xóa voucher');
      }
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedVoucher(null);
  };

  const handleFormSubmit = async (voucherData) => {
    try {
      if (dialogMode === 'create') {
        await voucherService.createVoucher(voucherData);
      } else {
        await voucherService.updateVoucher(selectedVoucher._id, voucherData);
      }
      handleDialogClose();
      fetchVouchers();
    } catch (error) {
      console.error('Error saving voucher:', error);
      setError('Không thể lưu voucher');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusColor = (active) => {
    return active ? 'success' : 'error';
  };

  const getDiscountTypeLabel = (type) => {
    return type === 'percentage' ? 'Phần trăm' : 'Số tiền cố định';
  };

  if (loading) {
    return (
      <PageContainer title="Vouchers" description="Quản lý voucher">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Vouchers" description="Quản lý voucher">
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
                Quản lý Voucher
              </Typography>
              <Button
                variant="contained"
                startIcon={<IconPlus />}
                onClick={handleCreateVoucher}
              >
                Thêm Voucher
              </Button>
            </Box>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Mã Voucher</TableCell>
                    <TableCell>Mô tả</TableCell>
                    <TableCell>Nhà hàng</TableCell>
                    <TableCell>Loại giảm giá</TableCell>
                    <TableCell>Giá trị</TableCell>
                    <TableCell>Đơn hàng tối thiểu</TableCell>
                    <TableCell>Ngày bắt đầu</TableCell>
                    <TableCell>Ngày kết thúc</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell>Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vouchers.map((voucher) => (
                    <TableRow key={voucher._id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconTicket size={16} />
                          <Typography variant="body2" fontWeight="bold">
                            {voucher.code}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {voucher.description}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getRestaurantName(voucher.restaurant_id)}
                          size="small"
                          color="info"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getDiscountTypeLabel(voucher.discount_type)}
                          size="small"
                          color="primary"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {voucher.discount_type === 'percentage' 
                            ? `${voucher.discount_value}%`
                            : `${voucher.discount_value?.toLocaleString()} VNĐ`
                          }
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {voucher.min_order_amount?.toLocaleString()} VNĐ
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(voucher.start_date)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(voucher.end_date)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={voucher.active ? 'Hoạt động' : 'Không hoạt động'}
                          color={getStatusColor(voucher.active)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {/* <Tooltip title="Xem chi tiết">
                            <IconButton size="small" color="info">
                              <IconEye size={16} />
                            </IconButton>
                          </Tooltip> */}
                          <Tooltip title="Chỉnh sửa">
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => handleEditVoucher(voucher)}
                            >
                              <IconEdit size={16} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Xóa">
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleDeleteVoucher(voucher._id)}
                            >
                              <IconTrash size={16} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {vouchers.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <IconTicket size={48} color="grey" />
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  Chưa có voucher nào
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Dialog for Create/Edit Voucher */}
        <Dialog 
          open={openDialog} 
          onClose={handleDialogClose}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {dialogMode === 'create' ? 'Thêm Voucher Mới' : 'Chỉnh sửa Voucher'}
          </DialogTitle>
          <DialogContent>
            <VoucherForm
              voucher={selectedVoucher}
              onSubmit={handleFormSubmit}
              onCancel={handleDialogClose}
            />
          </DialogContent>
        </Dialog>
      </Box>
    </PageContainer>
  );
};

export default Vouchers; 