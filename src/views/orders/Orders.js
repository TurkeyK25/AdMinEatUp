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
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField,
  Grid
} from '@mui/material';
import {
  IconEye,
  IconEdit,
  IconTrash,
  IconShoppingCart,
  IconFilter,
  IconRefresh,
  IconSearch
} from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import { orderService } from 'src/services/orderService.js';
import OrderDetail from './OrderDetail';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [statusToUpdate, setStatusToUpdate] = useState('');
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [allOrders, searchTerm]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch tất cả dữ liệu song song
      const [ordersData, usersData, adminsData] = await Promise.all([
        axios.get('/api/orders'), // Lấy tất cả đơn hàng
        axios.get('/api/list/users'),
        axios.get('/api/list/admins')
      ]);

      const formattedOrders = ordersData.data.map(order => orderService.formatOrder(order));
      setAllOrders(formattedOrders);
      setOrders(formattedOrders); // Ban đầu hiển thị tất cả
      setUsers(usersData.data);
      setAdmins(adminsData.data);

    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...allOrders];

    // Lọc theo search term (tên nhà hàng)
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(order => {
        const restaurantInfo = getRestaurantInfo(order.restaurant_id);
        return restaurantInfo.name.toLowerCase().includes(searchLower);
      });
    }

    setOrders(filtered);
  };

  const handleViewOrder = async (order) => {
    try {
      // Lấy chi tiết đơn hàng từ API
      const orderDetail = await orderService.getOrderDetail(order._id, order.restaurant_id);
      console.log(orderDetail);
      setSelectedOrder(orderDetail);
      setOpenDetailDialog(true);
    } catch (error) {
      console.error('Error fetching order detail:', error);
      setError('Không thể tải chi tiết đơn hàng');
    }
  };

  const handleUpdateStatus = (order) => {
    setSelectedOrder(order);
    setStatusToUpdate(order.status);
    setOpenStatusDialog(true);
  };

  const handleStatusUpdate = async () => {
    if (!orderService.validateStatusUpdate(statusToUpdate)) {
      setError('Trạng thái không hợp lệ');
      return;
    }

    try {
      await orderService.updateOrderStatus(selectedOrder._id, statusToUpdate);
      setOpenStatusDialog(false);
      fetchAllData(); // Refresh toàn bộ dữ liệu
    } catch (error) {
      console.error('Error updating order status:', error);
      setError('Không thể cập nhật trạng thái đơn hàng');
    }
  };

  const handleDeleteOrder = async (orderId, restaurantId) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      try {
        await orderService.deleteOrder(orderId, restaurantId);
        fetchAllData(); // Refresh toàn bộ dữ liệu
      } catch (error) {
        console.error('Error deleting order:', error);
        setError('Không thể hủy đơn hàng');
      }
    }
  };

  const handleCloseDetailDialog = () => {
    setOpenDetailDialog(false);
    setSelectedOrder(null);
  };

  const handleCloseStatusDialog = () => {
    setOpenStatusDialog(false);
    setSelectedOrder(null);
    setStatusToUpdate('');
  };

  const getStatusChip = (order) => (
    <Chip
      label={order.statusLabel}
      color={order.statusColor}
      size="small"
    />
  );

  const getPaymentMethodChip = (method) => {
    const color = method === 'COD' ? 'warning' : 'success';
    return (
      <Chip
        label={method}
        color={color}
        size="small"
      />
    );
  };

  // Helper functions để lấy thông tin user và admin
  const getUserInfo = (userId) => {
    const user = users.find(u => u._id === userId);
    return user ? { 
      name: user.name, 
      phone: user.phone, 
      email: user.email 
    } : { 
      name: 'Không xác định', 
      phone: 'N/A', 
      email: 'N/A' 
    };
  };

  const getRestaurantInfo = (restaurantId) => {
    const admin = admins.find(a => a._id === restaurantId);
    return admin ? { 
      name: admin.name, 
      phone: admin.phone, 
      email: admin.email 
    } : { 
      name: 'Không xác định', 
      phone: 'N/A', 
      email: 'N/A' 
    };
  };

  if (loading) {
    return (
      <PageContainer title="Orders" description="Quản lý đơn hàng">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Orders" description="Quản lý đơn hàng">
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
                Quản lý Đơn hàng
              </Typography>
              <Button
                variant="outlined"
                startIcon={<IconRefresh />}
                onClick={fetchAllData}
              >
                Làm mới
              </Button>
            </Box>

            {/* Search Section */}
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Tìm kiếm theo tên nhà hàng"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: <IconSearch size={20} style={{ marginRight: 8 }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="textSecondary">
                    Tổng cộng: {orders.length} đơn hàng
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Mã đơn hàng</TableCell>
                    <TableCell>Khách hàng</TableCell>
                    <TableCell>Nhà hàng</TableCell>
                    <TableCell>Ngày đặt</TableCell>
                    <TableCell>Số lượng sản phẩm</TableCell>
                    <TableCell>Tổng tiền</TableCell>
                    <TableCell>Phương thức thanh toán</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell>Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order) => {
                    const userInfo = getUserInfo(order.user_id);
                    const restaurantInfo = getRestaurantInfo(order.restaurant_id);
                    
                    return (
                      <TableRow key={order._id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconShoppingCart size={16} />
                            <Typography variant="body2" fontWeight="bold">
                              #{order._id.slice(-8)}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              {userInfo.name}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {userInfo.phone}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              {restaurantInfo.name}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {restaurantInfo.phone}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {order.formattedDate}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {orderService.getTotalItems(order)} sản phẩm
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            {order.formattedTotal}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {getPaymentMethodChip(order.payment_method)}
                        </TableCell>
                        <TableCell>
                          {getStatusChip(order)}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            <Tooltip title="Xem chi tiết">
                              <IconButton 
                                size="small" 
                                color="info"
                                onClick={() => handleViewOrder(order)}
                              >
                                <IconEye size={16} />
                              </IconButton>
                            </Tooltip>
                            {/* <Tooltip title="Hủy đơn hàng">
                              <IconButton 
                                size="small" 
                                color="error"
                                onClick={() => handleDeleteOrder(order._id, order.restaurant_id)}
                              >
                                <IconTrash size={16} />
                              </IconButton>
                            </Tooltip> */}
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            {orders.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <IconShoppingCart size={48} color="grey" />
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  {searchTerm ? 'Không tìm thấy đơn hàng nào' : 'Chưa có đơn hàng nào'}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Dialog for Order Detail */}
        <Dialog 
          open={openDetailDialog} 
          onClose={handleCloseDetailDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Chi tiết đơn hàng #{selectedOrder?._id?.slice(-8)}
          </DialogTitle>
          <DialogContent>
            {selectedOrder && (
              <OrderDetail 
                order={selectedOrder} 
                users={users}
                admins={admins}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDetailDialog}>
              Đóng
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </PageContainer>
  );
};

export default Orders; 