import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../../constants/consts';
import AddTimeSlotModal from '../../components/modals/addTimeSlotModal';
import AddPartModal from '../../components/modals/addPartModal';
import { Ticket, Part, TimeSlot } from '../../types/types';
import { observer } from 'mobx-react-lite';
import { Context } from '../../main';

const TicketPage: React.FC = observer(() => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const store = useContext(Context);

    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [parts, setParts] = useState<Part[]>([]);
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
    const [isTimeSlotModalOpen, setIsTimeSlotModalOpen] = useState(false);
    const [isPartModalOpen, setIsPartModalOpen] = useState(false);

    useEffect(() => {
        async function fetchTicketDetails() {
            try {
                store.isLoading = true;
                const response = await fetch(`${API_URL}/ticket/specific/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
                    },
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setTicket(data);
                    setParts(data.parts);
                    setTimeSlots(data.timeSlots);
                }
            } catch (error) {
                console.error(error);
            } finally {
                store.isLoading = false;
            }
        }

        fetchTicketDetails();
    }, [id]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Ticket Details</h1>
            {ticket && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4">{ticket.model}</h2>
                    <p className="mb-2"><strong>Brand:</strong> {ticket.brand}</p>
                    <p className="mb-2"><strong>Model:</strong> {ticket.model}</p>
                    <p className="mb-2"><strong>Registration ID:</strong> {ticket.registrationId}</p>
                    <p className="mb-4"><strong>Description:</strong> {ticket.description}</p>
                    <div className="flex space-x-4 mb-4">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => setIsTimeSlotModalOpen(true)}
                        >
                            Add Time slots
                        </button>
                        <button
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => setIsPartModalOpen(true)}
                        >
                            Add Part
                        </button>
                    </div>

                    <h3 className="text-xl font-semibold mb-2">Parts</h3>
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">Name</th>
                                <th className="py-2 px-4 border-b">Cost</th>
                                <th className="py-2 px-4 border-b">Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {parts.map((part) => (
                                <tr key={part.id}>
                                    <td className="py-2 px-4 border-b">{part.name}</td>
                                    <td className="py-2 px-4 border-b">{part.price}</td>
                                    <td className="py-2 px-4 border-b">{part.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <h3 className="text-xl font-semibold mt-4 mb-2">Time Slots</h3>
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">Start Time</th>
                                <th className="py-2 px-4 border-b">End Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {timeSlots.map((slot) => (
                                <tr key={slot.id}>
                                    <td className="py-2 px-4 border-b">{new Date(slot.startTime).toLocaleString()}</td>
                                    <td className="py-2 px-4 border-b">{new Date(slot.endTime).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <AddTimeSlotModal
                open={isTimeSlotModalOpen}
                onClose={() => setIsTimeSlotModalOpen(false)}
                ticketId={id!}
            />
            <AddPartModal
                open={isPartModalOpen}
                onClose={() => setIsPartModalOpen(false)}
                ticketId={id!}
            />
        </div>
    );
});

export default TicketPage;
