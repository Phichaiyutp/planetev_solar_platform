import React from 'react';
import LoginForm from '@/components/login/login'
const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="relative flex-1 bg-cover bg-center" style={{ backgroundImage: "url('/login.jpg')" }}>
        <div className="flex items-center justify-center h-screen">
          <LoginForm />
        I</div>
      </div>
    </div>
  );
};

export default Home;
