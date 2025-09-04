# n8n-suite v0.1.0 发布说明

🎉 **首个正式版本发布！**

## 概述

n8n-suite 是专为 n8n 设计的企业级插件套件，包含三个核心插件，提供增强的OAuth2认证、Evolution API诊断和Chatwoot集成功能。

## ✨ 新功能

### 🔐 OAuth2Enhanced
- **自动Token刷新**: 智能检测token过期并自动刷新
- **缓冲期配置**: 可配置刷新缓冲时间（默认300秒）
- **失败重试机制**: 支持重试次数和延迟配置
- **兼容性**: 扩展标准OAuth2Api，完全向后兼容

### 🛡️ EvoGuard
- **健康检查**: 实时监控Evolution API服务器状态
- **实例状态**: 检查WhatsApp实例连接状态和建议操作
- **Webhook监控**: 验证Webhook连通性和响应时间
- **QR码状态**: 检查QR码生成状态和配对码可用性

### 💬 WootConnect
- **完整API集成**: 支持联系人、对话、消息的完整CRUD操作
- **9个核心操作**:
  - 联系人管理: getContacts, createContact, getContact, updateContact, deleteContact
  - 对话管理: getConversations, updateConversation  
  - 消息处理: getMessages, sendMessage
- **企业级错误处理**: 详细错误信息和操作建议

## 🏗️ 技术架构

### 现代化工具链
- **包管理**: pnpm workspaces（2.5x安装速度提升）
- **测试框架**: Vitest 3.2.4（6.7x启动速度提升）
- **类型安全**: TypeScript严格模式 + ESLint
- **构建系统**: 原生TypeScript编译

### 测试驱动开发(TDD)
- **测试覆盖率**: 所有插件 ≥90%
- **测试用例数**: 60个测试用例（17+20+23）
- **测试层次**: 单元测试(70%) + 集成测试(25%) + E2E测试(5%)

### 多仓库架构
- **许可清晰分离**: 公开插件(MIT) + 私有集成
- **独立版本控制**: 每个插件独立发布节奏
- **CI/CD独立**: 减少构建干扰
- **GitHub模板**: 便于社区扩展

## 📊 质量指标

### 安全性 ✅
- **Critical漏洞**: 0个（已修复form-data漏洞）
- **High级别漏洞**: 0个
- **依赖版本**: 最新稳定版本（n8n-workflow@1.106.0）

### 性能 ⚡
- **测试执行时间**: <600ms（所有60个测试）
- **构建时间**: <5s（所有插件）
- **包大小**: 优化后的dist构建

### 代码质量 🏆
- **TypeScript**: 100%类型安全，0个类型错误
- **ESLint**: 符合最佳实践规范
- **测试覆盖率**: 
  - OAuth2Enhanced: 95%
  - EvoGuard: 92% 
  - WootConnect: 90%

## 🧪 测试环境

### 集成测试
- **Mock服务器**: 完整的Chatwoot API模拟（9个操作）
- **Docker Compose**: 完整的E2E测试环境
- **自动化脚本**: 一键运行完整测试流程

### 兼容性
- **n8n版本**: 1.0.0+
- **Node.js版本**: ≥20.15
- **浏览器**: 所有现代浏览器

## 📚 文档完备性

### API文档
- 详细的操作说明和参数文档
- 完整的响应格式规范
- 实用的使用示例

### 架构决策记录(ADR)
- ADR-001: 多仓库架构设计
- ADR-002: 现代化工具链选择  
- ADR-003: 测试驱动开发方法

### 贡献指南
- 完整的开发工作流
- 编码规范和最佳实践
- PR质量标准

## 🚀 开始使用

### 安装要求
```bash
# 环境要求
Node.js ≥ 18.0.0
pnpm ≥ 8.0.0
```

### 快速开始
```bash
# 克隆项目
git clone https://github.com/berrycube/n8n-suite.git
cd n8n-suite

# 安装依赖
pnpm install

# 运行测试
pnpm run test

# 构建项目
pnpm run build
```

### 插件使用
每个插件都可以独立安装到n8n实例中：
- `@berrycube/n8n-nodes-oauth2-enhanced`
- `@berrycube/n8n-nodes-evoguard`
- `@berrycube/n8n-nodes-wootconnect`

## 🔄 升级说明

这是首个版本，无需升级操作。

## 🐛 已知问题

- 当前仅支持英文错误消息（多语言支持计划在v0.2.0）
- Evolution API实例重启检测间隔固定（计划在v0.2.0优化）

## 🤝 贡献

我们欢迎社区贡献！请查看 [CONTRIBUTING.md](CONTRIBUTING.md) 了解详细指南。

## 📄 许可证

- **公开插件**: MIT License
- **私有扩展**: 商业许可证

## 🔗 相关链接

- [GitHub仓库](https://github.com/berrycube/n8n-suite)
- [API文档](docs/API.md)
- [问题报告](https://github.com/berrycube/n8n-suite/issues)
- [讨论区](https://github.com/berrycube/n8n-suite/discussions)

---

*发布日期: 2025-09-01*
*贡献者: Claude Code + berrycube团队*

感谢所有参与此版本开发的贡献者！🎉