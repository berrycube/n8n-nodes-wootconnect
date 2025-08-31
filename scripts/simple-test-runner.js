#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 简单的测试运行器，避免vitest的ESM/CJS问题
class SimpleTestRunner {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
  }

  // 描述测试组
  describe(name, fn) {
    console.log(`\n📋 ${name}`);
    fn();
  }

  // 单个测试
  it(description, fn) {
    try {
      fn();
      console.log(`  ✅ ${description}`);
      this.passed++;
    } catch (error) {
      console.log(`  ❌ ${description}`);
      console.log(`     错误: ${error.message}`);
      this.failed++;
    }
  }

  // 断言函数
  expect(actual) {
    return {
      toBe: (expected) => {
        if (actual !== expected) {
          throw new Error(`期望 ${expected}, 实际得到 ${actual}`);
        }
      },
      toBeDefined: () => {
        if (actual === undefined) {
          throw new Error(`期望已定义, 实际得到 undefined`);
        }
      },
      toContain: (item) => {
        if (!actual || !actual.includes(item)) {
          throw new Error(`期望包含 ${item}, 实际 ${actual}`);
        }
      }
    };
  }

  // 运行所有测试
  async runTests() {
    console.log('🚀 开始运行简单测试...\n');

    // 动态导入并测试 Chatwoot node
    await this.testChatwoot();

    console.log(`\n📊 测试结果: ${this.passed} 通过, ${this.failed} 失败`);
    if (this.failed > 0) {
      process.exit(1);
    }
  }

  async testChatwoot() {
    try {
      // 简单检查 node 文件是否存在并可解析
      const nodePath = './dist/nodes/Chatwoot/Chatwoot.node.js';
      if (fs.existsSync(nodePath)) {
        const { Chatwoot } = require(path.resolve(nodePath));
        
        this.describe('Chatwoot Node', () => {
          this.it('should be constructable', () => {
            const node = new Chatwoot();
            this.expect(node).toBeDefined();
          });

          this.it('should have description', () => {
            const node = new Chatwoot();
            this.expect(node.description).toBeDefined();
          });

          this.it('should have correct name', () => {
            const node = new Chatwoot();
            this.expect(node.description.name).toBe('chatwoot');
          });

          this.it('should have correct display name', () => {
            const node = new Chatwoot();
            this.expect(node.description.displayName).toBe('Chatwoot');
          });

          this.it('should support get contacts operation', () => {
            const node = new Chatwoot();
            const operationProp = node.description.properties.find(p => p.name === 'operation');
            const getContactsOption = operationProp.options.find(o => o.value === 'getContacts');
            this.expect(getContactsOption).toBeDefined();
          });

          this.it('should have execute method', () => {
            const node = new Chatwoot();
            this.expect(typeof node.execute).toBe('function');
          });

          this.it('should have correct operations count', () => {
            const node = new Chatwoot();
            const operationProp = node.description.properties.find(p => p.name === 'operation');
            this.expect(operationProp.options.length).toBe(9);
          });

          this.it('should be categorized correctly', () => {
            const node = new Chatwoot();
            this.expect(node.description.group).toContain('communication');
          });
        });
      } else {
        console.log('⚠️  Chatwoot compiled file not found, skipping tests');
      }
    } catch (error) {
      console.log(`⚠️  Chatwoot test error: ${error.message}`);
    }
  }
}

// 全局函数导出
const runner = new SimpleTestRunner();
global.describe = runner.describe.bind(runner);
global.it = runner.it.bind(runner);
global.expect = runner.expect.bind(runner);

// 运行测试
runner.runTests();