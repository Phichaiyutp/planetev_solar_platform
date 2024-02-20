"use client"
import Image from "next/image";
import React, { useState } from 'react';
import LoginAction from '../../app/login/action';

const LoginForm = () => {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (!user || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      LoginAction(user,password)
    } catch (error) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="w-full sm:w-8/12 md:w-6/12 lg:w-5/12 2xl:w-4/12 p-6 sm:p-10 bg-white rounded-lg shadow-md lg:shadow-lg">
       <div className="flex items-start justify-center my-4">
        <Image
            src="/logo.png"
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
          placeholder="e-mail address"
          autoComplete="text"
          className="block w-full py-3 px-1 mt-2 text-gray-800 border-b-2 border-gray-100 focus:border-gray-500 focus:outline-none"
          required
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
        />

        <button
          type="submit"
          className="w-full py-3 mt-6 bg-gray-800 rounded-sm font-medium text-white uppercase focus:outline-none hover:bg-gray-700"
        >
          Login
        </button>

        <div className="sm:flex sm:flex-wrap mt-8 sm:mb-4 text-sm text-center">
          <a href="#" className="flex-2 underline">Forgot password?</a>
          <p className="flex-1 text-gray-500 text-md mx-4 my-1 sm:my-auto">or</p>
          <a href="#" className="flex-2 underline">Create an Account</a>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
