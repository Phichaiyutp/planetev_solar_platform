import React from 'react';
import Image from 'next/image'
import LoginForm from '@/components/login/login'
const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Image
        alt="Mountains"
        src={`${process.env.NEXT_PUBLIC_BASE_PATH}/login.jpg`}
        quality={100}
        fill
        sizes="100vw"
        style={{
          objectFit: 'cover',
        }}
      />
      <div className="flex items-center justify-center z-10 h-screen">
        <LoginForm />
      </div>
    </div>
  );
};

export default Home;
