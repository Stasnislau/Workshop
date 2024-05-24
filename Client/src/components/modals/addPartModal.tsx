import React, { useRef, useState } from 'react';
import useClickOutside from '../../hooks/useClickOutside';
import { AnimatePresence, motion } from 'framer-motion';
import { API_URL } from '../../constants/consts';

interface AddPartModalProps {
    open: boolean;
    onClose: () => void;
    ticketId: string;
}

const AddPartModal: React.FC<AddPartModalProps> = ({ open, onClose, ticketId }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [part, setPart] = useState({ name: '', cost: '' });
    const [error, setError] = useState('');

    useClickOutside(modalRef, onClose);

    const handleAddPart = async () => {
        if (!part.name || !part.cost) {
            setError('Please fill all the fields');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/part`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
                },
                body: JSON.stringify({ ...part, ticketId }),
            });

            if (response.ok) {
                onClose();
            } else {
                setError('Failed to add part');
            }
        } catch (error) {
            console.error(error);
            setError('An error occurred while adding the part');
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
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Add Part</h3>
                            <div className="mt-2">
                                <input
                                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    type="text"
                                    required
                                    placeholder="Part Name"
                                    value={part.name}
                                    onChange={(e) => setPart({ ...part, name: e.target.value })}
                                />
                                <input
                                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    type="text"
                                    required
                                    placeholder="Cost"
                                    value={part.cost}
                                    onChange={(e) => setPart({ ...part, cost: e.target.value })}
                                />
                            </div>
                            {error && <p className="text-red-500 text-center pt-2">{error}</p>}
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-500 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm transition duration-300"
                                onClick={handleAddPart}
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

export default AddPartModal;
