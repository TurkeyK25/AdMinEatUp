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
  IconRefresh
} from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import { orderService } from 'src/services/orderService.js';
import OrderDetail from './OrderDetail';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [statusToUpdate, setStatusToUpdate] = useState('');
  const [restaurantId, setRestaurantId] = useState('68613b9d3eadd5866807c9c4'); // Default restaurant ID

  useEffect(() => {
    fetchOrders();
  }, [restaurantId]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrdersByRestaurant(restaurantId);
      const formattedOrders = data.map(order => orderService.formatOrder(order));
      setOrders(formattedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = async (order) => {
    try {
      const orderDetail = await orderService.getOrderDetail(order._id, restaurantId);
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
      fetchOrders(); // Refresh danh sách
    } catch (error) {
      console.error('Error updating order status:', error);
      setError('Không thể cập nhật trạng thái đơn hàng');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      try {
        await orderService.deleteOrder(orderId, restaurantId);
        fetchOrders(); // Refresh danh sách
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
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                  label="Restaurant ID"
                  value={restaurantId}
                  onChange={(e) => setRestaurantId(e.target.value)}
                  size="small"
                  sx={{ width: 200 }}
                />
                <Button
                  variant="outlined"
                  startIcon={<IconRefresh />}
                  onClick={fetchOrders}
                >
                  Làm mới
                </Button>
              </Box>
            </Box>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Mã đơn hàng</TableCell>
                    <TableCell>Ngày đặt</TableCell>
                    <TableCell>Số lượng sản phẩm</TableCell>
                    <TableCell>Tổng tiền</TableCell>
                    <TableCell>Phương thức thanh toán</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell>Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order) => (
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
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Xem chi tiết">
                            <IconButton 
                              size="small" 
                              color="info"
                              onClick={() => handleViewOrder(order)}
                            >
                              <IconEye size={16} />
                            </IconButton>
                          </Tooltip>
                          {/* <Tooltip title="Cập nhật trạng thái">
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => handleUpdateStatus(order)}
                            >
                              <IconEdit size={16} />
                            </IconButton>
                          </Tooltip> */}
                          <Tooltip title="Hủy đơn hàng">
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleDeleteOrder(order._id)}
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

            {orders.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <IconShoppingCart size={48} color="grey" />
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  Chưa có đơn hàng nào
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
              <OrderDetail order={selectedOrder} />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDetailDialog}>
              Đóng
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog for Status Update
        <Dialog 
          open={openStatusDialog} 
          onClose={handleCloseStatusDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Cập nhật trạng thái đơn hàng
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Trạng thái mới</InputLabel>
                <Select
                  value={statusToUpdate}
                  onChange={(e) => setStatusToUpdate(e.target.value)}
                  label="Trạng thái mới"
                >
                  {orderService.getOrderStatuses().map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      <Chip 
                        label={status.label} 
                        color={status.color} 
                        size="small" 
                        sx={{ mr: 1 }}
                      />
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseStatusDialog}>
              Hủy
            </Button>
            <Button 
              variant="contained" 
              onClick={handleStatusUpdate}
              disabled={!statusToUpdate}
            >
              Cập nhật
            </Button>
          </DialogActions>
        </Dialog> */}
      </Box>
    </PageContainer>
  );
};

export default Orders; 