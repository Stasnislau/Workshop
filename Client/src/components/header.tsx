import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../main';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/logo.png';



const Header: React.FC = observer(() => {
    const store = useContext(Context);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await store.logout();
        if (store.state.isLoggedIn === false) {
            navigate('/login');
        }
    };

    return (
        <header className="bg-blue-600 p-4 flex justify-between items-center">
            <button
                className="flex items-center space-x-2"
                onClick={() => {
                    navigate('/');
                }}
            >
                <img src={Logo} alt="logo" className="w-8 h-8 rounded-full" />
                <h1 className="text-white text-xl">Car Workshop</h1>
            </button>
            <nav>
                <ul className="flex space-x-4">
                    {store.state.isLoggedIn ? (
                        <>
                            <li>
                                <button
                                    onClick={handleLogout}
                                    className="text-white hover:underline"
                                >
                                    Logout
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => {
                                        navigate('/profile');
                                    }}
                                    className="text-white hover:underline"
                                >
                                    Profile
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <a href="/login" className="text-white hover:underline">
                                    Login
                                </a>
                            </li>
                            <li>
                                <a href="/register" className="text-white hover:underline">
                                    Register
                                </a>
                            </li>

                        </>
                    )}

                </ul>
            </nav>
        </header>
    );
});

export default Header;
