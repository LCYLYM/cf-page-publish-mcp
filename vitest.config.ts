/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'

export default defineConfig({
  esbuild: {
    target: 'node18'
  },
  test: {
    // 测试环境配置
    environment: 'node',
    // 全局测试设置
    globals: true,
    // 测试文件匹配模式
    include: ['tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    // 排除文件
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
    // 测试超时时间
    testTimeout: 10000,
    // 钩子超时时间
    hookTimeout: 10000,
    // 覆盖率配置
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/coverage/**'
      ]
    },
    // 处理ESM模块
    deps: {
      external: ['@cloudflare/puppeteer', 'cloudflare:workers']
    }
  }
})