import React, { useState, useEffect } from 'react';
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
  Paper,
  CircularProgress,
  Avatar
} from '@mui/material';
import {
  IconUser,
  IconMapPin,
  IconCreditCard,
  IconTruck,
  IconCalendar,
  IconReceipt,
  IconBuilding,
  IconPhone,
  IconMail
} from '@tabler/icons-react';
import { orderService } from 'src/services/orderService.js';
import axios from 'axios';

const OrderDetail = ({ order, users, admins }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [restaurantInfo, setRestaurantInfo] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [restaurantAddress, setRestaurantAddress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetails();
  }, [order, users, admins]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      
      // Tìm thông tin user và restaurant từ props
      const user =order.user_id ;
      const restaurant = admins?.find(a => a._id === order.restaurant_id);
      
      setUserInfo(user || null);
      setRestaurantInfo(restaurant || null);

      // Fetch địa chỉ nếu có user_id và restaurant_id
      const promises = [];
      
      if (order.user_id) {
        promises.push(
          axios.get(`/api/address/${order.user_id._id}`)
            .then(res => {
              console.log('User addresses:',order.user_id._id );
              setUserAddress(res.data);
            })
            .catch(err => {
              console.error('Error fetching user address:', err);
              setUserAddress(null);
            })
        );
      }
      
      if (order.restaurant_id) {
        promises.push(
          axios.get(`/api/address/${order.restaurant_id}`)
            .then(res => {
              console.log('Restaurant addresses:', res.data);
              setRestaurantAddress(res.data);
            })
            .catch(err => {
              console.error('Error fetching restaurant address:', err);
              setRestaurantAddress(null);
            })
        );
      }

      await Promise.all(promises);
    } catch (error) {
      console.error('Error fetching details:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const formatAddress = (address) => {
    if (!address || address.length === 0) return 'Chưa có địa chỉ';
    
    // Tìm địa chỉ có is_default: true
    const defaultAddress = address.find(addr => addr.is_default === true);
    if (!defaultAddress) {
      // Nếu không có địa chỉ mặc định, lấy địa chỉ đầu tiên
      const firstAddress = address[0];
      if (!firstAddress) return 'Chưa có địa chỉ';
      return `${firstAddress.street}, ${firstAddress.ward}, ${firstAddress.city}`;
    }
    
    return `${defaultAddress.street}, ${defaultAddress.ward}, ${defaultAddress.city}`;
  };

  const getAvatarUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `http://localhost:3000/${url.replace(/^\/+/, '')}`;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

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
                    <strong>Giảm giá:</strong> {order.discount_amount?.toLocaleString()} VNĐ
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
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                
                <Typography variant="h6" fontWeight="bold">
                  {userInfo?.name || 'Không xác định'}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Khách hàng
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={9}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <IconUser size={16} />
                    <Typography variant="body2">
                      <strong>Tên khách hàng:</strong> {userInfo?.name || 'Không xác định'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <IconPhone size={16} />
                    <Typography variant="body2">
                      <strong>Số điện thoại:</strong> {userInfo?.phone || 'N/A'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <IconMail size={16} />
                    <Typography variant="body2">
                      <strong>Email:</strong> {userInfo?.email || 'N/A'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <IconMapPin size={16} />
                    <Typography variant="body2">
                      <strong>Địa chỉ:</strong>
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ ml: 3, color: 'textSecondary' }}>
                    {formatAddress(userAddress)}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Restaurant Information */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Thông tin nhà hàng
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                
                
                <Typography variant="h6" fontWeight="bold">
                  {restaurantInfo?.name || 'Không xác định'}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Nhà hàng
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={9}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <IconBuilding size={16} />
                    <Typography variant="body2">
                      <strong>Tên nhà hàng:</strong> {restaurantInfo?.name || 'Không xác định'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <IconPhone size={16} />
                    <Typography variant="body2">
                      <strong>Số điện thoại:</strong> {restaurantInfo?.phone || 'N/A'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <IconMail size={16} />
                    <Typography variant="body2">
                      <strong>Email:</strong> {restaurantInfo?.email || 'N/A'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <IconMapPin size={16} />
                    <Typography variant="body2">
                      <strong>Địa chỉ nhà hàng:</strong>
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ ml: 3, color: 'textSecondary' }}>
                    {formatAddress(restaurantAddress)}
                  </Typography>
                </Grid>
              </Grid>
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
                        {item.price?.toLocaleString()} VNĐ
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight="bold">
                        {(item.price * item.quantity).toLocaleString()} VNĐ
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
                {(order.total_amount + order.discount_amount - order.shipping_fee).toLocaleString()} VNĐ
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">Phí vận chuyển:</Typography>
              <Typography variant="body2">{order.shipping_fee?.toLocaleString()} VNĐ</Typography>
            </Box>
            
            {order.discount_amount > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="error">Giảm giá:</Typography>
                <Typography variant="body2" color="error">-{order.discount_amount?.toLocaleString()} VNĐ</Typography>
              </Box>
            )}
            
            <Divider sx={{ my: 1 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6" fontWeight="bold">Tổng cộng:</Typography>
              <Typography variant="h6" fontWeight="bold" color="primary">
                {order.total_amount?.toLocaleString()} VNĐ
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default OrderDetail; 