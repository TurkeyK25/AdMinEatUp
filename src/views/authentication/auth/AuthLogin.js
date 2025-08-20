import React, { useState } from 'react';
import {
    Box,
    Typography,
    FormGroup,
    FormControlLabel,
    Button,
    Stack,
    Checkbox,
    Alert,
    CircularProgress
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from 'src/contexts/AuthContext.js';

import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';

const AuthLogin = ({ title, subtitle, subtext }) => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password_hash: '',
        role: 'Owner' // Thay đổi role mặc định thành Owner
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Gọi API đăng nhập thông qua AuthContext
            const response = await login(formData);
            
            // Hiển thị thông báo thành công nếu có
            if (response.message) {
                console.log('Login success:', response.message);
            }
            
            // Chuyển hướng đến dashboard
            navigate('/dashboard');
            
        } catch (error) {
            console.error('Login error:', error);
            
            // Xử lý các loại lỗi khác nhau
            if (error.code === 'ERR_NETWORK') {
                setError('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
            } else if (error.response?.status === 401) {
                setError('Email hoặc mật khẩu không đúng.');
            } else if (error.response?.status === 500) {
                setError('Lỗi server. Vui lòng thử lại sau.');
            } else if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else if (error.message) {
                setError(error.message);
            } else {
                setError('Đăng nhập thất bại. Vui lòng thử lại.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {title ? (
                <Typography fontWeight="700" variant="h2" mb={1}>
                    {title}
                </Typography>
            ) : null}

            {subtext}

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Stack>
                <Box>
                    <Typography variant="subtitle1"
                        fontWeight={600} component="label" htmlFor='email' mb="5px">Email</Typography>
                    <CustomTextField 
                        id="email" 
                        variant="outlined" 
                        fullWidth 
                        value={formData.email}
                        onChange={handleInputChange}
                        type="email"
                        required
                    />
                </Box>
                <Box mt="25px">
                    <Typography variant="subtitle1"
                        fontWeight={600} component="label" htmlFor='password_hash' mb="5px" >Password</Typography>
                    <CustomTextField 
                        id="password_hash" 
                        type="password" 
                        variant="outlined" 
                        fullWidth 
                        value={formData.password_hash}
                        onChange={handleInputChange}
                        required
                    />
                </Box>
                <Stack justifyContent="space-between" direction="row" alignItems="center" my={2}>
                    <FormGroup>
                        <FormControlLabel
                            control={<Checkbox defaultChecked />}
                            label="Remember this Device"
                        />
                    </FormGroup>
                   
                </Stack>
            </Stack>
            <Box>
                <Button
                    color="primary"
                    variant="contained"
                    size="large"
                    fullWidth
                    type="submit"
                    disabled={loading}
                    sx={{ position: 'relative' }}
                >
                    {loading ? (
                        <>
                            <CircularProgress size={20} sx={{ color: 'white', mr: 1 }} />
                            Đang đăng nhập...
                        </>
                    ) : (
                        'Sign In'
                    )}
                </Button>
            </Box>
            {subtitle}
        </form>
    );
};

export default AuthLogin;
