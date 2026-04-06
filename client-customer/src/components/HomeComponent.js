import React, { Component } from 'react';
import axios from 'axios';
import MyContext from '../contexts/MyContext';

class Home extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      totalProducts:  0,
      totalOrders:    0,
      totalCustomers: 0,
      totalRevenue:   0,
      recentOrders:   [],
    };
  }

  render() {
    const recentOrders = this.state.recentOrders.slice(0, 5).map((item) => {
      return (
        <tr key={item._id} className="datatable" style={{ borderBottom: '1px solid #eee' }}>
          <td style={{ fontSize: '11px', color: '#888' }}>{item._id}</td>
          <td>{new Date(item.cdate).toLocaleString('vi-VN')}</td>
          <td style={{ fontWeight: 'bold' }}>{item.customer?.name || '---'}</td>
          <td>{item.customer?.phone || '---'}</td>
          <td style={{ color: '#d9534f', fontWeight: 'bold' }}>
            {item.total.toLocaleString('vi-VN')} VNĐ
          </td>
          <td>
            <span style={{
              padding: '3px 10px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: 'bold',
              background:
                item.status === 'APPROVED' ? '#2ecc71' :
                item.status === 'CANCELED' ? '#e74c3c' : '#f39c12',
              color: 'white'
            }}>
              {item.status === 'APPROVED' ? '✅ ĐÃ DUYỆT' :
               item.status === 'CANCELED' ? '❌ ĐÃ HỦY'  : '⏳ CHỜ DUYỆT'}
            </span>
          </td>
        </tr>
      );
    });

    return (
      <div style={{ 
        padding: '30px', 
        minHeight: '100vh',
        // ===== THÊM BACKGROUND SHOWROOM =====
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        // Bạn hãy tìm một ảnh showroom xe máy đẹp rồi thay link vào đây nhé
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), url('https://w0.peakpx.com/wallpaper/445/263/wallpaper-ducati-superbike-ducati-v4s-motocross-motorcycle.jpg')`
      }}>

        {/* ===== BANNER CHÍNH ===== */}
        <div style={{
          background: 'linear-gradient(135deg, #2c3e50, #000000)',
          color: 'white',
          padding: '30px',
          borderRadius: '12px',
          marginBottom: '30px',
          textAlign: 'center',
          boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
        }}>
          <h1 style={{ margin: 0, letterSpacing: '4px', fontSize: '36px', textTransform: 'uppercase' }}>🏍️ MOTOSHOP</h1>
          <p style={{ margin: '8px 0 0', opacity: 0.9, fontSize: '16px' }}>
            Hệ thống quản lý Showroom — Chào mừng, <b>{this.context.username}</b>!
          </p>
        </div>

        {/* ===== THỐNG KÊ TỔNG QUAN ===== */}
        <h3 style={{ color: '#333', marginBottom: '16px', textTransform: 'uppercase', fontSize: '18px' }}>
            📈 Thống kê tổng quan
        </h3>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '40px' }}>

          {/* Tổng xe (Sử dụng Red) */}
          <div style={this.statCardStyle('#d9534f', '#fdf7f7')}>
            <p style={{ fontSize: '40px', margin: 0 }}>🛵</p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0', color: '#333' }}>
              {this.state.totalProducts}
            </p>
            <p style={{ margin: 0, color: '#777', fontWeight: '600', fontSize: '13px' }}>TỔNG SỐ XE</p>
          </div>

          {/* Tổng đơn hàng (Sử dụng Red) */}
          <div style={this.statCardStyle('#d9534f', '#fdf7f7')}>
            <p style={{ fontSize: '40px', margin: 0 }}>📦</p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0', color: '#333' }}>
              {this.state.totalOrders}
            </p>
            <p style={{ margin: 0, color: '#777', fontWeight: '600', fontSize: '13px' }}>ĐƠN HÀNG MỚI</p>
          </div>

          {/* Tổng doanh thu (Sử dụng Black) */}
          <div style={this.statCardStyle('#2c3e50', '#f8f9fa')}>
            <p style={{ fontSize: '40px', margin: 0 }}>💰</p>
            <p style={{ fontSize: '22px', fontWeight: 'bold', margin: '18px 0', color: '#d9534f' }}>
              {this.state.totalRevenue.toLocaleString('vi-VN')}
            </p>
            <p style={{ margin: 0, color: '#777', fontWeight: '600', fontSize: '13px' }}>DOANH THU (VNĐ)</p>
          </div>

        </div>

        {/* ===== ĐƠN HÀNG GẦN ĐÂY ===== */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.9)', // Nền trắng mờ để nổi bật bảng
          padding: '25px', 
          borderRadius: '12px', 
          boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
          backdropFilter: 'blur(5px)' // Hiệu ứng mờ nền showroom
        }}>
          <h3 style={{ color: '#333', marginBottom: '25px', borderLeft: '5px solid #d9534f', paddingLeft: '15px', textTransform: 'uppercase', fontSize: '18px' }}>
            🕐 GIAO DỊCH GẦN ĐÂY
          </h3>
          {this.state.recentOrders.length > 0 ? (
            <table className="datatable" border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <tr className="datatable" style={{ background: '#f8f9fa' }}>
                  <th>Mã đơn</th>
                  <th>Thời gian</th>
                  <th>Khách hàng</th>
                  <th>SĐT</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                </tr>
                {recentOrders}
              </tbody>
            </table>
          ) : (
            <div style={{ textAlign: 'center', padding: '30px', color: '#aaa' }}>
               Hiện chưa có phát sinh giao dịch mới.
            </div>
          )}
        </div>

        {/* ===== HƯỚNG DẪN NHANH ===== */}
        <div style={{
          marginTop: '40px',
          padding: '20px',
          background: 'rgba(217, 83, 79, 0.05)',
          borderRadius: '10px',
          border: '1px solid rgba(217, 83, 79, 0.2)',
          color: '#333'
        }}>
          <h4 style={{ margin: '0 0 12px', color: '#d9534f' }}>💡 Mẹo quản lý nhanh:</h4>
          <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '2', fontSize: '14px' }}>
            <li><b>Menu Sản phẩm:</b> Nơi bạn đăng các mẫu xe mới, cập nhật giá và phân khối (cc).</li>
            <li><b>Menu Danh mục:</b> Phân loại xe theo dòng (Xe ga, Xe số, Moto PKL).</li>
            <li><b>Menu Đơn hàng:</b> Kiểm tra và xác nhận khi có khách hàng đặt xe trực tuyến.</li>
          </ul>
        </div>

      </div>
    );
  }

  // Style chung cho các thẻ thống kê
  statCardStyle = (borderColor, bgColor) => ({
    flex: 1, minWidth: '220px', 
    background: bgColor, 
    padding: '25px', 
    borderRadius: '12px', 
    textAlign: 'center',
    borderBottom: `5px solid ${borderColor}`, 
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
  });

  componentDidMount() {
    this.apiGetStats();
  }

  // ================= APIs =================
  apiGetStats() {
    const config = { headers: { 'x-access-token': this.context.token } };

    // Lấy danh sách sản phẩm (để tính tổng số xe)
    axios.get('/api/admin/products?page=1', config).then((res) => {
      const total = (res.data.noPages || 0) * 4; 
      this.setState({ totalProducts: total });
    }).catch(err => console.log(err));

    // Lấy đơn hàng → tính tổng đơn + doanh thu + đơn gần đây
    axios.get('/api/admin/orders', config).then((res) => {
      const orders = res.data || [];
      const revenue = orders
        .filter(o => o.status === 'APPROVED')
        .reduce((sum, o) => sum + o.total, 0);

      this.setState({
        totalOrders:  orders.length,
        totalRevenue: revenue,
        recentOrders: orders.slice(0, 5),
      });
    }).catch(err => console.log(err));

    // Lấy tổng khách hàng
    axios.get('/api/admin/customers', config).then((res) => {
      this.setState({ totalCustomers: (res.data || []).length });
    }).catch(err => console.log(err));
  }
}

export default Home;