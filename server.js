const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const { ProductModel } = require('./eatUpModel'); // dùng đúng model bạn đã có
const COMMON = require('./COMMON');

const app = express();
const port = 8080; // có thể dùng cổng khác backend mobile nếu cần

// Để server đọc được file tĩnh như CSS, JS
app.use(express.static(path.join(__dirname, 'public')));

// Route hiển thị HTML dashboard
app.get('/admin/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'Dashboard.html'));
});

// Route trả dữ liệu sản phẩm
app.get('/admin/api/products', async (req, res) => {
    await mongoose.connect(COMMON.uri);
    const products = await ProductModel.find();
    res.json(products.map(p => ({
        name: p.name,
        price: p.price,
        quantity: p.stock || p.quantity || 0,
        category: p.category || "Uncategorized",
        status: p.status,
        createdAt: p.createdAt
    })));
});

app.listen(port, () => {
    console.log(`Admin dashboard chạy tại http://localhost:${port}/admin/dashboard`);
});
