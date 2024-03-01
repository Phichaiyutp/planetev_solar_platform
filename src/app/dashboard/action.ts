import { cookies } from 'next/headers';

export async function GetUuserInfo(): Promise<any> {
    try {
      const cookieStore = cookies();
      const access_token = cookieStore.get('access_token')?.value;
      if (!access_token) {
        throw new Error('Refresh token not found');
      }
      
      const hostAuth = process.env.NEXT_PUBLIC_HOST_AUTH || 'localhost';
      const hostPortAuth = process.env.NEXT_PUBLIC_HOST_PORT_AUTH || 5000;
      const url = `http://${hostAuth}:${hostPortAuth}/user_info`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${access_token}`
        },
        next: { revalidate: 100 }
      });
      const data = await response.json();
      return data
    } catch (error) {
      return error
    }
  }
