import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { IconPackage, IconCheck, IconCurrencyDollar } from '@tabler/icons-react';

const ProductStats = ({ productStats }) => {
  const { totalProducts, activeProducts, averagePrice } = productStats;

  const stats = [
    {
      title: 'Tổng sản phẩm',
      value: totalProducts,
      icon: IconPackage,
      color: '#1976d2'
    },
    {
      title: 'Sản phẩm hoạt động',
      value: activeProducts,
      icon: IconCheck,
      color: '#4caf50'
    },
    {
      title: 'Giá trung bình',
      value: `${averagePrice.toLocaleString()} VNĐ`,
      icon: IconCurrencyDollar,
      color: '#ff9800'
    }
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Thống kê sản phẩm
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

        <Box sx={{ mt: 3, p: 2, bgcolor: 'warning.light', borderRadius: 2 }}>
          <Typography variant="subtitle1" color="white" fontWeight="bold">
            Tỷ lệ sản phẩm hoạt động: {totalProducts > 0 ? ((activeProducts / totalProducts) * 100).toFixed(1) : 0}%
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductStats; 