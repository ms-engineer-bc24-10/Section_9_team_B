import { useState } from 'react';
import { signUp } from '../../../utils/auth';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp(email, password);
      // 成功時の処理（ホームページへリダイレクト）
    } catch (error) {
      // エラー処理
    }
  };

  return <form onSubmit={handleSubmit}>{/* フォームの内容 */}</form>;
}
