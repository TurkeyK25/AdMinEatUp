import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Avatar } from '@mui/material';
import { IconShoppingCart, IconTruck, IconClock, IconX } from '@tabler/icons-react';

const RecentOrders = ({ orders }) => {
  // Helper function to safely get numeric value
  const getNumericValue = (value) => {
    if (value === null || value === undefined) return 0;
    if (typeof value === 'object') {
      // If it's an object, try to get a numeric value
      if (typeof value.total_amount === 'number') return value.total_amount;
      if (typeof value.amount === 'number') return value.amount;
      return 0;
    }
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered':
        return <IconTruck size={16} color="#4caf50" />;
      case 'Pending':
        return <IconClock size={16} color="#ff9800" />;
      case 'Cancelled':
        return <IconX size={16} color="#f44336" />;
      default:
        return <IconShoppingCart size={16} color="#1976d2" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Đơn hàng gần đây
        </Typography>
        
        <Box sx={{ mt: 2 }}>
          {orders && orders.length > 0 ? (
            orders.slice(0, 5).map((order, index) => {
              const totalAmount = getNumericValue(order.total_amount);
              return (
                <Box
                  key={order._id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 2,
                    mb: 2,
                    bgcolor: 'grey.50',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'grey.200'
                  }}
                >
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <IconShoppingCart size={20} />
                  </Avatar>
                  
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Đơn hàng #{order._id?.slice(-6) || 'N/A'}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {order.items?.length || 0} sản phẩm • {formatDate(order.createdAt)}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Chip
                        label={order.status}
                        size="small"
                        color={getStatusColor(order.status)}
                        icon={getStatusIcon(order.status)}
                      />
                    </Box>
                  </Box>
                  
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      {totalAmount.toLocaleString()} VNĐ
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {order.payment_method}
                    </Typography>
                  </Box>
                </Box>
              );
            })
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <IconShoppingCart size={48} color="grey" />
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Chưa có đơn hàng nào
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default RecentOrders; 