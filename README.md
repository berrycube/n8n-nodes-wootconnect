# n8n-suite

企业级n8n插件套件 - 包含OAuth2增强、Evolution API诊断和Chatwoot集成

## 🚀 快速开始

### 项目结构
```
n8n-suite/
├── public/                    # 开源插件
│   ├── n8n-nodes-oauth2-enhanced/
│   ├── n8n-nodes-evoguard/
│   └── n8n-nodes-wootconnect/
├── private/                   # 私有集成和商业插件
│   ├── n8n-suite-integration/
│   └── n8n-pro-extensions/
└── docs/                     # 文档中心
    ├── quality/              # 质量保证文档
    ├── contributing/         # 贡献指南
    └── adr/                 # 架构决策记录
```

### 核心功能

#### 🔐 OAuth2Enhanced
- 智能HTTP请求处理
- OAuth2令牌自动刷新
- 指数退避重试机制
- 企业级错误处理

#### 🛡️ EvoGuard  
- Evolution API健康检查
- WhatsApp实例状态监控
- Webhook连接验证
- QR码状态检查

#### 💬 WootConnect
- Chatwoot API完整集成
- 联系人和对话管理
- 消息发送和接收
- 标签和团队管理

## 📚 文档

完整文档请查看 [`docs/`](docs/) 目录：

- **[文档中心](docs/README.md)** - 所有文档的入口
- **[质量保证](docs/quality/)** - 测试质量和改进文档
- **[贡献指南](docs/contributing/CONTRIBUTING.md)** - 开发贡献指南
- **[API文档](docs/API.md)** - 完整API参考

## 🎯 质量标准

本项目达到**企业级质量标准 (8.8/10)**：
- ✅ **零虚假通过测试** - 所有测试验证真实业务逻辑
- ✅ **Docker集成验证** - 插件在真实n8n环境中工作
- ✅ **真实业务逻辑覆盖 95%+** - 核心功能完整验证
- ✅ **架构师级质量保证** - 防虚假通过机制

## 🚀 快速部署

### 开发环境
```bash
# 克隆项目
git clone https://github.com/berrycube/n8n-suite.git
cd n8n-suite

# 启动集成测试环境  
cd private/n8n-suite-integration/compose
docker compose up -d

# 验证插件加载
curl http://localhost:5678
```

### 生产部署
详见 [Docker集成文档](docs/quality/DOCKER-INTEGRATION-FIXES.md)

## 🤝 贡献

欢迎贡献！请阅读 [贡献指南](docs/contributing/CONTRIBUTING.md) 了解详情。

## 📄 许可证

MIT License - 详见各插件目录中的 LICENSE 文件

---

**维护团队**: BerryConnect Labs  
**更新时间**: 2025-09-04
