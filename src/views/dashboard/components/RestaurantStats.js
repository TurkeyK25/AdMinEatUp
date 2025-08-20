import React from 'react';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import { IconBuilding, IconCheck, IconLock, IconStar } from '@tabler/icons-react';

const RestaurantStats = ({ restaurantStats }) => {
  const stats = [
    {
      title: 'Tổng nhà hàng',
      value: restaurantStats.total,
      icon: IconBuilding,
      color: '#1976d2'
    },
    {
      title: 'Đang khóa',
      value: restaurantStats.blocked,
      icon: IconLock,
      color: '#f44336'
    },
    {
      title: 'Đang hoạt động',
      value: restaurantStats.active,
      icon: IconCheck,
      color: '#4caf50'
    },
    {
      title: 'Trung bình rating',
      value: restaurantStats.avgRating,
      icon: IconStar,
      color: '#ffc107'
    },
    {
      title: 'Tổng đánh giá',
      value: restaurantStats.totalReviews,
      icon: IconStar,
      color: '#ff9800'
    }
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Thống kê nhà hàng
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
          {stats.map((stat, idx) => {
            const IconComponent = stat.icon;
            return (
              <Box
                key={idx}
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
                <IconComponent size={24} color={stat.color} />
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
      </CardContent>
    </Card>
  );
};

export default RestaurantStats; 