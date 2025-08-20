import React from 'react';
import { Card, CardContent, Typography, Box, Rating } from '@mui/material';
import { IconStar, IconMessage, IconThumbUp } from '@tabler/icons-react';

const ReviewStats = ({ reviewStats }) => {
  const { totalReviews, averageRating, totalRating } = reviewStats;

  const stats = [
    {
      title: 'Tổng đánh giá',
      value: totalReviews,
      icon: IconMessage,
      color: '#1976d2'
    },
    {
      title: 'Điểm trung bình',
      value: averageRating.toFixed(1),
      icon: IconStar,
      color: '#ff9800'
    },
    {
      title: 'Tổng điểm',
      value: totalRating,
      icon: IconThumbUp,
      color: '#4caf50'
    }
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Thống kê đánh giá
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

        {averageRating > 0 && (
          <Box sx={{ mt: 3, p: 2, bgcolor: 'warning.light', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Rating value={averageRating} precision={0.1} readOnly />
              <Typography variant="subtitle1" color="white" fontWeight="bold">
                {averageRating.toFixed(1)}/5.0
              </Typography>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewStats; 