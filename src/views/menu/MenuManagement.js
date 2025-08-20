import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Rating,
  IconButton,
  Snackbar
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PageContainer from 'src/components/container/PageContainer';
import { productService } from 'src/services/productService.js';
import { mockProductService } from 'src/services/mockProductService.js';

const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `http://localhost:3000/${url.replace(/^\/+/, '')}`;
};

const MenuManagement = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Đổi sang productService để dùng API thật
  const productServiceToUse = productService;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await productServiceToUse.getProducts();
      setProducts(data);
    } catch (err) {
      setError('Không thể tải thực đơn');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetail = (product) => {
    setSelected(product);
    setDetailOpen(true);
  };
  const handleCloseDetail = () => {
    setDetailOpen(false);
    setSelected(null);
  };

  const handleOpenDelete = (id) => {
    setDeleteId(id);
  };
  const handleCloseDelete = () => {
    setDeleteId(null);
  };
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await productServiceToUse.deleteProduct(deleteId);
      setSnackbar({ open: true, message: 'Xóa sản phẩm thành công', severity: 'success' });
      setProducts(products.filter(p => p._id !== deleteId));
    } catch (err) {
      setSnackbar({ open: true, message: 'Xóa sản phẩm thất bại', severity: 'error' });
    } finally {
      setDeleteLoading(false);
      setDeleteId(null);
    }
  };

  if (loading) {
    return <PageContainer title="Quản lý thực đơn"><Box sx={{display:'flex',justifyContent:'center',alignItems:'center',height:'50vh'}}><CircularProgress/></Box></PageContainer>;
  }
  if (error) {
    return <PageContainer title="Quản lý thực đơn"><Alert severity="error">{error}</Alert></PageContainer>;
  }

  return (
    <PageContainer title="Quản lý thực đơn">
      <Box>
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
              <Card sx={{ cursor: 'pointer', height: '100%', position: 'relative' }} onClick={() => handleOpenDetail(product)}>
                <Box sx={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#fafafa' }}>
                  <img
                    src={getImageUrl(product.image_url)}
                    alt={product.name}
                    style={{ maxHeight: 160, maxWidth: '100%', objectFit: 'contain' }}
                    onError={e => e.target.style.display = 'none'}
                  />
                  <IconButton
                    aria-label="delete"
                    size="small"
                    sx={{ position: 'absolute', top: 8, right: 8, zIndex: 2, bgcolor: 'white' }}
                    onClick={e => { e.stopPropagation(); handleOpenDelete(product._id); }}
                  >
                    <DeleteIcon color="error" />
                  </IconButton>
                </Box>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom noWrap>{product.name}</Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom noWrap>
                    {product.description}
                  </Typography>
                  <Typography variant="h5" color="primary" fontWeight={700}>
                    {product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                  </Typography>
                  <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip label={product.status ? 'Đang bán' : 'Ngừng bán'} color={product.status ? 'success' : 'default'} size="small" />
                    <Rating value={product.rating} precision={0.1} size="small" readOnly />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Dialog chi tiết món ăn */}
        <Dialog open={detailOpen} onClose={handleCloseDetail} maxWidth="sm" fullWidth>
          <DialogTitle>Chi tiết món ăn</DialogTitle>
          <DialogContent>
            {selected && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <img
                    src={getImageUrl(selected.image_url)}
                    alt={selected.name}
                    style={{ maxHeight: 220, maxWidth: '100%', objectFit: 'contain', borderRadius: 8 }}
                    onError={e => e.target.style.display = 'none'}
                  />
                </Box>
                <Typography variant="h5" fontWeight={700} gutterBottom>{selected.name}</Typography>
                <Typography variant="body1" color="textSecondary" gutterBottom>{selected.description}</Typography>
                <Typography variant="h6" color="primary" fontWeight={700} gutterBottom>
                  Giá: {selected.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Chip label={selected.status ? 'Đang bán' : 'Ngừng bán'} color={selected.status ? 'success' : 'default'} size="small" />
                  <Rating value={selected.rating} precision={0.1} readOnly />
                  <Typography variant="body2">({selected.num_reviews} đánh giá)</Typography>
                </Box>
                <Typography variant="body2" gutterBottom>Số lượt mua: {selected.purchases}</Typography>
                <Typography variant="body2" gutterBottom>Cập nhật: {new Date(selected.updatedAt).toLocaleString('vi-VN')}</Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDetail} variant="contained">Đóng</Button>
          </DialogActions>
        </Dialog>

        {/* Dialog xác nhận xóa */}
        <Dialog open={!!deleteId} onClose={handleCloseDelete} maxWidth="xs">
          <DialogTitle>Xác nhận xóa</DialogTitle>
          <DialogContent>
            <Typography>Bạn có chắc chắn muốn xóa sản phẩm này?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDelete} disabled={deleteLoading}>Hủy</Button>
            <Button onClick={handleDelete} color="error" variant="contained" disabled={deleteLoading}>
              {deleteLoading ? 'Đang xóa...' : 'Xóa'}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          message={snackbar.message}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
      </Box>
    </PageContainer>
  );
};

export default MenuManagement; 