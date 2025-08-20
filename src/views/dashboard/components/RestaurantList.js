import React from 'react';
import { Card, CardContent, Typography, Avatar, Box, Chip, Grid, Tooltip } from '@mui/material';
import { IconLock, IconLockOpen, IconMail, IconPhone, IconStar } from '@tabler/icons-react';

const getAvatarUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `http://localhost:3000/${url.replace(/^\/+/, '')}`;
};

const RestaurantList = ({ admins }) => {
  if (!admins || admins.length === 0) {
    return <Typography color="textSecondary">Không có nhà hàng nào.</Typography>;
  }
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Danh sách Nhà hàng</Typography>
        <Grid container spacing={2}>
          {admins.map((admin) => (
            <Grid item xs={12} md={6} lg={4} key={admin._id}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, border: '1px solid #eee', borderRadius: 2 }}>
                <Avatar src={getAvatarUrl(admin.avatar_url)} sx={{ width: 56, height: 56 }} />
                <Box flex={1}>
                  <Typography variant="subtitle1" fontWeight={700}>{admin.name}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <IconMail size={16} color="#888" />
                    <Typography variant="body2">{admin.email}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <IconPhone size={16} color="#888" />
                    <Typography variant="body2">{admin.phone}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Tooltip title={admin.block ? 'Đã khóa' : 'Đang hoạt động'}>
                      <Chip
                        label={admin.block ? 'Đã khóa' : 'Hoạt động'}
                        color={admin.block ? 'error' : 'success'}
                        size="small"
                        icon={admin.block ? <IconLock size={16} /> : <IconLockOpen size={16} />}
                      />
                    </Tooltip>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 1 }}>
                      <IconStar size={16} color="#ffc107" />
                      <Typography variant="body2">{admin.rating?.toFixed(2) || 0} ({admin.num_reviews || 0} đánh giá)</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default RestaurantList; 