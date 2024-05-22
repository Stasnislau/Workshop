import React, { useRef, useState } from 'react';
import useClickOutside from '../../hooks/useClickOutside';
import { AnimatePresence, motion } from 'framer';

interface CreateTicketModalProps {
    open: boolean;
    onCreate: (ticket: any) => void;
    onCancel: () => void;
}

const CreateTicketModal: React.FC<CreateTicketModalProps> = ({ open, onCreate, onCancel }) => {
    const modelRef = useRef<HTMLDivElement>(null);
    const [ticket, setTicket] = useState({ brand: '', model: '', registrationId: '', description: '' });

    useClickOutside(modelRef, onCancel);

    const handleCreate = () => {
        onCreate(ticket);
        setTicket({ brand: '', model: '', registrationId: '', description: '' });
    };

    if (!open) return null;

    return (
        <AnimatePresence>
            {open &&
                <motion.div className="fixed bg-black h-screen w-screen bg-opacity-55 flex justify-center items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                    <div className={`fixed z-10 inset-0 overflow-y-auto ${open ? '' : 'hidden'}`} ref={modelRef}>
                        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                            </div>
                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                                Create Ticket
                                            </h3>
                                            <input className="mt-2" type="text" placeholder="Brand" value={ticket.brand} onChange={e => setTicket({ ...ticket, brand: e.target.value })} />
                                            <input className="mt-2" type="text" placeholder="Model" value={ticket.model} onChange={e => setTicket({ ...ticket, model: e.target.value })} />
                                            <input className="mt-2" type="text" placeholder="Registration ID" value={ticket.registrationId} onChange={e => setTicket({ ...ticket, registrationId: e.target.value })} />
                                            <textarea className="mt-2" placeholder="Description" value={ticket.description} onChange={e => setTicket({ ...ticket, description: e.target.value })} />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button type="button" onClick={handleCreate} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm">
                                        Create
                                    </button>
                                    <button type="button" onClick={onCancel} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            }
        </AnimatePresence>
    );
};

export default CreateTicketModal;