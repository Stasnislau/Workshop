import React, { useRef, useState } from 'react';
import useClickOutside from '../../hooks/useClickOutside';
import { AnimatePresence, motion } from 'framer-motion';
import { Ticket, TicketModel } from '../../types/types';

interface EditTicketModalProps {
    open: boolean;
    onClose: () => void;
    ticket: Ticket;
    callback: (ticket: Ticket, setError: (error: string) => void) => void;
}

const EditTicketModal: React.FC<EditTicketModalProps> = ({ open, callback, onClose, ticket }) => {
    const modelRef = useRef<HTMLDivElement>(null);
    const [currentTicket, setCurrentTicket] = useState<Ticket>(ticket);
    const [error, setError] = useState('');
    const handleCancel = () => {
        setCurrentTicket({
            brand: ticket.brand,
            model: ticket.model,
            registrationId: ticket.registrationId,
            description: ticket.description,
            status: ticket.status,
            totalPrice: ticket.totalPrice,
            id: ticket.id,
            timeSlots: ticket.timeSlots,
        });
        setError('');
        onClose();
    }
    useClickOutside(modelRef, handleCancel);

    const handleEdit = (
    ) => {
        if (!currentTicket.brand || !currentTicket.model || !currentTicket.registrationId || !currentTicket.description) {
            setError('Please fill all the fields');
            return;
        }
        callback(ticket, setError);
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
                    <div ref={modelRef} className="bg-white rounded-lg py-2 overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
                        <div className="bg-white px-6 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">Edit Ticket</h3>
                                    <div className="mt-2">
                                        <input
                                            className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            type="text"
                                            required
                                            placeholder="Brand"
                                            value={currentTicket.brand}
                                            onChange={(e) => setCurrentTicket({ ...currentTicket, brand: e.target.value })}
                                        />
                                        <input
                                            className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            type="text"
                                            required
                                            placeholder="Model"
                                            value={currentTicket.model}
                                            onChange={(e) => setCurrentTicket({ ...currentTicket, model: e.target.value })}
                                        />
                                        <input
                                            className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            type="text"
                                            required
                                            placeholder="Registration ID"
                                            value={currentTicket.registrationId}
                                            onChange={(e) => setCurrentTicket({ ...currentTicket, registrationId: e.target.value })}
                                        />
                                        <select className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={currentTicket.status}
                                            onChange={(e) => setCurrentTicket({ ...currentTicket, status: e.target.value })}>
                                            <option value="created">Created</option>
                                            <option value="In progress">In Progress</option>
                                            <option value="Done">Done</option>
                                        </select>
                                        <textarea
                                            className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Description"
                                            required
                                            value={currentTicket.description}
                                            onChange={(e) => setCurrentTicket({ ...currentTicket, description: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                onClick={handleEdit}
                            >
                                Edit
                            </button>
                            <button
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                            {error && <p className="text-red-500 text-center sm:pr-4 pt-2">{error}</p>}

                        </div>
                    </div>

                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default EditTicketModal;
