// eslint-disable-next-line no-unused-vars
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigator = useNavigate();

    const handleClick = useCallback((path) => {
        navigator(path);
    }, [navigator]);

    return (
        <header className='fixed top-0 z-50 w-full'>
            <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                    <a href="https://flowbite.com" className="flex items-center">
                        <img src="https://flowbite.com/docs/images/logo.svg" className="mr-3 h-6 sm:h-9" alt="Flowbite Logo" />
                        <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Phần Mềm Quản Lý Lớp Học</span>
                    </a>
                    <div className="flex items-center lg:order-2">
                        {/* Sử dụng hàm đã được optimize */}
                        <button onClick={() => handleClick('/sign-in')} className="cursor-pointer text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">Đăng nhập</button>
                        <button onClick={() => handleClick('/sign-up')} className="cursor-pointer text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">Đăng ký</button>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
