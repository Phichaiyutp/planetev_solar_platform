"use client"

import React from "react";
import DeleteCookies from "./action";

const Logout: React.FC = () => {
    
    const handleLogoutClick = async () => {
        DeleteCookies()
    };

    return (
        <button
            onClick={handleLogoutClick}
            className="btn btn-success btn-md mx-auto mt-6 w-full max-w-60 text-white text-lg font-bold"
        >
            Logout
        </button>
    );
};

export default Logout;
