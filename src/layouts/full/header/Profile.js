import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Menu,
  Button,
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider
} from '@mui/material';

import { IconListCheck, IconMail, IconUser, IconLogout, IconPhone } from '@tabler/icons-react';
import { useAuth } from 'src/contexts/AuthContext.js';

import ProfileImg from 'src/assets/images/profile/user-1.jpg';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl2, setAnchorEl2] = useState(null);
  
  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
    handleClose2();
  };

  // Helper function to get avatar URL with fallback
  const getAvatarUrl = (user) => {
    if (!user?.avatar_url) return ProfileImg;
    
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
    <Box>
      <IconButton
        size="large"
        aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === 'object' && {
            color: 'primary.main',
          }),
        }}
        onClick={handleClick2}
      >
        <Avatar
          src={getAvatarUrl(user)}
          alt={user?.name || 'User'}
          sx={{
            width: 35,
            height: 35,
          }}
          onError={(e) => {
            e.target.src = ProfileImg;
          }}
        />
      </IconButton>
      {/* ------------------------------------------- */}
      {/* Message Dropdown */}
      {/* ------------------------------------------- */}
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{
          '& .MuiMenu-paper': {
            width: '280px',
          },
        }}
      >
        {user && (
          <MenuItem>
            <ListItemIcon>
              <IconUser width={20} />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight="600">
                {user.name}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {user.email}
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
        
        {user && user.phone && (
          <MenuItem>
            <ListItemIcon>
              <IconPhone width={20} />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2">
                {user.phone}
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
        
        {user && <Divider />}
        
        <MenuItem>
          <ListItemIcon>
            <IconMail width={20} />
          </ListItemIcon>
          <ListItemText>My Account</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <IconListCheck width={20} />
          </ListItemIcon>
          <ListItemText>My Tasks</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <IconLogout width={20} />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Profile;
