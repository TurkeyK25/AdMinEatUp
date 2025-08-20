import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Tooltip,
  Button,
  Chip,
  Avatar
} from '@mui/material';
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconBuilding,
  IconMapPin,
  IconPhone,
  IconCalendar,
  IconRefresh,
  IconLock,
  IconLockOpen
} from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import { restaurantService } from 'src/services/restaurantService.js';
import { mockRestaurantService } from 'src/services/mockRestaurantService.js';
import RestaurantForm from './RestaurantForm';
import axios from 'axios';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [blockLoading, setBlockLoading] = useState(false);
  const [addresses, setAddresses] = useState({});

  // Chọn service để sử dụng (real API hoặc mock)
  const restaurantServiceToUse = restaurantService; // Thay đổi thành restaurantService để dùng real API

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchAddresses = async (admins) => {
    const addressMap = {};
    await Promise.all(admins.map(async (admin) => {
      try {
        const res = await axios.get(`/api/address/${admin._id}`);
        const list = res.data;
        if (Array.isArray(list) && list.length > 0) {
          const def = list.find(a => a.is_default) || list[0];
          addressMap[admin._id] = def;
        } else {
          addressMap[admin._id] = null;
        }
      } catch {
        addressMap[admin._id] = null;
      }
    }));
    setAddresses(addressMap);
  };

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await restaurantServiceToUse.getRestaurants();
      console.log('API - Raw data from /list/admins:', data);
      const formattedRestaurants = data.map(restaurant => 
        restaurantServiceToUse.formatRestaurant(restaurant)
      );
      console.log('API - Formatted restaurants:', formattedRestaurants);
      setRestaurants(formattedRestaurants);
      await fetchAddresses(formattedRestaurants);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      setError('Không thể tải danh sách nhà hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRestaurant = () => {
    setSelectedRestaurant(null);
    setOpenFormDialog(true);
  };

  const handleEditRestaurant = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setOpenFormDialog(true);
  };

  const handleDeleteRestaurant = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setOpenDeleteDialog(true);
  };

  const handleSubmitForm = async (formData) => {
    try {
      setFormLoading(true);
      setError('');

      if (selectedRestaurant) {
        // Update existing restaurant
        await restaurantServiceToUse.updateRestaurant(selectedRestaurant._id, formData);
      } else {
        // Create new restaurant
        await restaurantServiceToUse.createRestaurant(formData);
      }

      fetchRestaurants(); // Refresh danh sách
      setOpenFormDialog(false);
    } catch (error) {
      console.error('Error saving restaurant:', error);
      throw new Error('Không thể lưu nhà hàng');
    } finally {
      setFormLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setFormLoading(true);
      setError('');
      
      console.log('Deleting restaurant with ID:', selectedRestaurant._id);
      await restaurantServiceToUse.deleteRestaurant(selectedRestaurant._id);
      console.log('Restaurant deleted successfully');
      fetchRestaurants(); // Refresh danh sách
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting restaurant:', error);
      setError('Không thể xóa nhà hàng');
    } finally {
      setFormLoading(false);
    }
  };

  const handleCloseFormDialog = () => {
    setOpenFormDialog(false);
    setSelectedRestaurant(null);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedRestaurant(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  // Block/Unblock handler
  const handleToggleBlock = async (restaurant) => {
    setSelectedRestaurant(restaurant);
    setBlockLoading(true);
    try {
      await restaurantServiceToUse.blockRestaurant(restaurant._id, !restaurant.block);
      fetchRestaurants();
    } catch (error) {
      setError('Không thể thay đổi trạng thái nhà hàng');
    } finally {
      setBlockLoading(false);
      setSelectedRestaurant(null);
    }
  };

  if (loading) {
    return (
      <PageContainer title="Restaurants" description="Quản lý nhà hàng">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Restaurants" description="Quản lý nhà hàng">
      <Box>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4" fontWeight="bold">
                Quản lý Nhà hàng
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<IconRefresh />}
                  onClick={fetchRestaurants}
                >
                  Làm mới
                </Button>
              </Box>
            </Box>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nhà hàng</TableCell>
                    <TableCell>Địa chỉ</TableCell>
                    <TableCell>Số điện thoại</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Đánh giá</TableCell>
                    <TableCell align="center">Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {restaurants.map((restaurant) => (
                    <TableRow key={restaurant._id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar src={restaurant.avatar_url ? (restaurant.avatar_url.startsWith('http') ? restaurant.avatar_url : `http://localhost:3000/${restaurant.avatar_url.replace(/^\/+/, '')}`) : ''}>
                            <IconBuilding size={20} />
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="bold">{restaurant.name}</Typography>
                            <Typography variant="caption" color="textSecondary">ID: {restaurant._id?.slice(-8)}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {(() => {
                          const addr = addresses[restaurant._id];
                          if (!addr) return <Typography color="textSecondary">Chưa có địa chỉ</Typography>;
                          return (
                            <Box>
                              <Typography variant="body2" fontWeight={600}>{addr.city}, {addr.ward}</Typography>
                              <Typography variant="body2">{addr.street}</Typography>
                              {addr.is_default && <Chip label="Mặc định" color="success" size="small" sx={{ ml: 1 }} />}
                            </Box>
                          );
                        })()}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconPhone size={16} color="#666" />
                          <Typography variant="body2">
                            {restaurant.phone}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ maxWidth: 200 }}>
                          {restaurant.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <span style={{ color: '#ffb400', fontWeight: 700 }}>
                            {restaurant.rating ? restaurant.rating.toFixed(1) : '0.0'}
                          </span>
                          <span style={{ color: '#888', fontSize: 13 }}>
                            ({restaurant.num_reviews || 0} đánh giá)
                          </span>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <Tooltip title={restaurant.block ? 'Mở khóa' : 'Khóa'}>
                            <IconButton
                              size="small"
                              color={restaurant.block ? 'success' : 'error'}
                              onClick={() => handleToggleBlock(restaurant)}
                              disabled={blockLoading}
                            >
                              {restaurant.block ? <IconLockOpen size={16} /> : <IconLock size={16} />}
                            </IconButton>
                          </Tooltip>
                          
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {restaurants.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <IconBuilding size={48} color="grey" />
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  Chưa có nhà hàng nào
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Form Dialog */}
        <RestaurantForm
          open={openFormDialog}
          onClose={handleCloseFormDialog}
          restaurant={selectedRestaurant}
          onSubmit={handleSubmitForm}
          loading={formLoading}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog 
          open={openDeleteDialog} 
          onClose={handleCloseDeleteDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Xác nhận xóa nhà hàng
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Bạn có chắc chắn muốn xóa nhà hàng <strong>"{selectedRestaurant?.name}"</strong>?
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Hành động này không thể hoàn tác.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog} disabled={formLoading}>
              Hủy
            </Button>
            <Button 
              variant="contained" 
              color="error"
              onClick={handleConfirmDelete}
              disabled={formLoading}
              startIcon={formLoading ? <CircularProgress size={16} /> : null}
            >
              {formLoading ? 'Đang xóa...' : 'Xóa'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </PageContainer>
  );
};

export default Restaurants; 