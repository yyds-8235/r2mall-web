import React from 'react';
import './Footer.css';
import '@/assets/font/iconfont.css'

const Footer: React.FC = () => {
  return (
    <footer className="app_footer">
      {/* 联系我们 */}
      <div className="contact">
        <div className="container">
          <dl>
            <dt>客户服务</dt>
            <dd><i className="iconfont icon-kefu"></i> 在线客服</dd>
            <dd><i className="iconfont icon-wentifankui"></i> 问题反馈</dd>
          </dl>
          <dl>
            <dt>关注我们</dt>
            <dd><i className="iconfont icon-gongzhonghao"></i> 公众号</dd>
            <dd><i className="iconfont icon-weibo"></i> 微博</dd>
          </dl>
          <dl>
            <dt>乡村振兴</dt>
            <dd className="hotline">全面振兴 <small>农业科技 乡风文明</small></dd>
          </dl>
          <dl>
            <dt>服务热线</dt>
            <dd className="hotline">400-0000-000 <small>周一至周日 8:00-18:00</small></dd>
          </dl>
        </div>
      </div>
      {/* 其它 */}
      <div className="extra">
        <div className="container">
          <div className="slogan">
            <a href="javascript:;">
              <i className="iconfont icon-item-price"></i>
              <span>价格亲民</span>
            </a>
            <a href="javascript:;">
              <i className="iconfont icon-wuliu_kuaidi"></i>
              <span>物流快捷</span>
            </a>
            <a href="javascript:;">
              <i className="iconfont icon-xinxian"></i>
              <span>品质新鲜</span>
            </a>
          </div>
          {/* 版权信息 */}
          <div className="copyright">
            <p>
              <a href="javascript:;">关于我们</a>
              <a href="javascript:;">帮助中心</a>
              <a href="javascript:;">售后服务</a>
              <a href="javascript:;">配送与验收</a>
              <a href="javascript:;">商务合作</a>
              <a href="javascript:;">搜索推荐</a>
              <a href="javascript:;">友情链接</a>
            </p>
            <p>CopyRight © 乡村振兴电商云平台</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;