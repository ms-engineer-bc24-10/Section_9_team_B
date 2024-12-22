import '@testing-library/jest-dom';
// テスト環境で TextEncoderを定義するため、util モジュールを使用して、TextEncoder をグローバルにモック
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;
jest.setTimeout(15000); // グローバルタイムアウトを15秒に設定
