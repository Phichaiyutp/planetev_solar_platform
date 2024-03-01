'use client'
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const LineLogin = () => {
  
  const handleClick = async () => {
    try {
      const redirect_uri = process.env.NEXT_PUBLIC_LINE_REDIRECT_URL + "/solar/notify/callback";
      const queryParams = new URLSearchParams({
        response_type: 'code',
        client_id: process.env.NEXT_PUBLIC_LINE_CLIENT_ID || '',
        redirect_uri: redirect_uri,
        scope: 'notify',
        state: '{state}'
      });
      
      const authorizationUrl = `https://notify-bot.line.me/oauth/authorize?${queryParams}`;
      window.location.href = authorizationUrl;
    } catch (error) {
      console.error('Error occurred while requesting authorization:', error);
    }
  };

  return (
    <div className="card w-full md:w-96 bg-base-100 shadow-xl">
      <Link href="/dashboard" className='mt-4 mr-4 place-self-end'>
        <button className="btn btn-square">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </Link>
      <figure className="px-10 pt-10">
        <Image src={`${process.env.NEXT_PUBLIC_BASE_PATH}/line_notify.png`} width={100} height={100} className="rounded-xl" alt={'Line notify'} />
      </figure>
      <div className="card-body items-center text-center">
        <h2 className="card-title">LINE Notify Login</h2>
        <div className="card-actions">
          <button className="btn btn-secondary text-white" onClick={handleClick}>Request Token</button>
        </div>
      </div>
    </div>
  );
};

export default LineLogin;
