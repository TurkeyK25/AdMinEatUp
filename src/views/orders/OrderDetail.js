import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import {
  IconUser,
  IconMapPin,
  IconCreditCard,
  IconTruck,
  IconCalendar,
  IconReceipt
} from '@tabler/icons-react';
import { orderService } from 'src/services/orderService.js';

const OrderDetail = ({ order }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const getStatusChip = (status) => {
    const statuses = orderService.getOrderStatuses();
    const statusObj = statuses.find(s => s.value === status);
    return (
      <Chip
        label={statusObj ? statusObj.label : status}
        color={statusObj ? statusObj.color : 'default'}
        size="small"
      />
    );
  };

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

  // Helper function to safely render values
  const renderValue = (value) => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'object') {
      // If it's an object, try to get a meaningful string representation
      if (value._id) return value._id;
      if (value.name) return value.name;
      if (value.email) return value.email;
      return JSON.stringify(value);
    }
    return String(value);
  };

  return (
    <Box>
      {/* Order Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              Đơn hàng #{order._id?.slice(-8)}
            </Typography>
            {getStatusChip(order.status)}
          </Box>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <IconCalendar size={16} />
                <Typography variant="body2">
                  <strong>Ngày đặt:</strong> {formatDate(order.createdAt)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <IconReceipt size={16} />
                <Typography variant="body2" component="span">
                  <strong>Phương thức thanh toán:</strong> 
                </Typography>
                <Box component="span" sx={{ ml: 1 }}>
                  {getPaymentMethodChip(order.payment_method)}
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <IconTruck size={16} />
                <Typography variant="body2">
                  <strong>Phí vận chuyển:</strong> ${order.shipping_fee}
                </Typography>
              </Box>
              {order.discount_amount > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <IconReceipt size={16} />
                  <Typography variant="body2">
                    <strong>Giảm giá:</strong> ${order.discount_amount}
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Customer Information */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Thông tin khách hàng
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <IconUser size={16} />
                <Typography variant="body2">
                  <strong>User ID:</strong> {renderValue(order.user_id)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <IconMapPin size={16} />
                <Typography variant="body2">
                  <strong>Address ID:</strong> {renderValue(order.address_id)}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Chi tiết sản phẩm
          </Typography>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Sản phẩm</TableCell>
                  <TableCell>Hình ảnh</TableCell>
                  <TableCell align="right">Số lượng</TableCell>
                  <TableCell align="right">Đơn giá</TableCell>
                  <TableCell align="right">Thành tiền</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.items?.map((item, index) => (
                  <TableRow key={item._id || index}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {item.product_name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box
                        component="img"
                        src={`http://localhost:3000/uploads/${item.product_image}`}
                        alt={item.product_name}
                        sx={{
                          width: 50,
                          height: 50,
                          objectFit: 'cover',
                          borderRadius: 1
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">
                        {item.quantity}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">
                        ${item.price}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight="bold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Tổng kết đơn hàng
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">Tổng tiền sản phẩm:</Typography>
              <Typography variant="body2">
                ${(order.total_amount + order.discount_amount - order.shipping_fee).toFixed(2)}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">Phí vận chuyển:</Typography>
              <Typography variant="body2">${order.shipping_fee}</Typography>
            </Box>
            
            {order.discount_amount > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="error">Giảm giá:</Typography>
                <Typography variant="body2" color="error">-${order.discount_amount}</Typography>
              </Box>
            )}
            
            <Divider sx={{ my: 1 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6" fontWeight="bold">Tổng cộng:</Typography>
              <Typography variant="h6" fontWeight="bold" color="primary">
                ${order.total_amount}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default OrderDetail; 