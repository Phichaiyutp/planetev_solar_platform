"use client"
import { useRouter } from 'next/navigation'
import Image from "next/image";
import React, { useState } from 'react';
import LoginAction from '@/app/login/action';

const LoginForm = () => {
  const router = useRouter();
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState<boolean>(false);


  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setLoading(true);

    if (!user || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const loginResult = await LoginAction(user,password)
      if (loginResult?.error) {
        setError(loginResult.error);
        setPassword('');
        setLoading(false);
      } else if (loginResult?.success) {
        
        router.push('/dashboard');
        setLoading(false);
      }
    } catch (error) {
      console.log(error)
      setError('Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="w-10/12 sm:w-8/12 md:w-6/12 lg:w-5/12 2xl:w-4/12 p-6 sm:p-10 bg-white rounded-lg shadow-md lg:shadow-lg">
       <div className="flex items-start justify-center my-4">
        <Image
            src={`${process.env.NEXT_PUBLIC_BASE_PATH}/logo.png`}
            width={384/2}
            height={216/2}
            alt="Picture of the author"
          />
      </div> 
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <form className="mt-6" onSubmit={handleSubmit}>
        <label htmlFor="text" className="block text-xs font-semibold text-gray-600 uppercase">User</label>
        <input
          id="text"
          type="text"
          name="text"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          placeholder="user name"
          autoComplete="text"
          className="block w-full py-3 px-1 mt-2 text-gray-800 border-b-2 border-gray-100 focus:border-gray-500 focus:outline-none"
          required
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSubmit(e);
            }
          }}
        />

        <label htmlFor="password" className="block mt-4 text-xs font-semibold text-gray-600 uppercase">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
          autoComplete="current-password"
          className="block w-full py-3 px-1 mt-2 mb-4 text-gray-800 border-b-2 border-gray-100 focus:border-gray-500 focus:outline-none"
          required
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSubmit(e);
            }
          }}
        />

        <button
          type="submit"
          className={`w-full py-3 mt-6 bg-gray-800  rounded-sm font-medium text-white uppercase focus:outline-none hover:bg-gray-700 `}
          disabled={loading}
        >
          {loading ? (
          <>
            <span className="loading loading-spinner inline-block w-4 h-4 mr-2"></span>
            Loading...
          </>
        ) : (
          'Login'
        )}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
