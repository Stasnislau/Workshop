import React, { useRef, useState } from 'react';
import useClickOutside from '../../hooks/useClickOutside';
import { AnimatePresence, motion } from 'framer-motion';
import { API_URL } from '../../constants/consts';

interface AddTimeSlotModalProps {
    open: boolean;
    onClose: () => void;
    ticketId: string;
    callback?: () => void;
}

const AddTimeSlotModal: React.FC<AddTimeSlotModalProps> = ({ open, onClose, ticketId, callback }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [timeslot, setTimeslot] = useState({ startDate: '', endDate: '', startHour: '', endHour: '' });
    const [error, setError] = useState('');

    useClickOutside(modalRef, onClose);

    const handleAddTimeslot = async () => {
        if (!timeslot.startDate || !timeslot.endDate || !timeslot.startHour || !timeslot.endHour) {
            setError('Please fill all the fields');
            return;
        }

        const startTime = new Date(timeslot.startDate);
        startTime.setHours(parseInt(timeslot.startHour), 0, 0, 0);
        const endTime = new Date(timeslot.endDate);
        endTime.setHours(parseInt(timeslot.endHour), 0, 0, 0);
        const now = new Date();

        if (startTime <= now || endTime <= now || startTime >= endTime) {
            setError('Invalid times: times must be in the future and end time must be after start time');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/timeslot`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
                },
                body: JSON.stringify({ start: startTime.toISOString(), end: endTime.toISOString(), ticketId }),
            });

            if (response.ok) {
                onClose();
            } else {
                setError('Failed to add timeslot');
            }
        } catch (error) {
            console.error(error);
            setError('An error occurred while adding the timeslot');
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
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Add Timeslot</h3>
                            <div className="mt-2">
                                <input
                                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    type="date"
                                    required
                                    placeholder="Start Date"
                                    value={timeslot.startDate}
                                    onChange={(e) => setTimeslot({ ...timeslot, startDate: e.target.value })}
                                />
                                <input
                                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    type="number"
                                    min="0"
                                    max="23"
                                    required
                                    placeholder="Start Hour"
                                    value={timeslot.startHour}
                                    onChange={(e) => setTimeslot({ ...timeslot, startHour: e.target.value })}
                                />
                                <input
                                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    type="date"
                                    required
                                    placeholder="End Date"
                                    value={timeslot.endDate}
                                    onChange={(e) => setTimeslot({ ...timeslot, endDate: e.target.value })}
                                />
                                <input
                                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    type="number"
                                    min="0"
                                    max="23"
                                    required
                                    placeholder="End Hour"
                                    value={timeslot.endHour}
                                    onChange={(e) => setTimeslot({ ...timeslot, endHour: e.target.value })}
                                />
                            </div>
                            {error && <p className="text-red-500 text-center pt-2">{error}</p>}
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm transition duration-300"
                                onClick={handleAddTimeslot}
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