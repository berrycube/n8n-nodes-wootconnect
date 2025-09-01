# ADR-003: 测试驱动开发(TDD)方法

## 状态
✅ 已接受 (2025-09-01)

## 背景
n8n插件开发涉及复杂的API集成、错误处理和用户体验。传统的"开发后测试"方法容易导致覆盖率不足和边界案例遗漏。需要选择合适的开发方法确保代码质量。

## 决策
采用测试驱动开发(TDD)方法，遵循Red-Green-Refactor循环：

1. **🔴 Red**: 先写失败的测试，定义期望行为
2. **🟢 Green**: 编写最简实现让测试通过
3. **🔵 Refactor**: 重构代码提升质量，测试保持通过

## 原理

### TDD适合n8n插件开发的原因
- **API契约明确**: n8n插件有清晰的接口规范，适合先定义测试
- **错误处理复杂**: 网络请求、认证失败等需要全面测试
- **用户体验关键**: 插件行为直接影响工作流，需要可靠保证
- **重构频繁**: API变化和功能迭代需要测试保护

### 测试层次
```
🔺 E2E测试 (5%)
   - Docker Compose环境
   - 真实n8n工作流执行
   
🔺 集成测试 (25%)
   - Mock API服务器
   - 完整操作流程验证
   
🔺 单元测试 (70%)
   - 节点配置验证
   - 参数处理逻辑  
   - 错误处理机制
```

## 实施策略

### 测试用例设计
每个插件包含以下测试类别：

#### 1. 节点配置测试
```typescript
describe('节点基本配置', () => {
  it('should have correct node type name');
  it('should have correct display name');
  it('should be categorized correctly');
  it('should have correct version');
});
```

#### 2. 参数验证测试
```typescript
describe('参数验证', () => {
  it('should have required parameters');
  it('should have correct parameter types');
  it('should validate parameter constraints');
  it('should handle conditional parameters');
});
```

#### 3. 操作功能测试
```typescript
describe('操作功能', () => {
  it('should support all documented operations');
  it('should handle successful responses');
  it('should handle error responses');
  it('should provide meaningful error messages');
});
```

#### 4. 边界条件测试
```typescript
describe('边界条件', () => {
  it('should handle network timeouts');
  it('should handle invalid credentials');
  it('should handle malformed responses');
  it('should handle rate limiting');
});
```

### Mock策略
- **本地测试**: 完全mock，快速反馈
- **集成测试**: Mock服务器，模拟真实API
- **E2E测试**: 真实环境，端到端验证

## 后果

### 积极影响
- ✅ **代码质量高**: TDD强制思考边界条件
- ✅ **重构安全**: 测试覆盖保护重构
- ✅ **文档价值**: 测试即文档，说明预期行为
- ✅ **快速反馈**: 单元测试快速发现问题
- ✅ **回归防护**: 自动发现破坏性变更

### 消极影响
- ⚠️ **初期投入**: TDD需要更多前期时间
- ⚠️ **维护成本**: 测试代码需要与业务代码同步维护
- ⚠️ **过度测试**: 可能对简单逻辑过度测试

### 缓解措施
- **渐进式采用**: 从核心功能开始，逐步扩展
- **测试工具优化**: 使用Vitest等快速测试框架
- **合理覆盖率**: 目标80%覆盖率，重点关注核心路径

## 质量指标

### 覆盖率目标
- **分支覆盖率**: ≥80%
- **函数覆盖率**: ≥80% 
- **行覆盖率**: ≥80%
- **语句覆盖率**: ≥80%

### 性能目标
- **单元测试**: <10ms/测试
- **集成测试**: <100ms/测试
- **E2E测试**: <30s/工作流

### 实际成果
基于已完成插件的数据：

| 插件 | 测试数量 | 覆盖率 | 通过率 |
|------|----------|--------|--------|
| OAuth2Enhanced | 17 | 95% | 100% |
| EvoGuard | 23 | 92% | 100% |
| WootConnect | 23 | 90% | 100% |

## 持续改进
- 定期回顾测试效果和覆盖率
- 根据生产问题优化测试用例
- 持续优化测试工具和流程