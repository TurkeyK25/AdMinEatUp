import React from 'react';
import { useAuth } from 'src/contexts/AuthContext.js';
import { Box, Typography, Button, Alert, Chip, Avatar } from '@mui/material';

const TestLogin = () => {
  const { login, logout, isAuthenticated, user } = useAuth();

  const handleTestLogin = async () => {
    try {
      await login({
        email: 'minh05@gmail.com',
        password_hash: 'minh05@',
        role: 'Owner'
      });
      console.log('Login successful!');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleTestLogout = () => {
    logout();
    console.log('Logout successful!');
  };

  // Helper function to get avatar URL with fallback
  const getAvatarUrl = (user) => {
    if (!user?.avatar_url) return null;
    
    // If avatar_url already has full URL, use it
    if (user.avatar_url.startsWith('http://localhost:3000/uploads/')) {
      return user.avatar_url;
    }
    
    // If it's just a filename, construct the full URL
    if (user.avatar_url.startsWith('uploads/')) {
      return `http://localhost:3000/${user.avatar_url}`;
    }
    
    // If it's just a filename without uploads/, add it
    return `http://localhost:3000/uploads/${user.avatar_url}`;
  };

  return (
    <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 2, m: 2 }}>
      <Typography variant="h6" gutterBottom>
        Test Login Component
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="body2">
            Authentication Status: 
          </Typography>
          <Chip 
            label={isAuthenticated ? 'Logged In' : 'Not Logged In'} 
            color={isAuthenticated ? 'success' : 'default'}
            size="small"
            sx={{ ml: 1 }}
          />
        </Box>
        
        {user && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar 
                src={getAvatarUrl(user)} 
                sx={{ width: 40, height: 40, mr: 2 }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <Box>
                <Typography variant="subtitle2" fontWeight="600">
                  {user.name}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {user.email}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              <Chip label={`Role: ${user.role}`} size="small" color="primary" />
              {user.phone && <Chip label={`Phone: ${user.phone}`} size="small" />}
              {user.gender && <Chip label={`Gender: ${user.gender}`} size="small" />}
              {user.rating && <Chip label={`Rating: ${user.rating}`} size="small" color="success" />}
            </Box>
          </Box>
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button 
          variant="contained" 
          onClick={handleTestLogin}
          disabled={isAuthenticated}
        >
          Test Login (Luong Hong Minh)
        </Button>
        <Button 
          variant="outlined" 
          onClick={handleTestLogout}
          disabled={!isAuthenticated}
        >
          Test Logout
        </Button>
      </Box>

      {isAuthenticated && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Đăng nhập thành công! User đã được xác thực với role Owner.
        </Alert>
      )}
    </Box>
  );
};

export default TestLogin; 