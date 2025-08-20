import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { IconShoppingCart, IconTruck, IconClock, IconX } from '@tabler/icons-react';

const OrderStats = ({ orderStats }) => {
  const { totalOrders, totalRevenue, averageOrderValue, deliveredOrders, pendingOrders, cancelledOrders } = orderStats;

  const stats = [
    {
      title: 'Tổng đơn hàng',
      value: totalOrders,
      icon: IconShoppingCart,
      color: 'primary'
    },
    {
      title: 'Tổng doanh thu',
      value: `${totalRevenue.toLocaleString()} VNĐ`,
      icon: IconTruck,
      color: 'success'
    },
    {
      title: 'Đơn hàng đã giao',
      value: deliveredOrders,
      icon: IconTruck,
      color: 'success'
    },
    {
      title: 'Đơn hàng chờ xử lý',
      value: pendingOrders,
      icon: IconClock,
      color: 'warning'
    },
    {
      title: 'Đơn hàng đã hủy',
      value: cancelledOrders,
      icon: IconX,
      color: 'error'
    }
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Thống kê đơn hàng
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  p: 2,
                  bgcolor: 'grey.50',
                  borderRadius: 2,
                  minWidth: 150
                }}
              >
                <IconComponent size={24} color={stat.color === 'success' ? '#4caf50' : stat.color === 'warning' ? '#ff9800' : stat.color === 'error' ? '#f44336' : '#1976d2'} />
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {stat.value}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {stat.title}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>

        <Box sx={{ mt: 3, p: 2, bgcolor: 'primary.light', borderRadius: 2 }}>
          <Typography variant="subtitle1" color="white" fontWeight="bold">
            Giá trị đơn hàng trung bình: {averageOrderValue.toLocaleString()} VNĐ
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default OrderStats; 