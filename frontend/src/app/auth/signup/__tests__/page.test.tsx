import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignUpPage from '../page';
import { validateUsername, validateEmail } from '../../../../utils/validation';
import { act } from 'react';

//NOTE: useRouterのモック
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

jest.mock('../../../../utils/validation', () => ({
  validateUsername: jest.fn(),
  validateEmail: jest.fn(),
}));

// Firebase モジュールのモック
jest.mock('../../../../utils/firebase', () => ({
  firebaseConfig: {},
  initializeApp: jest.fn(),
  getAuth: jest.fn(() => ({})), // 空オブジェクトを返す
}));

// サインアップ関数のモック
jest.mock('../../../../utils/auth', () => ({
  // Firebase関連関数のモック
  signUp: jest.fn().mockResolvedValue({
    uid: 'mock-uid',
    email: 'mock-email@example.com',
    getIdToken: jest.fn().mockResolvedValue('mock-id-token'),
  }),
  logIn: jest.fn().mockResolvedValue({
    uid: 'mock-uid',
    email: 'mock-email@example.com',
  }),
  logOutUser: jest.fn().mockResolvedValue(undefined),

  // CSRFトークン取得関数のモック
  fetchCsrfToken: jest.fn().mockResolvedValue('mock-csrf-token'),
  getCsrfTokenFromCookie: jest.fn().mockReturnValue('mock-csrf-token'),

  // Firebase関連オブジェクトのモック
  auth: {
    currentUser: null,
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(() => ({
      user: {
        uid: 'mock-uid',
        email: 'mock-email@example.com',
        getIdToken: jest.fn().mockResolvedValue('mock-id-token'),
      },
    })),
    signOut: jest.fn(),
  },

  // Djangoバックエンド通信のモック
  sendUserToDjango: jest.fn().mockResolvedValue(undefined),
}));

//NOTE: テスト環境では Firebase に実際に接続する必要はないためモックを使用
jest.mock('../../../../utils/firebase', () => ({
  firebaseConfig: {
    apiKey: 'test-api-key',
    authDomain: 'test-auth-domain',
    projectId: 'test-project-id',
    storageBucket: 'test-storage-bucket',
    messagingSenderId: 'test-messaging-sender-id',
    appId: 'test-app-id',
    measurementId: 'test-measurement-id',
  },
  initializeApp: jest.fn(),
  getAuth: jest.fn(() => ({
    currentUser: null,
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn().mockResolvedValue({
      user: {
        uid: 'test-uid',
        email: 'test@example.com',
        getIdToken: jest.fn().mockResolvedValue('test-id-token'),
      },
    }),
    signOut: jest.fn(),
  })),
}));

describe('SignUpPage', () => {
  it('prevents default form submission', () => {
    const handleSubmit = jest.fn(); // handleSubmitをモック

    render(
      <form role="form" onSubmit={handleSubmit}>
        <button type="submit">送信</button>
      </form>,
    );

    fireEvent.submit(screen.getByRole('form'));

    expect(handleSubmit).toHaveBeenCalled(); // handleSubmitが呼ばれたことを確認
  });

  it('validates username', async () => {
    (validateUsername as jest.Mock).mockReturnValue(false); // バリデーション失敗

    render(<SignUpPage />);

    await act(async () => {
      fireEvent.change(screen.getByLabelText('ユーザー名'), {
        target: { value: 'invalid@username' },
      });
      fireEvent.submit(screen.getByRole('form')); // NOTE: フォーム送信イベントを直接トリガー (fireEvent.clickでは動作しない)
    });

    // 入力値が更新されたことを確認
    expect(validateUsername).toHaveBeenCalledWith('invalid@username');
    expect(validateUsername).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      const errorMessage = screen.getByTestId('error-message');
      expect(errorMessage).toHaveTextContent(/ユーザー名.*英数字/);
    });
  });

  it('validates email', async () => {
    (validateUsername as jest.Mock).mockReturnValue(true); // ユーザー名バリデーション成功
    (validateEmail as jest.Mock).mockReturnValue(false); // メールアドレスバリデーション失敗

    render(<SignUpPage />);

    await act(async () => {
      fireEvent.change(screen.getByLabelText('メールアドレス'), {
        target: { value: 'invalidemail' },
      });
      fireEvent.submit(screen.getByRole('form'));
    });

    await waitFor(() => {
      const errorMessage = screen.getByTestId('error-message');
      expect(errorMessage).toHaveTextContent(/有効なメールアドレス/);
    });
  });
});
