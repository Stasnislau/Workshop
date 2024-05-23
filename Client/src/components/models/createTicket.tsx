import React, { useRef, useState } from 'react';
import useClickOutside from '../../hooks/useClickOutside';
import { AnimatePresence, motion } from 'framer-motion';
import { TicketModel } from '../../types/types';

interface CreateTicketModalProps {
    open: boolean;
    onCreate: (ticket: TicketModel, setError:
        (error: string) => void) => void;
    onCancel: () => void;
}

const CreateTicketModal: React.FC<CreateTicketModalProps> = ({ open, onCreate, onCancel }) => {
    const modelRef = useRef<HTMLDivElement>(null);
    const [ticket, setTicket] = useState<TicketModel>({ brand: '', model: '', registrationId: '', description: '' });
    const [error, setError] = useState('');
    const handleCancel = () => {
        setTicket({ brand: '', model: '', registrationId: '', description: '' });
        onCancel();
    }
    useClickOutside(modelRef, handleCancel);

    const handleCreate = (
    ) => {
        if (!ticket.brand || !ticket.model || !ticket.registrationId || !ticket.description) {
            setError('Please fill all the fields');
            return;
        }
        onCreate(ticket, setError);
        setTicket({ brand: '', model: '', registrationId: '', description: '' });
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
                    <div ref={modelRef} className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
                        <div className="bg-white px-6 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">Create Ticket</h3>
                                    <div className="mt-2">
                                        <input
                                            className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            type="text"
                                            required
                                            placeholder="Brand"
                                            value={ticket.brand}
                                            onChange={(e) => setTicket({ ...ticket, brand: e.target.value })}
                                        />
                                        <input
                                            className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            type="text"
                                            required
                                            placeholder="Model"
                                            value={ticket.model}
                                            onChange={(e) => setTicket({ ...ticket, model: e.target.value })}
                                        />
                                        <input
                                            className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            type="text"
                                            required
                                            placeholder="Registration ID"
                                            value={ticket.registrationId}
                                            onChange={(e) => setTicket({ ...ticket, registrationId: e.target.value })}
                                        />
                                        <textarea
                                            className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Description"
                                            required
                                            value={ticket.description}
                                            onChange={(e) => setTicket({ ...ticket, description: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                onClick={handleCreate}
                            >
                                Create
                            </button>
                            <button
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                            
                        </div>
                        <div className="bg-red-100 text-red-600 text-center p-2">{error}</div>

                    </div>

                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default CreateTicketModal;
