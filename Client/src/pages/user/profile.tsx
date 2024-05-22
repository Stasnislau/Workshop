import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../../main';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../constants/consts';
import Schedule from '../../components/schedule';
import { TimeSlot } from '../../types/types';

const ProfilePage = observer(() => {
    const store = useContext(Context);
    const navigate = useNavigate();

    const [userInformation, setUserInformation] = useState({
        username: '',
        hourlyRate: 0,
        timeSlots: [] as TimeSlot[],
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function getUserInformation() {
            try {
                setIsLoading(true);
                const response = await fetch(`${API_URL}/user/specific`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
                    },
                    credentials: 'include',
                });

                const data = await response.json();
                if (response.ok) {
                    setUserInformation({
                        username: data.username,
                        hourlyRate: data.hourlyRate,
                        timeSlots: data.timeSlots,
                    });
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
        getUserInformation();
    }, []);

    const handlePasswordChange = () => {
        navigate('/change-password');
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="flex flex-col items-center w-3/4 bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold">Profile</h3>
                <div className="flex items-center justify-between w-full mt-4">
                    <div className="flex flex-col">
                        <p className=""><strong>Username:</strong> {isLoading ?
                            <div className="animate-pulse bg-gray-300 h-6 w-24 rounded"></div>
                            : userInformation.username}</p>
                        <p className=""><strong>Hourly Rate:</strong> {
                            isLoading ? <div className="animate-pulse bg-gray-300 h-6 w-24 rounded"></div>
                                :
                                userInformation.hourlyRate + "$"}</p>
                    </div>
                    <div className="flex items-center">
                        <button className="p-1 px-2 bg-gray-300 rounded" onClick={handlePasswordChange}>Change Password</button>
                    </div>
                </div>
                <div className="mt-8 w-full">
                    <div className="border border-gray-200 rounded-lg p-4">
                        <Schedule timeSlots={
                            isLoading ? [] : userInformation.timeSlots
                        } />
                    </div>
                </div>
            </div>
        </div>
    );
});

export default ProfilePage;