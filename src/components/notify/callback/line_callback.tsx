'use client'
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const LineCallback = (props:any) => {
  const {username} = props.props;

  const handleClick = async () => {
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_BASE_PATH}/api/line/sendnotify`;
      console.log(apiUrl)
      const requestData = {
        username: username,
        message: "Hello, World!"
      };
      const requestOptions = {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      };
      
      fetch(apiUrl, requestOptions)
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Failed to fetch data');
          }
        })
        .then(data => {
          console.log('API Response:', data);
        })
        .catch(error => {
          console.error('Fetch Error:', error);
        });
    } catch (error) {
      console.error('Error:', error);
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
          <h2 className="card-title">Link line account with {username} succees</h2>
          <div className="card-actions">
            <button className="btn btn-secondary text-white" onClick={handleClick}>Test send notify</button>
          </div>
        </div>
      </div>
  );
};

export default LineCallback;
