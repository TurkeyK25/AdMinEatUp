import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { IconTicket, IconCheck, IconTrendingUp } from '@tabler/icons-react';

const VoucherStats = ({ voucherStats }) => {
  const { totalVouchers, activeVouchers, totalUsage } = voucherStats;

  const stats = [
    {
      title: 'Tổng voucher',
      value: totalVouchers,
      icon: IconTicket,
      color: '#1976d2'
    },
    {
      title: 'Voucher hoạt động',
      value: activeVouchers,
      icon: IconCheck,
      color: '#4caf50'
    },
    {
      title: 'Tổng lượt sử dụng',
      value: totalUsage,
      icon: IconTrendingUp,
      color: '#ff9800'
    }
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Thống kê voucher
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
            Tỷ lệ voucher hoạt động: {totalVouchers > 0 ? ((activeVouchers / totalVouchers) * 100).toFixed(1) : 0}%
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default VoucherStats; 