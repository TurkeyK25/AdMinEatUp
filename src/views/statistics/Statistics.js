import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  IconTrendingUp,
  IconShoppingCart,
  IconStar,
  IconPackage
} from '@tabler/icons-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import PageContainer from 'src/components/container/PageContainer';
import { statisticsService } from 'src/services/statisticsService.js';

const COLORS = ['#1976d2', '#4caf50', '#ff9800', '#f44336', '#ffc107', '#00bcd4', '#9c27b0', '#e91e63'];

const Statistics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboard, setDashboard] = useState(null);
  const [totalRevenue, setTotalRevenue] = useState(null);
  const [orderSummary, setOrderSummary] = useState(null);
  const [revenueSummary, setRevenueSummary] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [orderStatus, setOrderStatus] = useState([]);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError('');
      const [dashboardRes, totalRevenueRes, orderSummaryRes, revenueSummaryRes, topProductsRes, orderStatusRes] = await Promise.all([
        statisticsService.getDashboardSummary(),
        statisticsService.getTotalRevenue(),
        statisticsService.getOrderCountSummary(),
        statisticsService.getRevenueSummary(),
        statisticsService.getTopProducts('year'),
        statisticsService.getOrderStatusSummary('year')
      ]);
      setDashboard(dashboardRes);
      setTotalRevenue(totalRevenueRes);
      setOrderSummary(orderSummaryRes.data);
      setRevenueSummary(revenueSummaryRes.data);
      setTopProducts(topProductsRes);
      setOrderStatus(orderStatusRes);
    } catch (error) {
      setError('Không thể tải dữ liệu thống kê');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Line chart: Tổng doanh thu theo năm
  const revenueLineData = revenueSummary && revenueSummary.year && revenueSummary.year.restaurants
    ? revenueSummary.year.restaurants.map(r => ({ name: r.restaurant_name, revenue: r.revenue }))
    : [];

  // Line chart: Tổng hóa đơn theo năm
  const orderLineData = orderSummary && orderSummary.year && orderSummary.year.restaurants
    ? orderSummary.year.restaurants.map(r => ({ name: r.restaurant_name, orders: r.orderCount }))
    : [];

  // Bar chart: top sản phẩm bán chạy nhất (theo số lượng)
  const barChartData = topProducts && topProducts.length > 0
    ? topProducts.map((p, idx) => ({ name: p.name, quantity: p.quantity, color: COLORS[idx % COLORS.length] }))
    : [];

  // Pie chart: tỉ lệ trạng thái đơn hàng
  const pieChartData = orderStatus && orderStatus.length > 0
    ? orderStatus.map((s, idx) => ({ name: s.status, value: s.count, color: COLORS[idx % COLORS.length] }))
    : [];

  if (loading) {
    return (
      <PageContainer title="Thống kê hệ thống" description="Thống kê tổng hợp toàn bộ nhà hàng">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="Thống kê hệ thống" description="Thống kê tổng hợp toàn bộ nhà hàng">
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Thống kê hệ thống" description="Thống kê tổng hợp toàn bộ nhà hàng">
      <Box>
        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="h6">
                      Tổng đơn hàng
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {dashboard?.totalOrders || 0}
                    </Typography>
                  </Box>
                  <IconShoppingCart size={40} color="#1976d2" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="h6">
                      Tổng doanh thu
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="success.main">
                      {formatCurrency(totalRevenue?.totalRevenue || dashboard?.totalRevenue || 0)}
                    </Typography>
                  </Box>
                  <IconTrendingUp size={40} color="#4caf50" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="h6">
                      Sản phẩm
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {dashboard?.totalProducts || 0}
                    </Typography>
                  </Box>
                  <IconPackage size={40} color="#ff9800" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="h6">
                      Đánh giá
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {dashboard?.totalReviews || 0}
                    </Typography>
                  </Box>
                  <IconStar size={40} color="#ffc107" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Line Chart: Tổng doanh thu theo năm */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Tổng doanh thu theo năm
                </Typography>
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={revenueLineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip formatter={formatCurrency} />
                    <Line type="monotone" dataKey="revenue" stroke="#1976d2" strokeWidth={2} name="Doanh thu" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          {/* Line Chart: Tổng hóa đơn theo năm */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Tổng hóa đơn theo năm
                </Typography>
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={orderLineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Line type="monotone" dataKey="orders" stroke="#ff9800" strokeWidth={2} name="Hóa đơn" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Bar Chart: Top sản phẩm bán chạy nhất */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Top sản phẩm bán chạy nhất (theo số lượng)
                </Typography>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={barChartData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={120} />
                    <RechartsTooltip />
                    <Bar dataKey="quantity">
                      {barChartData.map((entry, idx) => (
                        <Cell key={`cell-bar-${idx}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          {/* Pie Chart: Tỉ lệ trạng thái đơn hàng */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Tỉ lệ trạng thái đơn hàng
                </Typography>
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((entry, idx) => (
                        <Cell key={`cell-pie-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Statistics; 