import React from 'react';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import { IconUsers, IconUserPlus, IconCheck } from '@tabler/icons-react';

const UserStats = ({ userStats }) => {
  const { totalUsers, activeUsers, newUsersThisMonth } = userStats;

  const stats = [
    {
      title: 'Tổng người dùng',
      value: totalUsers,
      icon: IconUsers,
      color: '#1976d2'
    },
    {
      title: 'Người dùng hoạt động',
      value: activeUsers,
      icon: IconCheck,
      color: '#4caf50'
    },
    {
      title: 'Người dùng mới tháng này',
      value: newUsersThisMonth,
      icon: IconUserPlus,
      color: '#ff9800'
    }
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Thống kê người dùng
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

        <Box sx={{ mt: 3, p: 2, bgcolor: 'success.light', borderRadius: 2 }}>
          <Typography variant="subtitle1" color="white" fontWeight="bold">
            Tỷ lệ tăng trưởng: {totalUsers > 0 ? ((newUsersThisMonth / totalUsers) * 100).toFixed(1) : 0}%
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserStats; 