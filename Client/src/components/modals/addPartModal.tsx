import React, { useRef, useState } from 'react';
import useClickOutside from '../../hooks/useClickOutside';
import { AnimatePresence, motion } from 'framer-motion';
import { API_URL } from '../../constants/consts';
import { PartModel } from '../../types/types';

interface AddPartModalProps {
    open: boolean;
    onClose: () => void;
    ticketId: string;
    callback: () => void;
}

const AddPartModal: React.FC<AddPartModalProps> = ({ open, onClose, ticketId, callback }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [part, setPart] = useState<PartModel>({
        name: '',
        price: 1,
        quantity: 1,
    });
    const [error, setError] = useState('');

    useClickOutside(modalRef, onClose);
    if (!open) return null;

    const handleAddPart = async () => {
        if (!part.name || !part.price || !part.quantity) {
            setError('Please fill all the fields');
            return;
        }
        if (part.price < 0 || part.quantity < 0) {
            setError('Price and quantity cannot be negative');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/part/add/${ticketId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
                },
                body: JSON.stringify({ ...part }),
            });

            if (response.ok) {
                await callback();
                setPart({ name: '', price: 1, quantity: 1 });
                onClose();
            } else {
                setError('Failed to add part');
            }
        } catch (error) {
            console.error(error);
            setError('An error occurred while adding the part');
        }
    };



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
                                <label className="block font-medium text-gray-700">Part Name</label>
                                <input
                                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    type="text"
                                    required
                                    placeholder="Part Name"
                                    value={part.name}
                                    onChange={(e) => setPart({ ...part, name: e.target.value })}
                                />
                                <label className="block font-medium text-gray-700 mt-2" >Price</label>
                                <input
                                    className="w-full  px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    type="number"
                                    required
                                    placeholder="Cost"
                                    value={part.price}
                                    onChange={(e) => setPart({ ...part, price: Number(e.target.value) })}
                                />
                                <label className="block font-medium text-gray-700 mt-2">Quantity</label>
                                <input
                                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    type="number"
                                    required
                                    placeholder="Quantity"
                                    value={part.quantity}
                                    onChange={(e) => setPart({ ...part, quantity: Number(e.target.value) })}
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
