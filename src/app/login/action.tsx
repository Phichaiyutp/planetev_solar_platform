'use server'
import { cookies } from 'next/headers';

interface LoginResult {
  error?: string;
  success?: boolean;
}

const LoginAction = async (user: string, password: string): Promise<LoginResult> => {
  try {
    const hostAuth = process.env.NEXT_PUBLIC_HOST_AUTH || 'localhost';
    const hostPortAuth = process.env.NEXT_PUBLIC_HOST_PORT_AUTH || 5001;
    const url = `http://${hostAuth}:${hostPortAuth}/login`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: user, password }),
      timeout: 10000 
    } as any);

    if (!response.ok) {
      throw new Error('Failed to authenticate. Please try again.');
    }
    const data = await response.json();
    if (data.error) {
      return { error: data.error };
    } else if (data.status === 'ok') {
      cookies().set('access_token', data.access_token);
      cookies().set('refresh_token', data.refresh_token);
      return { success: true };
    }
  } catch (error) {
      console.error('Login failed:', error);
    return { error: 'Login failed. Please check your credentials.' };
  }
  return { error: 'Login failed. Please check your credentials.' };
};

export default LoginAction;
