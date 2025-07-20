<template>
  <div class="footer">
    <div class="footer-main">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3>关于我们</h3>
            <ul>
              <li><a href="#">公司介绍</a></li>
              <li><a href="#">联系我们</a></li>
              <li><a href="#">加入我们</a></li>
              <li><a href="#">合作伙伴</a></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h3>帮助中心</h3>
            <ul>
              <li><a href="#">购票指南</a></li>
              <li><a href="#">退换票政策</a></li>
              <li><a href="#">常见问题</a></li>
              <li><a href="#">用户协议</a></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h3>商务合作</h3>
            <ul>
              <li><a href="#">演出合作</a></li>
              <li><a href="#">场馆合作</a></li>
              <li><a href="#">广告合作</a></li>
              <li><a href="#">渠道合作</a></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h3>关注我们</h3>
            <div class="social-links">
              <a href="#" class="social-link">
                <i class="el-icon-chat-dot-round"></i>
                微信
              </a>
              <a href="#" class="social-link">
                <i class="el-icon-message"></i>
                微博
              </a>
              <a href="#" class="social-link">
                <i class="el-icon-video-camera"></i>
                抖音
              </a>
            </div>
            <div class="qr-code">
              <img src="@/assets/qr-code.png" alt="二维码" />
              <p>扫码关注公众号</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="footer-bottom">
      <div class="container">
        <div class="footer-bottom-content">
          <div class="copyright">
            <p>&copy; 2024 演出购票系统. All rights reserved.</p>
            <p>京ICP备12345678号-1 | 京公网安备11010502030123号</p>
          </div>
          <div class="footer-links">
            <a href="#">隐私政策</a>
            <a href="#">服务条款</a>
            <a href="#">网站地图</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style lang="scss" scoped>
.footer {
  background: #2c3e50;
  color: #fff;
  margin-top: 60px;
}

.footer-main {
  padding: 40px 0;
  
  .footer-content {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 40px;
  }
  
  .footer-section {
    h3 {
      font-size: $font-size-large;
      margin-bottom: 20px;
      color: #fff;
      font-weight: 600;
    }
    
    ul {
      list-style: none;
      padding: 0;
      
      li {
        margin-bottom: 10px;
        
        a {
          color: #bdc3c7;
          text-decoration: none;
          font-size: $font-size-base;
          transition: $transition-base;
          
          &:hover {
            color: $primary-color;
          }
        }
      }
    }
    
    .social-links {
      display: flex;
      gap: 15px;
      margin-bottom: 20px;
      
      .social-link {
        display: flex;
        align-items: center;
        color: #bdc3c7;
        text-decoration: none;
        font-size: $font-size-base;
        transition: $transition-base;
        
        i {
          margin-right: 5px;
          font-size: 16px;
        }
        
        &:hover {
          color: $primary-color;
        }
      }
    }
    
    .qr-code {
      text-align: center;
      
      img {
        width: 80px;
        height: 80px;
        margin-bottom: 10px;
        border-radius: $border-radius-base;
      }
      
      p {
        font-size: $font-size-small;
        color: #bdc3c7;
        margin: 0;
      }
    }
  }
}

.footer-bottom {
  background: #1a252f;
  padding: 20px 0;
  border-top: 1px solid #34495e;
  
  .footer-bottom-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .copyright {
      p {
        margin: 0;
        font-size: $font-size-small;
        color: #95a5a6;
        line-height: 1.6;
      }
    }
    
    .footer-links {
      display: flex;
      gap: 20px;
      
      a {
        color: #95a5a6;
        text-decoration: none;
        font-size: $font-size-small;
        transition: $transition-base;
        
        &:hover {
          color: $primary-color;
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .footer-main {
    .footer-content {
      grid-template-columns: repeat(2, 1fr);
      gap: 30px;
    }
  }
  
  .footer-bottom {
    .footer-bottom-content {
      flex-direction: column;
      gap: 15px;
      text-align: center;
    }
  }
}

@media (max-width: 480px) {
  .footer-main {
    .footer-content {
      grid-template-columns: 1fr;
      gap: 30px;
    }
  }
}
</style> 