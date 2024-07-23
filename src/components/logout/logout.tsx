"use client"

import React from "react";
import DeleteCookies from "./action";
import Swal from 'sweetalert2';

const Logout = () => {
    
    const handleLogoutClick = async (event: React.MouseEvent) => {
        // event.stopPropagation();
        // event.preventDefault();

        Swal.fire({
            title: 'ยืนยันการออกจากระบบ',
            text: "คุณกำลังออกจากระบบ ต้องการดำเนินการต่อหรือไม่ ?",
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'No',
            confirmButtonText: 'Yes',
            reverseButtons: false,
            customClass: {
                icon: 'custom-swal2-warning', // ใช้ class ที่กำหนดใน CSS
            },
            willOpen: () => {
                document.body.style.overflow = 'visible';
            },
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'ออกจากระบบ!',
                    text: 'คุณได้ออกจากระบบแล้ว',
                    icon: 'success',
                    confirmButtonText: 'Close',
                }).then(() => {
                    DeleteCookies();
                });
            }
        });
        
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
