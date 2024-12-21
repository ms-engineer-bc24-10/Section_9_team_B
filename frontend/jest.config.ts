import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest', // ts-jest を使用
  testEnvironment: 'jsdom', // テスト環境を jsdom に設定
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // セットアップファイルを指定
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // TypeScript のエイリアスを Jest に対応させる
  },
};

export default config;
