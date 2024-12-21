import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignUpPage from '../page';
import { validateUsername, validateEmail } from '../../../../utils/validation';

jest.mock('../../../../utils/validation', () => ({
  validateUsername: jest.fn(),
  validateEmail: jest.fn(),
}));

//NOTE: テスト環境では Firebase に実際に接続する必要はないためモックを使用
jest.mock('../../../../utils/firebase', () => ({
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
  it('validates username', async () => {
    (validateUsername as jest.Mock).mockReturnValue(false); // ユーザー名無効
    render(<SignUpPage />);

    fireEvent.change(screen.getByLabelText('ユーザー名'), {
      target: { value: 'invalid@username' },
    });
    fireEvent.click(screen.getByRole('button', { name: '登録' }));

    await waitFor(() => {
      expect(
        screen.getByText(
          /ユーザー名は英数字、アンダースコア、日本語文字のみ使用できます。/,
        ),
      ).toBeInTheDocument();
    });
  });

  it('validates email', async () => {
    (validateUsername as jest.Mock).mockReturnValue(true); // ユーザー名有効
    (validateEmail as jest.Mock).mockReturnValue(false); // メール無効
    render(<SignUpPage />);

    fireEvent.change(screen.getByLabelText('メールアドレス'), {
      target: { value: 'invalidemail' },
    });
    fireEvent.click(screen.getByRole('button', { name: '登録' }));

    await waitFor(() => {
      expect(
        screen.getByText(/有効なメールアドレスを入力してください/),
      ).toBeInTheDocument();
    });
  });
});
