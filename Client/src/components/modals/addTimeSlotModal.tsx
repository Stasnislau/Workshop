import React, { useRef, useState } from 'react';
import useClickOutside from '../../hooks/useClickOutside';
import { AnimatePresence, motion } from 'framer-motion';
import { API_URL } from '../../constants/consts';
interface AddTimeSlotModalProps {
    open: boolean;
    onClose: () => void;
    ticketId: string;
    callback: () => void;
}

const AddTimeSlotModal: React.FC<AddTimeSlotModalProps> = ({ open, onClose, ticketId, callback }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [timeSlot, setTimeSlot] = useState({ startDate: '', endDate: '', startHour: '', endHour: '' });
    const [error, setError] = useState('');

    useClickOutside(modalRef, onClose);

    const handleAddTimeSlot = async () => {
        if (!timeSlot.startDate || !timeSlot.startHour || !timeSlot.endHour) {
            setError('Please fill all the fields');
            return;
        }
        console.log(timeSlot);
        const startTime = new Date(timeSlot.startDate);
        startTime.setHours(parseInt(timeSlot.startHour), 0, 0, 0);
        const endTime = new Date(timeSlot.startDate);
        endTime.setHours(parseInt(timeSlot.endHour), 0, 0, 0);
        console.log(startTime, endTime);
        const now = new Date();

        if (startTime <= now || startTime >= endTime) {
            setError('Invalid times: times must be in the future and end time must be after start time');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/timeslot/add/${ticketId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
                },
                body: JSON.stringify({ StartTime: startTime.toISOString(), EndTime: endTime.toISOString(), ticketId }),
            });
            const data = await response.json();

            if (response.ok) {
                callback();
                setError('');
                setTimeSlot({ startDate: '', endDate: '', startHour: '', endHour: '' });
                onClose();
            }
            else {
                setError(data.Message || 'An error occurred');
            }
        } catch (error) {
            console.error(error);
            setError('An error occurred');
        }
    };

    if (!open) return null;

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                    <div ref={modalRef} className="bg-white rounded-lg py-2 overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
                        <div className="bg-white px-6 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Add Time Slot</h3>
                            <div className="mt-2">
                                <input
                                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    type="date"
                                    required
                                    placeholder="Date"
                                    value={timeSlot.startDate}
                                    onChange={(e) => setTimeSlot({ ...timeSlot, startDate: e.target.value, endDate: e.target.value})}
                                />
                                <input
                                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    type="number"
                                    min="0"
                                    max="23"
                                    required
                                    placeholder="Start Hour"
                                    value={timeSlot.startHour}
                                    onChange={(e) => setTimeSlot({ ...timeSlot, startHour: e.target.value })}
                                />
                                <input
                                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    type="number"
                                    min="0"
                                    max="23"
                                    required
                                    placeholder="End Hour"
                                    value={timeSlot.endHour}
                                    onChange={(e) => setTimeSlot({ ...timeSlot, endHour: e.target.value })}
                                />
                            </div>
                            {error && <p className="text-red-500 text-center pt-2">{error}</p>}
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm transition duration-300"
                                onClick={handleAddTimeSlot}
                            >
                                Add
                            </button>
                            <button
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition duration-300"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AddTimeSlotModal;