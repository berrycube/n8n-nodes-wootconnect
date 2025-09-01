# n8n-suite API 文档

## 概述

n8n-suite 是一个专门为n8n设计的插件套件，包含三个核心插件，提供增强的OAuth2认证、Evolution API诊断和Chatwoot集成功能。

## 插件概览

### 🔐 OAuth2Enhanced
增强的OAuth2认证插件，提供自动token刷新功能。

### 🛡️ EvoGuard  
Evolution API诊断助手，用于监控和诊断WhatsApp API服务。

### 💬 WootConnect
Chatwoot集成插件，提供完整的客服系统API集成。

---

## OAuth2Enhanced API

### 认证类型
- **名称**: `oAuth2ApiEnhanced`
- **显示名**: OAuth2 API (Enhanced)
- **扩展**: `oAuth2Api`

### 增强功能
- ✅ 自动Token刷新
- ✅ 刷新缓冲期配置
- ✅ 失败重试机制

### 配置参数
```typescript
interface OAuth2EnhancedConfig {
  autoRefresh: boolean;        // 自动刷新开关
  refreshBuffer: number;       // 刷新缓冲时间(秒)
  retryAttempts: number;       // 重试次数
  retryDelay: number;          // 重试延迟(毫秒)
}
```

---

## EvoGuard API

### 节点类型
- **名称**: `evoGuard`
- **显示名**: EvoGuard
- **分类**: `trigger`

### 支持操作

#### 1. Health Check (`healthCheck`)
检查Evolution API服务器健康状态
- **方法**: GET
- **端点**: `/manager/info`
- **返回**: 服务器状态、实例列表、内存使用等

#### 2. Instance Status (`instanceStatus`)
获取WhatsApp实例状态
- **方法**: GET
- **端点**: `/instance/connectionState/{instanceName}`
- **参数**: `instanceName` - 实例名称
- **返回**: 连接状态、建议操作

#### 3. Monitor Webhooks (`monitorWebhooks`)
检查Webhook连通性
- **方法**: POST
- **端点**: 用户配置的webhook URL
- **参数**: `webhookUrl` - 要测试的webhook地址
- **返回**: 连通性状态、响应时间

#### 4. QR Status (`qrStatus`)
检查QR码生成状态
- **方法**: GET
- **端点**: `/instance/qrcode/{instanceName}`
- **参数**: `instanceName` - 实例名称
- **返回**: QR码可用性、配对码

### 配置参数
```typescript
interface EvoGuardConfig {
  operation: string;           // 操作类型
  baseUrl: string;             // Evolution API基础URL
  apiKey: string;              // API密钥
  instanceName?: string;       // 实例名(特定操作)
  webhookUrl?: string;         // Webhook URL(监控操作)
  timeout: number;             // 超时时间(秒)
  includeDetails: boolean;     // 包含详细信息
}
```

---

## WootConnect API

### 节点类型
- **名称**: `chatwoot`
- **显示名**: Chatwoot
- **分类**: `transform`

### 支持操作

#### 1. Get Contacts (`getContacts`)
获取联系人列表
- **方法**: GET
- **端点**: `/api/v1/accounts/{accountId}/contacts`
- **返回**: 联系人数组、分页信息

#### 2. Create Contact (`createContact`)
创建新联系人
- **方法**: POST
- **端点**: `/api/v1/accounts/{accountId}/contacts`
- **参数**: `contactData` - 联系人信息
- **返回**: 创建的联系人信息

#### 3. Get Contact (`getContact`)
获取指定联系人
- **方法**: GET
- **端点**: `/api/v1/accounts/{accountId}/contacts/{contactId}`
- **参数**: `contactId` - 联系人ID
- **返回**: 联系人详细信息

#### 4. Update Contact (`updateContact`)
更新联系人信息
- **方法**: PUT
- **端点**: `/api/v1/accounts/{accountId}/contacts/{contactId}`
- **参数**: `contactId`, `contactData` - 联系人ID和更新数据
- **返回**: 更新后的联系人信息

#### 5. Delete Contact (`deleteContact`)
删除联系人
- **方法**: DELETE
- **端点**: `/api/v1/accounts/{accountId}/contacts/{contactId}`
- **参数**: `contactId` - 联系人ID
- **返回**: 删除确认消息

#### 6. Get Conversations (`getConversations`)
获取联系人的对话列表
- **方法**: GET
- **端点**: `/api/v1/accounts/{accountId}/contacts/{contactId}/conversations`
- **参数**: `contactId` - 联系人ID
- **返回**: 对话列表、分页信息

#### 7. Get Messages (`getMessages`)
获取对话中的消息
- **方法**: GET
- **端点**: `/api/v1/accounts/{accountId}/conversations/{conversationId}/messages`
- **参数**: `conversationId` - 对话ID
- **返回**: 消息列表、分页信息

#### 8. Send Message (`sendMessage`)
发送消息到对话
- **方法**: POST
- **端点**: `/api/v1/accounts/{accountId}/conversations/{conversationId}/messages`
- **参数**: `conversationId`, `messageContent` - 对话ID和消息内容
- **返回**: 发送的消息信息

#### 9. Update Conversation (`updateConversation`)
更新对话状态
- **方法**: PUT
- **端点**: `/api/v1/accounts/{accountId}/conversations/{conversationId}`
- **参数**: `conversationId`, `conversationData` - 对话ID和更新数据
- **返回**: 更新后的对话信息

### 配置参数
```typescript
interface WootConnectConfig {
  operation: string;           // 操作类型
  baseUrl: string;             // Chatwoot实例URL
  accountId: string;           // 账户ID
  apiToken: string;            // API令牌
  contactId?: string;          // 联系人ID(特定操作)
  conversationId?: string;     // 对话ID(特定操作)
  messageContent?: string;     // 消息内容(发送消息)
  contactData?: ContactData;   // 联系人数据(创建/更新)
  conversationData?: ConversationData; // 对话数据(更新对话)
}

interface ContactData {
  name?: string;               // 姓名
  email?: string;              // 邮箱
  phone_number?: string;       // 电话号码
  avatar_url?: string;         // 头像URL
  identifier?: string;         // 外部标识
  custom_attributes?: object;  // 自定义属性
}

interface ConversationData {
  status?: 'open' | 'resolved' | 'pending'; // 状态
  assignee_id?: string;        // 分配的客服ID
  team_id?: string;            // 团队ID
  priority?: 'none' | 'low' | 'medium' | 'high' | 'urgent'; // 优先级
}
```

---

## 响应格式

### 成功响应
```json
{
  "operation": "operationName",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "success": true,
  "data": { /* 操作特定数据 */ }
}
```

### 错误响应
```json
{
  "operation": "operationName", 
  "timestamp": "2025-01-01T00:00:00.000Z",
  "success": false,
  "error": "错误描述",
  "recommendations": ["建议1", "建议2"]
}
```

---

## 使用示例

### OAuth2Enhanced 示例
```json
{
  "credentials": {
    "autoRefresh": true,
    "refreshBuffer": 300,
    "retryAttempts": 3,
    "retryDelay": 1000
  }
}
```

### EvoGuard 健康检查示例
```json
{
  "operation": "healthCheck",
  "baseUrl": "https://evolution-api.example.com",
  "apiKey": "your-api-key",
  "timeout": 30,
  "includeDetails": true
}
```

### WootConnect 发送消息示例
```json
{
  "operation": "sendMessage",
  "baseUrl": "https://chatwoot.example.com",
  "accountId": "123",
  "apiToken": "your-api-token",
  "conversationId": "456",
  "messageContent": "Hello! How can I help you today?"
}
```

---

## 错误处理

### 通用错误码
- `400`: 请求参数错误
- `401`: 认证失败
- `403`: 权限不足
- `404`: 资源不存在
- `429`: 请求频率过高
- `500`: 服务器内部错误

### 插件特定错误
- **OAuth2Enhanced**: Token刷新失败、认证服务器不可达
- **EvoGuard**: Evolution API服务器离线、实例不存在
- **WootConnect**: Chatwoot实例不可达、账户ID无效

---

## 限制和注意事项

### 频率限制
- Evolution API: 建议每分钟不超过60次请求
- Chatwoot API: 遵循实例配置的频率限制

### 安全考虑
- 🔐 所有API密钥和令牌均使用password类型保护
- 🔒 支持HTTPS连接，建议生产环境启用
- 🛡️ 错误消息不包含敏感信息

### 兼容性
- ✅ n8n版本: 1.0.0+
- ✅ Node.js版本: 18.0.0+
- ✅ 所有现代浏览器

---

## 支持和反馈

- 📚 [完整文档](https://github.com/berrycube/n8n-suite)
- 🐛 [问题报告](https://github.com/berrycube/n8n-suite/issues)
- 💬 [讨论区](https://github.com/berrycube/n8n-suite/discussions)

---

## 商业扩展 (未来规划)

n8n-suite 还包含三个私有商业扩展包，为企业用户提供高级功能：

### 📊 oce-pro-analytics
**OAuth2 Enhanced 分析扩展**
- OAuth2 token 使用统计和监控
- API 调用成功率分析
- 重试模式优化建议
- 性能指标可视化仪表板
- **状态**: 规划中

### 🔧 woot-bulk-tools  
**Chatwoot 批量操作工具**
- CSV 格式联系人批量导入/导出
- 批量消息发送和模板管理
- 对话批量分配和状态变更
- 数据同步和迁移助手
- **状态**: 规划中

### 📝 evo-templates-pro
**Evolution API 模板库**
- WhatsApp 消息模板库管理
- 实例配置模板和快速部署
- 监控仪表板模板
- 自动化运维脚本模板
- **状态**: 规划中

> **注意**: 商业扩展功能目前处于规划阶段，将根据用户需求和反馈逐步开发。如有具体需求，请通过 GitHub Issues 联系我们。

---

*最后更新: 2025-09-01*