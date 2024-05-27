import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../../constants/consts';
import AddTimeSlotModal from '../../components/modals/addTimeSlotModal';
import AddPartModal from '../../components/modals/addPartModal';
import { Ticket, Part, TimeSlot } from '../../types/types';
import { observer } from 'mobx-react-lite';
import { Context } from '../../main';
import KebabMenu from '../../components/common/kebabMenu';

const TicketPage: React.FC = observer(() => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const store = useContext(Context);

    const [ticket, setTicket] = useState<Ticket>({
        id: 0,
        brand: '',
        model: '',
        registrationId: '',
        description: '',
        totalPrice: 0,
        status: '',
        timeSlots: [],
    });
    const [parts, setParts] = useState<Part[]>([]);
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
    const [isPartModalOpen, setIsPartModalOpen] = useState(false);
    const [isAddTimeSlotModalOpen, setIsAddTimeSlotModalOpen] = useState(false);
    const [isEditTicketModalOpen, setIsEditTicketModalOpen] = useState(false);

    const onDelete = async (part: Part) => {
        try {
            const response = await fetch(`${API_URL}/part/delete/${part.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
                },
                credentials: 'include',
            });

            if (response.ok) {
                setTicket({ ...ticket, totalPrice: ticket.totalPrice - part.totalPrice });
                setParts(parts.filter((p) => p.id !== part.id));
            }
        } catch (error) {
            console.error(error);
        }
    };


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
    useEffect(() => {
        fetchTicketDetails();
    }, [id]);

    return (
        <div className="w-3/4 mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Ticket Details</h1>
            {ticket && (

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex flex-row justify-between w-full mb-4">
                        <div className="flex flex-col grow">
                            <h2 className="text-2xl font-semibold mb-4">{ticket.model}</h2>
                            <div className="flex justify-between mb-4">
                                <p className="mb-2"><strong>Brand:</strong> {ticket.brand}</p>
                                <p className="mb-2"><strong>Model:</strong> {ticket.model}</p>
                            </div>
                            <div className="flex justify-between mb-4">
                                <p className="mb-2"><strong>Registration ID:</strong> {ticket.registrationId}</p>
                                <p className="mb-4"><strong>Description:</strong> {ticket.description}</p>
                            </div>
                            <div className="flex justify-between mb-4">
                                <p className="mb-4"><strong>Total Price:</strong> {ticket.totalPrice}</p>
                                <p className="mb-2"><strong>Status:</strong> {ticket.status}</p>
                            </div>
                            <div className="flex space-x-4 mb-4">
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    onClick={() => setIsAddTimeSlotModalOpen(true)}
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
                        </div>
                        <div className="flex flex-col mb-4 overflow-y-auto grow">
                            <h3 className="text-xl text-center font-semibold mb-2">Parts</h3>
                            <table className="min-w-full text-center bg-white">
                                <thead>
                                    <tr>
                                        <th className="py-2 px-4 border-b">Name</th>
                                        <th className="py-2 px-4 border-b">Cost</th>
                                        <th className="py-2 px-4 border-b">Quantity</th>
                                        <th className="py-2 px-4 border-b">Total Cost</th>
                                        <th className="py-2 px-4 border-b">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {parts && parts.length > 0 && parts.map((part) => (
                                        <tr key={part.id}>
                                            <td className="py-2 px-4 border-b">{part.name}</td>
                                            <td className="py-2 px-4 border-b">{part.price}</td>
                                            <td className="py-2 px-4 border-b">{part.quantity}</td>
                                            <td className='py-2 px-4 border-b'>{part.totalPrice}</td>
                                            <KebabMenu options={
                                                [
                                                    {
                                                        name: "Delete",
                                                        callback: () => onDelete(part)
                                                    },
                                                    {
                                                        name: "Edit",
                                                        callback: () => { console.log("Edit") }
                                                    }
                                                ]
                                            } />
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="flex flex-col w-full">
                        <h3 className="text-xl font-semibold text-center mb-2">Time Slots</h3>
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b">Start Time</th>
                                    <th className="py-2 px-4 border-b">End Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    timeSlots && timeSlots.length > 0 &&
                                    timeSlots.map((slot) => (
                                        <tr key={slot.id}>
                                            <td className="py-2 px-4 border-b">{new Date(slot.startTime).toLocaleString()}</td>
                                            <td className="py-2 px-4 border-b">{new Date(slot.endTime).toLocaleString()}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            )
            }
            <AddTimeSlotModal
                open={isAddTimeSlotModalOpen}
                onClose={() => setIsAddTimeSlotModalOpen(false)}
                callback={fetchTicketDetails}
                ticketId={id!}
            />
            <AddPartModal
                open={isPartModalOpen}
                onClose={() => setIsPartModalOpen(false)}
                ticketId={id!}
                callback={fetchTicketDetails}
            />



        </div >
    );
});

export default TicketPage;
