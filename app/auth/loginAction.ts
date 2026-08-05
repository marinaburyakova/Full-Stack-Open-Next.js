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
    // Запускаем авторизацию по логину и паролю
    await signIn('credentials', {
      username,
      password,
      redirectTo: '/blogs', 
    });
  } catch (rawError) {
    const error = rawError as Error;

    // ОБЯЗАТЕЛЬНО: Если NextAuth делает успешный редирект, пробрасываем ошибку дальше!
    if (error.message && error.message.includes('NEXT_REDIRECT')) {
      throw error;
    }

    // ЛОГ ДЛЯ ТЕБЯ: выведет точную ошибку в терминал VS Code, если ты тестируешь локально
    console.error("NextAuth Login Error Caught:", error.name, error.message);

    // Ловим ЛЮБУЮ ошибку учетных данных (CredentialsSignin или ошибку коллбэка CallbackRouteError)
    if (
      error.message && 
      (error.message.includes('CredentialsSignin') || error.message.includes('CallbackRouteError'))
    ) {
      return { error: 'Invalid username or password', fields: currentFields };
    }

    // Если база данных упала или что-то еще
    return { error: `Login failed: ${error.message || 'Unknown error'}`, fields: currentFields };
  }

  return {};
}
