// app/auth/loginAction.ts
'use server';

import { signIn } from '@/auth';

export interface LoginActionState {
  error?: string;
  fields?: {
    username: string;
  };
}

export async function loginUser(
  prevState: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  const currentFields = { username };

  if (!username || !password) {
    return { error: 'Username and password are required', fields: currentFields };
  }

  try {
    // Вызываем авторизацию NextAuth по логину и паролю
    await signIn('credentials', {
      username,
      password,
      redirectTo: '/blogs', // Куда отправить пользователя после успешного входа
    });
  } catch (rawError) {
    // Приводим ошибку к типу Error, чтобы TypeScript разрешил читать message
    const error = rawError as Error;

    // В NextAuth перенаправление (redirect) работает через проброс специальной ошибки.
    // Если это ошибка редиректа — просто пробрасываем её дальше, NextAuth сам всё сделает.
    if (error.message && error.message.includes('NEXT_REDIRECT')) {
      throw error;
    }

    // Обрабатываем ошибку неверных учетных данных (CredentialsSignin)
    if (error.message && error.message.includes('CredentialsSignin')) {
      return { error: 'Invalid username or password', fields: currentFields };
    }

    return { error: 'Something went wrong during login.', fields: currentFields };
  }

  return {};
}
