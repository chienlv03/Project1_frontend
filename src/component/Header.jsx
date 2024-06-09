// eslint-disable-next-line no-unused-vars
import React, { useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    const loginResponse = JSON.parse(localStorage.getItem('loginResponse'));
    // const userId = loginResponse?.data.id;
    
    useEffect(() => {
        const checkLoginStatus = () => {
            const loggedIn = loginResponse ? true : false;
            setIsLoggedIn(loggedIn);
        };

        checkLoginStatus();
    }, [loginResponse]);

    const handleClick = useCallback((path) => {
        navigate(path);
    }, [navigate]);

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/auth/signout', {
                method: 'POST',
                credentials: 'include', // This is important to include cookies
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                localStorage.removeItem('loginResponse');
                setIsDropdownVisible(false);
                setIsLoggedIn(false);
                handleClick('/home');
            } else {
                console.error('Failed to logout');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const toggleDropdown = () => {
        setIsDropdownVisible(prevState => !prevState);
    };

    return (
        <header className='fixed top-0 z-50 w-full'>
            <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                    <a href="#" className="flex items-center">
                        <img src="https://flowbite.com/docs/images/logo.svg" className="mr-3 h-6 sm:h-9" alt="Flowbite Logo" />
                        <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Phần Mềm Quản Lý Lớp Học</span>
                    </a>
                    <div className="flex items-center lg:order-2">
                        {isLoggedIn ? (
                            <>
                                <img
                                    className="w-10 h-10 rounded-full cursor-pointer"
                                    src="src/assets/img/avatar.jpg"
                                    alt="Rounded avatar"
                                    onClick={toggleDropdown}
                                />
                            </>
                        ) : (
                            <>
                                <button onClick={() => handleClick('/sign-in')} className="cursor-pointer text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">Đăng nhập</button>
                                <button onClick={() => handleClick('/sign-up')} className="cursor-pointer text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">Đăng ký</button>
                            </>
                        )}
                    </div>

                    {isDropdownVisible && (
                        <div id="userDropdown" className="absolute right-4 top-14 z-10 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
                            <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                <div>{loginResponse.data?.username}</div>
                                <div className="font-medium truncate">{loginResponse.data?.email}</div>
                            </div>

                            <div className="py-1">
                                <a href="#" onClick={handleLogout} className="block text-center font-medium px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Đăng xuất</a>
                            </div>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;
