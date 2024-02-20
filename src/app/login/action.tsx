'use server'
import { cookies } from 'next/headers'
import { isRedirectError } from 'next/dist/client/components/redirect'
import { redirect } from 'next/navigation'


const LoginAction = async (user:string,password:string) => {
    try {
    const hostAuth = process.env.NEXT_PUBLIC_HOST_AUTH || 'localhost';
    const hostPortAuth = process.env.NEXT_PUBLIC_HOST_PORT_AUTH || 5000;
    const url = `http://${hostAuth}:${hostPortAuth}/login`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: user, password })
      });

        if (response.ok) {
            const data = await response.json();
            console.log(data)
            if(data.status == 'ok'){
                console.log('Login successful');
                cookies().set('access_token', data.access_token)
                cookies().set('refresh_token', data.refresh_token)
                redirect('/dashboard')
            }else{
                throw new Error('Login failed');
            }
        }
    } catch (error) {
        if(isRedirectError(error)) throw error
        console.log('error', error)
        return { message: 'Failed to create' }
      }
}
export default LoginAction;