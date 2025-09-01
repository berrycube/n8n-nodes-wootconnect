# 贡献指南

欢迎为 n8n-suite 贡献代码！本指南将帮助您了解如何参与项目开发。

## 🎯 项目概述

n8n-suite 是专为 n8n 设计的插件套件，包含：
- **OAuth2Enhanced**: 增强的OAuth2认证
- **EvoGuard**: Evolution API诊断助手  
- **WootConnect**: Chatwoot集成插件

## 🚀 快速开始

### 环境要求
- Node.js ≥ 18.0.0
- pnpm ≥ 8.0.0
- Git
- Docker (用于集成测试)

### 1. 克隆项目
```bash
git clone https://github.com/berrycube/n8n-suite.git
cd n8n-suite
```

### 2. 安装依赖
```bash
# 安装所有workspace依赖
pnpm install
```

### 3. 运行测试
```bash
# 运行所有插件的测试
pnpm run test

# 运行特定插件测试
cd public/n8n-nodes-wootconnect
pnpm run dev:test
```

### 4. 启动开发环境
```bash
# 启动开发服务器
cd public/n8n-nodes-wootconnect
pnpm run dev

# 启动集成测试环境
cd private/n8n-suite-integration
./scripts/run-e2e-complete.sh
```

## 📁 项目结构

```
n8n-suite/
├── public/                        # 公开插件 (MIT许可)
│   ├── n8n-nodes-oauth2-enhanced/ # OAuth2增强插件
│   ├── n8n-nodes-evoguard/       # Evolution API诊断
│   └── n8n-nodes-wootconnect/    # Chatwoot集成
├── private/                       # 私有代码
│   ├── n8n-suite-integration/    # 集成测试
│   └── n8n-pro-extensions/       # 商业插件
├── docs/                         # 文档
│   ├── API.md                    # API文档
│   └── adr/                      # 架构决策记录
└── scripts/                      # 构建脚本
```

## 🛠️ 开发工作流

### 分支策略
- `main`: 主分支，稳定版本
- `develop`: 开发分支，新功能集成
- `feature/*`: 功能分支
- `hotfix/*`: 紧急修复分支

### 提交流程
1. **创建分支**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **开发功能** (遵循TDD)
   ```bash
   # 1. 先写测试
   # 2. 运行测试(应该失败)
   pnpm run test
   # 3. 编写实现
   # 4. 测试通过
   # 5. 重构优化
   ```

3. **提交代码**
   ```bash
   # 确保所有测试通过
   pnpm run test
   pnpm run build
   pnpm run typecheck
   
   # 提交变更
   git add .
   git commit -m "feat: add new feature description"
   ```

4. **推送并创建PR**
   ```bash
   git push origin feature/your-feature-name
   # 在GitHub上创建Pull Request
   ```

## 📝 编码规范

### TypeScript规范
- ✅ 使用严格模式 (`strict: true`)
- ✅ 明确的类型注解，避免 `any`
- ✅ 接口优于类型别名（复杂类型）
- ✅ 使用枚举定义常量集合

### 代码风格
- ✅ 使用 ESLint 配置
- ✅ 2空格缩进
- ✅ 单引号字符串
- ✅ 末尾分号
- ✅ 函数和类的导出使用明确导出

### 命名约定
- **文件**: kebab-case (`my-component.ts`)
- **类**: PascalCase (`MyClass`)
- **函数/变量**: camelCase (`myFunction`)
- **常量**: SCREAMING_SNAKE_CASE (`MY_CONSTANT`)
- **接口**: PascalCase + I前缀 (`IMyInterface`)

### 示例代码
```typescript
// ✅ 好的例子
interface INodeParameters {
  operation: string;
  baseUrl: string;
  apiKey: string;
}

class ChatwootNode implements INodeType {
  public description: INodeTypeDescription = {
    displayName: 'Chatwoot',
    name: 'chatwoot',
    group: ['communication'],
    version: 1,
  };

  public async execute(
    this: IExecuteFunctions
  ): Promise<INodeExecutionData[][]> {
    const operation = this.getNodeParameter('operation', 0) as string;
    // 实现逻辑...
  }
}

// ❌ 避免的例子
const node: any = {
  name: 'chatwoot',
  exec: function(params) {
    // 缺少类型，难以维护
  }
};
```

## 🧪 测试规范

### 测试结构
每个插件都应包含：
- **单元测试**: 节点配置、参数验证、逻辑处理
- **集成测试**: API调用、错误处理、完整流程
- **E2E测试**: 真实n8n环境验证

### 测试命名
```typescript
describe('Chatwoot Node', () => {
  describe('基本配置', () => {
    it('should have correct node type name', () => {
      // 测试实现
    });
  });

  describe('API操作', () => {
    it('should handle getContacts operation', () => {
      // 测试实现
    });
  });
});
```

### 测试覆盖率要求
- **分支覆盖率**: ≥ 80%
- **函数覆盖率**: ≥ 80%
- **行覆盖率**: ≥ 80%

### Mock策略
```typescript
// ✅ 好的Mock示例
vi.mock('n8n-workflow', () => ({
  NodeConnectionType: { Main: 'main' },
  NodeOperationError: class extends Error {}
}));

// ❌ 避免的Mock
jest.mock('entire-module'); // 过度Mock
```

## 📋 Pull Request指南

### PR标题格式
```
<type>(<scope>): <description>

示例:
feat(wootconnect): add message sending functionality
fix(evoguard): resolve connection timeout issue  
docs(api): update authentication examples
```

### PR描述模板
```markdown
## 变更描述
简要描述此PR的目的和实现方法

## 变更类型
- [ ] 新功能
- [ ] Bug修复
- [ ] 文档更新
- [ ] 重构
- [ ] 性能优化
- [ ] 测试改进

## 测试
- [ ] 单元测试通过
- [ ] 集成测试通过
- [ ] 手动测试完成
- [ ] 覆盖率≥80%

## 检查清单
- [ ] 代码遵循项目规范
- [ ] 添加了必要的测试
- [ ] 更新了相关文档
- [ ] 向后兼容性检查
- [ ] 性能影响评估
```

### 代码审查要求
所有PR都需要：
- ✅ 至少1人代码审查
- ✅ 所有CI检查通过
- ✅ 测试覆盖率达标
- ✅ 文档更新完整

## 🐛 Bug报告

使用GitHub Issues报告问题，请包含：
- **环境信息**: Node.js版本、n8n版本、操作系统
- **重现步骤**: 详细的操作步骤
- **预期行为**: 期望发生什么
- **实际行为**: 实际发生了什么
- **错误日志**: 相关的错误信息
- **截图**: 如果有UI相关问题

### Bug报告模板
```markdown
**环境信息**
- Node.js版本: 18.17.0
- n8n版本: 1.0.0
- 插件版本: 0.1.0
- 操作系统: macOS 14.0

**重现步骤**
1. 打开n8n工作流编辑器
2. 添加WootConnect节点
3. 配置获取联系人操作
4. 执行工作流

**预期行为**
应该返回联系人列表

**实际行为**
返回401认证错误

**错误日志**
```
Error: Unauthorized access
  at ChatwootNode.execute (line 123)
```

**截图**
[附加相关截图]
```

## 💡 功能请求

使用GitHub Issues提交功能请求：
- **需求描述**: 详细说明需要什么功能
- **使用场景**: 说明使用场景和用户价值
- **建议实现**: 如果有实现想法可以提供
- **替代方案**: 目前如何处理这个需求

## 🏆 贡献者认可

我们感谢所有贡献者的努力！贡献类型包括：
- 🔧 代码贡献
- 📝 文档改进
- 🐛 Bug报告
- 💡 功能建议
- 🧪 测试用例
- 🎨 UI/UX改进
- 🌍 多语言翻译

### 贡献者权益
- 🏷️ GitHub贡献者标识
- 📄 CONTRIBUTORS.md文件记录
- 🎉 Release Notes提及
- 🏆 年度贡献者奖励

## ❓ 获取帮助

需要帮助时，可以：
- 📚 阅读[API文档](docs/API.md)
- 💬 在[Discussions](https://github.com/berrycube/n8n-suite/discussions)中提问
- 🐛 在[Issues](https://github.com/berrycube/n8n-suite/issues)中报告问题
- 📧 联系维护者团队

## 📜 许可证

- **公开插件**: MIT License
- **私有扩展**: 商业许可证

在贡献代码前，请确保您同意相应的许可证条款。

---

感谢您对 n8n-suite 的贡献！🎉

*最后更新: 2025-09-01*