export const validateUsername = (username: string) => {
  // NOTE: 英数字、アンダースコア、日本語文字を許可する正規表現
  const usernameRegex = /^[\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+$/;
  return usernameRegex.test(username);
};

export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
