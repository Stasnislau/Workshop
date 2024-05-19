import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../main';
import { useNavigate } from 'react-router-dom';



const Header: React.FC = observer(() => {
    const store = useContext(Context);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await store.logout();
    };

    return (
        <header className="bg-blue-600 p-4 flex justify-between items-center">
            <button
                className="flex items-center space-x-2"
                onClick={() => {
                    navigate('/');
                }}
            >
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
                        </>
                    ) : (
                        <>
                            <li>
                                <a href="/login" className="text-white hover:underline">
                                    Login
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
