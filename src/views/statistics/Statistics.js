import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Button
} from '@mui/material';
import {
  IconTrendingUp,
  IconShoppingCart,
  IconStar,
  IconPackage,
  IconUsers,
  IconBuilding,
  IconFilter,
  IconRefresh,
  IconPercentage
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
import { formatVND } from 'src/utils/currencyFormatter.js';

const COLORS = ['#1976d2', '#4caf50', '#ff9800', '#f44336', '#ffc107', '#00bcd4', '#9c27b0', '#e91e63'];

const Statistics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboard, setDashboard] = useState(null);
  const [totalRevenue, setTotalRevenue] = useState(null);
  const [allRestaurantsRevenue, setAllRestaurantsRevenue] = useState(null);
  const [orderSummary, setOrderSummary] = useState(null);
  const [revenueSummary, setRevenueSummary] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [orderStatus, setOrderStatus] = useState([]);
  
  // State cho chọn nhà hàng
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState('all');
  const [restaurantStats, setRestaurantStats] = useState(null);
  const [restaurantRevenue, setRestaurantRevenue] = useState(null);
  const [refreshLoading, setRefreshLoading] = useState(false);

  useEffect(() => {
    fetchStatistics();
    fetchRestaurants();
  }, []);

  useEffect(() => {
    if (selectedRestaurant !== 'all') {
      fetchRestaurantData(selectedRestaurant);
    }
  }, [selectedRestaurant]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Statistics - Starting to fetch all statistics data');
      const [dashboardRes, totalRevenueRes, allRestaurantsRevenueRes, orderSummaryRes, revenueSummaryRes, topProductsRes, orderStatusRes] = await Promise.all([
        statisticsService.getDashboardSummary(),
        statisticsService.getTotalRevenue(),
        statisticsService.getAllRestaurantsRevenue(),
        statisticsService.getOrderCountSummary(),
        statisticsService.getRevenueSummary(),
        statisticsService.getTopProducts('year'),
        statisticsService.getOrderStatusSummary('year')
      ]);
      
      console.log('Statistics - All data fetched successfully:');
      console.log('Dashboard:', dashboardRes);
      console.log('Total Revenue:', totalRevenueRes);
      console.log('All Restaurants Revenue:', allRestaurantsRevenueRes);
      console.log('Order Summary:', orderSummaryRes);
      console.log('Revenue Summary:', revenueSummaryRes);
      console.log('Top Products:', topProductsRes);
      console.log('Order Status:', orderStatusRes);
      
      setDashboard(dashboardRes);
      setTotalRevenue(totalRevenueRes);
      setAllRestaurantsRevenue(allRestaurantsRevenueRes);
      setOrderSummary(orderSummaryRes.data);
      setRevenueSummary(revenueSummaryRes.data);
      setTopProducts(topProductsRes);
      setOrderStatus(orderStatusRes);
    } catch (error) {
      console.error('Statistics - Error fetching statistics:', error);
      setError('Không thể tải dữ liệu thống kê');
    } finally {
      setLoading(false);
    }
  };

  const fetchRestaurants = async () => {
    try {
      const restaurantsData = await statisticsService.getAllRestaurants();
      setRestaurants(restaurantsData);
    } catch (error) {
      console.error('Không thể tải danh sách nhà hàng:', error);
    }
  };

  const fetchRestaurantData = async (restaurantId) => {
    try {
      const [statsRes, revenueRes] = await Promise.all([
        statisticsService.getRestaurantStats(restaurantId),
        statisticsService.getRestaurantRevenue(restaurantId)
      ]);
      setRestaurantStats(statsRes);
      setRestaurantRevenue(revenueRes);
    } catch (error) {
      console.error('Không thể tải dữ liệu nhà hàng:', error);
    }
  };

  const formatCurrency = (amount) => {
    return formatVND(amount, true);
  };

  // Hàm tính 10% doanh thu
  const calculateTenPercent = (revenue) => {
    return (revenue || 0) * 0.1;
  };

  // Xác định dữ liệu hiển thị dựa trên nhà hàng được chọn
  const isShowingAllRestaurants = selectedRestaurant === 'all';
  const currentStats = isShowingAllRestaurants ? allRestaurantsRevenue : restaurantStats;
  const currentRevenue = isShowingAllRestaurants ? allRestaurantsRevenue : restaurantRevenue;

  console.log('Statistics - Display data calculation:');
  console.log('Selected restaurant:', selectedRestaurant);
  console.log('Is showing all restaurants:', isShowingAllRestaurants);
  console.log('Current stats:', currentStats);
  console.log('Current revenue:', currentRevenue);
  console.log('Dashboard data:', dashboard);
  console.log('Total revenue data:', totalRevenue);

  // Line chart: Doanh thu theo nhà hàng (chỉ hiển thị khi xem tổng hợp)
  const revenueLineData = isShowingAllRestaurants && allRestaurantsRevenue?.revenueByRestaurant
    ? allRestaurantsRevenue.revenueByRestaurant.map(r => ({ 
        name: r.restaurant_name, 
        revenue: r.revenue 
      }))
    : [];

  // Line chart: Doanh thu theo ngày
  const revenueByDateData = currentRevenue?.revenueByDate
    ? Object.entries(currentRevenue.revenueByDate).map(([date, revenue]) => ({
        name: new Date(date).toLocaleDateString('vi-VN'),
        revenue: revenue,
        date: date
      }))
    : [];

  // Bar chart: top sản phẩm bán chạy nhất (theo số lượng)
  const barChartData = currentRevenue?.topProducts && currentRevenue.topProducts.length > 0
    ? currentRevenue.topProducts.map((p, idx) => ({ 
        name: p.name, 
        quantity: p.quantity, 
        total: p.total,
        image: p.image,
        color: COLORS[idx % COLORS.length] 
      }))
    : [];

  // Pie chart: tỉ lệ trạng thái đơn hàng (giả định từ orderStatus)
  const pieChartData = orderStatus && orderStatus.length > 0
    ? orderStatus.map((s, idx) => ({ 
        name: s.status, 
        value: s.count, 
        color: COLORS[idx % COLORS.length] 
      }))
    : [];

  // Fallback data cho biểu đồ nếu không có dữ liệu
  const fallbackRevenueData = [
    { name: 'Chưa có dữ liệu', revenue: 0 }
  ];

  const fallbackBarData = [
    { name: 'Chưa có dữ liệu', quantity: 0, color: COLORS[0] }
  ];

  console.log('Statistics - Chart data:');
  console.log('Revenue line data:', revenueLineData);
  console.log('Revenue by date data:', revenueByDateData);
  console.log('Bar chart data:', barChartData);
  console.log('Pie chart data:', pieChartData);
  console.log('Current revenue data:', currentRevenue);
  console.log('Selected restaurant:', selectedRestaurant);
  console.log('10% calculation - All restaurants:', calculateTenPercent(allRestaurantsRevenue?.totalRevenue));
  console.log('10% calculation - Current restaurant:', calculateTenPercent(currentRevenue?.totalRevenue));

  const handleRestaurantChange = (event) => {
    setSelectedRestaurant(event.target.value);
  };

  const handleRefresh = async () => {
    try {
      console.log('Statistics - Starting refresh...');
      setRefreshLoading(true);
      await fetchStatistics();
      if (selectedRestaurant !== 'all') {
        console.log('Statistics - Refreshing restaurant data for:', selectedRestaurant);
        await fetchRestaurantData(selectedRestaurant);
      }
      console.log('Statistics - Refresh completed successfully');
    } catch (error) {
      console.error('Statistics - Error refreshing data:', error);
    } finally {
      setRefreshLoading(false);
    }
  };

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
        {/* Filter Section */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconFilter size={24} />
                <Typography variant="h6" sx={{ mr: 2 }}>
                  Chọn nhà hàng:
                </Typography>
                <FormControl sx={{ minWidth: 300 }}>
                  <InputLabel>Nhà hàng</InputLabel>
                  <Select
                    value={selectedRestaurant}
                    label="Nhà hàng"
                    onChange={handleRestaurantChange}
                  >
                    <MenuItem value="all">
                      <Chip 
                        label="Tất cả nhà hàng" 
                        color="primary" 
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      Tổng hợp toàn hệ thống
                    </MenuItem>
                    {restaurants.map((restaurant) => (
                      <MenuItem key={restaurant._id} value={restaurant._id}>
                        <Chip 
                          label={restaurant.name} 
                          color="secondary" 
                          size="small"
                          sx={{ mr: 1 }}
                        />
                        {restaurant.email}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Button
                variant="outlined"
                startIcon={refreshLoading ? <CircularProgress size={16} /> : <IconRefresh />}
                onClick={handleRefresh}
                disabled={refreshLoading}
              >
                {refreshLoading ? 'Đang cập nhật...' : 'Cập nhật dữ liệu'}
              </Button>
            </Box>
          </CardContent>
        </Card>

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
                      {currentRevenue?.totalOrders || currentStats?.totalOrders || dashboard?.totalOrders || 0}
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
                      {formatCurrency(currentRevenue?.totalRevenue || currentStats?.totalRevenue || totalRevenue?.totalRevenue || 0)}
                    </Typography>
                  </Box>
                  <IconTrendingUp size={40} color="#4caf50" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          {!isShowingAllRestaurants && currentRevenue?.todayRevenue !== undefined && (
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography color="textSecondary" gutterBottom variant="h6">
                        Doanh thu hôm nay
                      </Typography>
                      <Typography variant="h4" fontWeight="bold" color="info.main">
                        {formatCurrency(currentRevenue.todayRevenue)}
                      </Typography>
                    </Box>
                    <IconTrendingUp size={40} color="#2196f3" />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="h6">
                      {isShowingAllRestaurants ? 'Người dùng' : 'Top sản phẩm'}
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {isShowingAllRestaurants 
                        ? (dashboard?.totalUsers || 0)
                        : (currentRevenue?.topProducts?.length || 0)
                      }
                    </Typography>
                  </Box>
                  {isShowingAllRestaurants ? (
                    <IconUsers size={40} color="#ff9800" />
                  ) : (
                    <IconPackage size={40} color="#ff9800" />
                  )}
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
                      {isShowingAllRestaurants ? 'Nhà hàng' : 'Ngày có dữ liệu'}
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {isShowingAllRestaurants 
                        ? (dashboard?.totalAdmins || 0)
                        : (currentRevenue?.revenueByDate ? Object.keys(currentRevenue.revenueByDate).length : 0)
                      }
                    </Typography>
                  </Box>
                  {isShowingAllRestaurants ? (
                    <IconBuilding size={40} color="#ffc107" />
                  ) : (
                    <IconTrendingUp size={40} color="#ffc107" />
                  )}
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
                      {isShowingAllRestaurants ? 'Tổng 10% hệ thống' : '10% doanh thu'}
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="warning.main">
                      {isShowingAllRestaurants 
                        ? formatCurrency(calculateTenPercent(allRestaurantsRevenue?.totalRevenue))
                        : formatCurrency(calculateTenPercent(currentRevenue?.totalRevenue))
                      }
                    </Typography>
                  </Box>
                  <IconPercentage size={40} color="#ff9800" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {/* Line Chart: Doanh thu theo nhà hàng (chỉ hiển thị khi xem tổng hợp) */}
          {isShowingAllRestaurants && (
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Doanh thu theo nhà hàng
                  </Typography>
                  <ResponsiveContainer width="100%" height={320}>
                    <LineChart data={revenueLineData.length > 0 ? revenueLineData : fallbackRevenueData}>
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
          )}
          {/* Line Chart: Doanh thu theo ngày */}
          <Grid item xs={12} md={isShowingAllRestaurants ? 6 : 12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Doanh thu theo ngày
                </Typography>
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={revenueByDateData.length > 0 ? revenueByDateData : fallbackRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip formatter={formatCurrency} />
                    <Line type="monotone" dataKey="revenue" stroke="#ff9800" strokeWidth={2} name="Doanh thu" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Bar Chart và Pie Chart */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {/* Bar Chart: Top sản phẩm bán chạy nhất */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Top sản phẩm bán chạy nhất (theo số lượng)
                </Typography>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={barChartData.length > 0 ? barChartData : fallbackBarData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={120} />
                    <RechartsTooltip 
                      formatter={(value, name) => [
                        `${value} sản phẩm`, 
                        'Số lượng bán'
                      ]}
                    />
                    <Bar dataKey="quantity">
                      {(barChartData.length > 0 ? barChartData : fallbackBarData).map((entry, idx) => (
                        <Cell key={`cell-bar-${idx}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          {/* Pie Chart: Tỉ lệ trạng thái đơn hàng */}
          {/* <Grid item xs={12} md={6}>
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
          </Grid> */}
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Statistics; 