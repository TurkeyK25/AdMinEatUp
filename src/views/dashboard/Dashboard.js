import React, { useState, useEffect } from 'react';
import { Grid, Box, CircularProgress, Alert } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import { dashboardService } from 'src/services/dashboardService.js';
import { mockDashboardService } from 'src/services/mockDashboardService.js';

// components
import SalesOverview from './components/SalesOverview';
import YearlyBreakup from './components/YearlyBreakup';
import RecentTransactions from './components/RecentTransactions';
import ProductPerformance from './components/ProductPerformance';
import Blog from './components/Blog';
import MonthlyEarnings from './components/MonthlyEarnings';

// New components
import OrderStats from './components/OrderStats';
import UserStats from './components/UserStats';
import ProductStats from './components/ProductStats';
import ReviewStats from './components/ReviewStats';
import VoucherStats from './components/VoucherStats';
import RecentOrders from './components/RecentOrders';
import RestaurantList from './components/RestaurantList';
import RestaurantStats from './components/RestaurantStats';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState({
    orders: [],
    users: [],
    products: [],
    reviews: [],
    vouchers: []
  });
  const [admins, setAdmins] = useState([]);

  // Chọn service để sử dụng (real API hoặc mock)
  const dashboardServiceToUse = dashboardService; // Thay đổi thành dashboardService để dùng real API

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch all data in parallel
        const [orders, users, products, reviews, vouchers, admins] = await Promise.all([
          dashboardServiceToUse.getOrders(),
          dashboardServiceToUse.getUsers(),
          dashboardServiceToUse.getProducts(),
          dashboardServiceToUse.getReviews(),
          dashboardServiceToUse.getVouchers(),
          dashboardServiceToUse.getAdmins()
        ]);

        setDashboardData({
          orders: orders || [],
          users: users || [],
          products: products || [],
          reviews: reviews || [],
          vouchers: vouchers || []
        });
        setAdmins(admins || []);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Không thể tải dữ liệu dashboard. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [dashboardServiceToUse]);

  // Calculate stats
  const orderStats = dashboardServiceToUse.getOrderStats(dashboardData.orders);
  const userStats = dashboardServiceToUse.getUserStats(dashboardData.users);
  const productStats = dashboardServiceToUse.getProductStats(dashboardData.products);
  const reviewStats = dashboardServiceToUse.getReviewStats(dashboardData.reviews);
  const voucherStats = dashboardServiceToUse.getVoucherStats(dashboardData.vouchers);

  // Tính toán thống kê nhà hàng
  const restaurantStats = React.useMemo(() => {
    if (!admins || admins.length === 0) return {
      total: 0, active: 0, blocked: 0, avgRating: 0, totalReviews: 0
    };
    const total = admins.length;
    const blocked = admins.filter(a => a.block).length;
    const active = total - blocked;
    const totalReviews = admins.reduce((sum, a) => sum + (a.num_reviews || 0), 0);
    const avgRating = admins.length > 0 ? (admins.reduce((sum, a) => sum + (a.rating || 0), 0) / total).toFixed(2) : 0;
    return { total, active, blocked, avgRating, totalReviews };
  }, [admins]);

  if (loading) {
    return (
      <PageContainer title="Dashboard" description="this is Dashboard">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="Dashboard" description="this is Dashboard">
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        <Grid container spacing={3}>
          {/* Stats Cards */}
          <Grid item xs={12}>
            <OrderStats orderStats={orderStats} />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <UserStats userStats={userStats} />
          </Grid>
          <Grid item xs={12} md={6}>
            <RestaurantStats restaurantStats={restaurantStats} />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <ProductStats productStats={productStats} />
          </Grid>

          <Grid item xs={12} md={6}>
            <ReviewStats reviewStats={reviewStats} />
          </Grid>

          <Grid item xs={12} md={6}>
            <VoucherStats voucherStats={voucherStats} />
          </Grid>

          {/* Recent Orders */}
          <Grid item xs={12} lg={6}>
            <RecentOrders orders={dashboardData.orders} />
          </Grid>
          {/* Restaurant List */}
          {/* <Grid item xs={12} lg={6}>
            <RestaurantList admins={admins} />
          </Grid> */}

          {/* Original Components */}
          {/* <Grid item xs={12} lg={6}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <YearlyBreakup />
              </Grid>
              <Grid item xs={12}>
                <MonthlyEarnings />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} lg={8}>
            <SalesOverview />
          </Grid>
          
          <Grid item xs={12} lg={4}>
            <RecentTransactions />
          </Grid>
          
          <Grid item xs={12} lg={8}>
            <ProductPerformance />
          </Grid>
          
          <Grid item xs={12}>
            <Blog />
          </Grid> */}
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
