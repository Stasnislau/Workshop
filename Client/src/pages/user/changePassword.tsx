import React, { useState, useContext } from 'react';
import { Context } from "../../main";
import { observer } from 'mobx-react-lite';
import { API_URL } from '../../constants/consts';
import { useNavigate } from 'react-router-dom';

const ChangePasswordPage = observer(() => {
    const store = useContext(Context);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        await submit();

    };

    const submit = async () => {
        try {
            store.isLoading = true;
            const response = await fetch(`${API_URL}/user/update/password`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
                    },
                    body: JSON.stringify({
                        CurrentPassword: currentPassword,
                        NewPassword: newPassword
                    })
                }
            );
            const data = await response.json();
            if (response.ok && data.success) {
                navigate('/');
            } else {
                setError(data.Message);
            }
        } catch (error) {
            console.error(error);
            setError('An error occurred');
        } finally {
            store.isLoading = false;
        }
    }

    return (
        <div className="flex items-center justify-center grow bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center">Change Password</h2>
                <form className="mt-8 space-y-6" onSubmit={handleChangePassword}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label htmlFor="currentPassword" className="sr-only">Current Password</label>
                            <input
                                id="currentPassword"
                                name="currentPassword"
                                type="password"
                                autoComplete='current-password'
                                required
                                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Current Password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="newPassword" className="sr-only">New Password</label>
                            <input
                                id="newPassword"
                                name="newPassword"
                                type="password"
                                autoComplete='new-password'
                                required
                                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                autoComplete='new-password'
                                required
                                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="group relative flex w-full justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Change Password
                        </button>
                    </div>
                    <div className="text-center mt-4">
                        <span className="text-red-500 ">{error}</span>
                    </div>
                </form>
            </div>
        </div>
    );
});

export default ChangePasswordPage;