export const mockSettingsService = {
  // Gửi email đổi mật khẩu
  sendPasswordResetEmail: async (email) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation
    if (!email || !email.includes('@')) {
      throw new Error('Email không hợp lệ');
    }
    
    return {
      message: 'Email đặt lại mật khẩu đã được gửi thành công',
      success: true
    };
  },

  // Đổi mật khẩu với token
  resetPassword: async (token, newPassword) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (!token) {
      throw new Error('Token không hợp lệ');
    }
    
    if (!newPassword || newPassword.length < 6) {
      throw new Error('Mật khẩu phải có ít nhất 6 ký tự');
    }
    
    return {
      message: 'Mật khẩu đã được đặt lại thành công',
      success: true
    };
  },

  // Cập nhật thông tin cá nhân
  updateProfile: async (profileData) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    if (!profileData.name || profileData.name.trim() === '') {
      throw new Error('Tên không được để trống');
    }
    
    return {
      message: 'Thông tin cá nhân đã được cập nhật thành công',
      success: true,
      user: {
        ...profileData,
        updatedAt: new Date().toISOString()
      }
    };
  },

  // Đổi mật khẩu khi đã đăng nhập
  changePassword: async (currentPassword, newPassword) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (!currentPassword) {
      throw new Error('Mật khẩu hiện tại không được để trống');
    }
    
    if (!newPassword || newPassword.length < 6) {
      throw new Error('Mật khẩu mới phải có ít nhất 6 ký tự');
    }
    
    if (currentPassword === newPassword) {
      throw new Error('Mật khẩu mới không được trùng với mật khẩu hiện tại');
    }
    
    return {
      message: 'Mật khẩu đã được thay đổi thành công',
      success: true
    };
  },

  // Validate email
  validateEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate password
  validatePassword: (password) => {
    // Ít nhất 6 ký tự, có chữ hoa, chữ thường và số
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/;
    return passwordRegex.test(password);
  },

  // Validate password strength
  getPasswordStrength: (password) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;
    
    if (strength < 2) return { level: 'weak', color: 'error', text: 'Yếu' };
    if (strength < 4) return { level: 'medium', color: 'warning', text: 'Trung bình' };
    return { level: 'strong', color: 'success', text: 'Mạnh' };
  }
};

export default mockSettingsService; 