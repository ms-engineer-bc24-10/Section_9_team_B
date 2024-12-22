import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest', // ts-jestを使用
  testEnvironment: 'jsdom', // テスト環境をjsdomに設定
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // セットアップファイルを指定
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // TypeScriptのエイリアスをJestに対応させる
  },
};

export default config;
