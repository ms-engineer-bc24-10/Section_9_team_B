import { validateUsername } from '../validation';

describe('validateUsername', () => {
  test('valid usernames', () => {
    expect(validateUsername('user123')).toBeTruthy();
    expect(validateUsername('user_name')).toBeTruthy();
    expect(validateUsername('ゆーざー')).toBeTruthy();
    expect(validateUsername('ユーザー')).toBeTruthy();
    expect(validateUsername('太郎')).toBeTruthy();
    expect(validateUsername('user123_太郎')).toBeTruthy();
  });

  test('invalid usernames', () => {
    expect(validateUsername('')).toBeFalsy();
    expect(validateUsername('user name')).toBeFalsy();
    expect(validateUsername('user@name')).toBeFalsy();
    expect(validateUsername('user😊')).toBeFalsy();
    expect(validateUsername('ｕｓｅｒ１２３')).toBeFalsy();
  });
});
