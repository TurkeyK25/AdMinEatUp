import React, { useState, useEffect } from 'react';
import {
  Box,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Divider,
  Button,
  Avatar,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  IconBell,
  IconUser,
  IconStar,
  IconShoppingCart,
  IconTruck,
  IconX,
  IconPackage,
  IconCheck,
  IconTrash,
  IconEye
} from '@tabler/icons-react';
import { notificationService } from 'src/services/notificationService.js';
import { mockNotificationService } from 'src/services/mockNotificationService.js';

const NotificationDropdown = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Chọn service để sử dụng (real API hoặc mock)
  const notificationServiceToUse = mockNotificationService; // Thay đổi thành notificationService để dùng real API

  const open = Boolean(anchorEl);

  useEffect(() => {
    if (open) {
      fetchNotifications();
    }
  }, [open]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await notificationServiceToUse.getNotifications();
      const formattedNotifications = data.map(notification => 
        notificationServiceToUse.formatNotification(notification)
      );
      setNotifications(formattedNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Không thể tải thông báo');
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationServiceToUse.markAsRead(notificationId);
      fetchNotifications(); // Refresh danh sách
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationServiceToUse.markAllAsRead();
      fetchNotifications(); // Refresh danh sách
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await notificationServiceToUse.deleteNotification(notificationId);
      fetchNotifications(); // Refresh danh sách
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'new_user':
        return <IconUser size={20} color="#1976d2" />;
      case 'new_review':
        return <IconStar size={20} color="#ff9800" />;
      case 'new_order':
        return <IconShoppingCart size={20} color="#4caf50" />;
      case 'order_cancelled':
        return <IconX size={20} color="#f44336" />;
      case 'order_delivered':
        return <IconTruck size={20} color="#4caf50" />;
      case 'low_stock':
        return <IconPackage size={20} color="#ff9800" />;
      default:
        return <IconBell size={20} color="#666" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'new_user':
        return 'primary';
      case 'new_review':
        return 'warning';
      case 'new_order':
        return 'success';
      case 'order_cancelled':
        return 'error';
      case 'order_delivered':
        return 'success';
      case 'low_stock':
        return 'warning';
      default:
        return 'default';
    }
  };

  const unreadCount = notificationServiceToUse.getUnreadCount(notifications);

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{ color: 'inherit' }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <IconBell size={24} />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 400,
            maxHeight: 500,
            overflow: 'auto'
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight="bold">
              Thông báo
            </Typography>
            {unreadCount > 0 && (
              <Button
                size="small"
                onClick={handleMarkAllAsRead}
                sx={{ fontSize: '0.75rem' }}
              >
                Đánh dấu tất cả đã đọc
              </Button>
            )}
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ m: 1 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress size={24} />
          </Box>
        ) : notifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <IconBell size={48} color="grey" />
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Không có thông báo nào
            </Typography>
          </Box>
        ) : (
          <Box>
            {notifications.map((notification) => (
              <MenuItem
                key={notification._id}
                sx={{
                  py: 1.5,
                  px: 2,
                  borderBottom: 1,
                  borderColor: 'divider',
                  backgroundColor: notification.isRead ? 'transparent' : 'action.hover',
                  '&:hover': {
                    backgroundColor: 'action.selected'
                  }
                }}
                onClick={() => !notification.isRead && handleMarkAsRead(notification._id)}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, width: '100%' }}>
                  <Avatar sx={{ bgcolor: 'grey.100', width: 40, height: 40 }}>
                    {getNotificationIcon(notification.type)}
                  </Avatar>
                  
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                      <Typography variant="subtitle2" fontWeight="bold" noWrap>
                        {notification.title}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {!notification.isRead && (
                          <Chip
                            label="Mới"
                            size="small"
                            color="error"
                            sx={{ height: 20, fontSize: '0.7rem' }}
                          />
                        )}
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNotification(notification._id);
                          }}
                          sx={{ p: 0.5 }}
                        >
                          <IconTrash size={14} />
                        </IconButton>
                      </Box>
                    </Box>
                    
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                      {notification.message}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="textSecondary">
                        {notification.timeAgo}
                      </Typography>
                      <Chip
                        label={notification.type.replace('_', ' ')}
                        size="small"
                        color={getNotificationColor(notification.type)}
                        sx={{ fontSize: '0.7rem' }}
                      />
                    </Box>
                  </Box>
                </Box>
              </MenuItem>
            ))}
          </Box>
        )}

        {notifications.length > 0 && (
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Button
              fullWidth
              variant="outlined"
              size="small"
              onClick={handleClose}
            >
              Xem tất cả thông báo
            </Button>
          </Box>
        )}
      </Menu>
    </>
  );
};

export default NotificationDropdown; 