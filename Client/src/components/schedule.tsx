import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TimeSlot } from '../types/types';
import { addDays, startOfWeek, format, parseISO, endOfDay, isAfter, startOfDay } from 'date-fns';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',];

const Schedule = ({
    timeSlots,
}: {
    timeSlots: TimeSlot[];

}) => {
    const [currentWeek, setCurrentWeek] = useState<Date>(startOfWeek(new Date()));
    const navigate = useNavigate();

    const nextWeek = () => setCurrentWeek(addDays(currentWeek, 7));
    const previousWeek = () => setCurrentWeek(addDays(currentWeek, -7));

    if (!timeSlots || timeSlots?.length === 0) {
        return (
            <div className="container mx-auto p-2 relative">
                <div className="flex justify-between mb-2 opacity-50">
                    <button className="p-1 px-2 bg-gray-300 rounded" onClick={previousWeek}>Previous</button>
                    <h2 className="text-lg">{format(currentWeek, 'MMM do')} - {format(addDays(currentWeek, 6), 'MMM do')}</h2>
                    <button className="p-1 px-4 bg-gray-300 rounded" onClick={nextWeek}>Next</button>
                </div>
                <div className="grid grid-cols-8 opacity-50">
                    <div></div>
                    {daysOfWeek.map(day => (
                        <div key={day} className="text-center font-bold text-xs">{day}</div>
                    ))}
                    {[...Array(24)].map((_, hour) => (
                        <>
                            <div key={hour} className="text-right pr-2">{hour}:00</div>
                            {daysOfWeek.map((_, dayIndex) => (
                                <div key={dayIndex} className="border border-gray-300"></div>
                            ))}
                        </>
                    ))}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <h2 className="text-2xl text-black-400">
                        You have nothing scheduled
                    </h2>
                </div>
            </div>
        )
    }


    return (
        <div className="container mx-auto p-2">
            <div className="flex justify-between mb-2">
                <button className="p-1 px-2 bg-gray-300 rounded" onClick={previousWeek}>Previous</button>
                <h2 className="text-lg">{format(currentWeek, 'MMM do')} - {format(addDays(currentWeek, 6), 'MMM do')}</h2>
                <button className="p-1 px-4 bg-gray-300 rounded" onClick={nextWeek}>Next</button>
            </div>
            <div className="grid grid-cols-8">
                <div></div>
                {daysOfWeek.map(day => (
                    <div key={day} className="text-center font-bold text-xs">{day}</div>
                ))}
                {[...Array(24)].map((_, hour) => (
                    <>
                        <div key={hour} className="text-right pr-2">{hour}:00</div>
                        {daysOfWeek.map((_, dayIndex) => {
                            const day = addDays(currentWeek, dayIndex);
                            const startOfDayHour = startOfDay(day);
                            const endOfDayHour = endOfDay(day);
                            const timeSlot = timeSlots.find(timeSlot => {
                                const startTime = parseISO(timeSlot.startTime);
                                return isAfter(startTime, startOfDayHour) && isAfter(endOfDayHour, parseISO(timeSlot.endTime));
                            });

                            if (timeSlot) {
                                return (
                                    <div key={dayIndex} className="relative border border-gray-300">
                                        <button onClick={() => navigate(`/ticket/${timeSlot.ticketId}`)} className="w-full h-full bg-blue-500 text-white text-xs">
                                            Ticket {timeSlot.id}
                                        </button>
                                    </div>
                                );
                            } else {
                                return <div key={dayIndex} className="border border-gray-300"></div>;
                            }
                        })}
                    </>
                ))}
            </div>
        </div>
    );
};

export default Schedule;
