"use server"
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation'

const DeleteCookies = () => {
    if (cookies().has('access_token')) {
        cookies().delete('access_token');
    }
    if (cookies().has('refresh_token')) {
        cookies().delete('refresh_token');
    }
    redirect('/login')
};

export default DeleteCookies;