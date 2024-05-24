import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../../main';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../constants/consts';
import CreateTicketModal from '../../components/models/createTicket';
import { Ticket, TicketModel } from '../../types/types';
import ConfirmModal from '../../components/models/confirmModal';

const Main = observer(() => {
  const store = useContext(Context);
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(0);

  const onCreate = async (ticket: TicketModel, setError: (error: string) => void) => {
    try {
      store.isLoading = true;
      const response = await fetch(`${API_URL}/ticket/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        credentials: 'include',
        body: JSON.stringify(ticket),
      });
      const data = await response.json();
      if (response.ok && data.success) {

        setIsCreateModalOpen(false);
        await getTickets();
      }
      else {
        setError(data.Message);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      store.isLoading = false;
    }
  }

  async function getTickets() {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/ticket/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        credentials: 'include',
      });

      const data = await response.json();
      if (response.ok) {
        setTickets(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const deleteTicket = async (id: number) => {
    try {
      store.isLoading = true;
      const response = await fetch(`${API_URL}/ticket/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setTickets(tickets.filter((ticket: Ticket) => ticket.id !== id));
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      store.isLoading = false;
    }
  }
  useEffect(() => {

    getTickets();
  }, []);

  return (
    <div className="flex justify-center grow bg-gray-100">
      <div className="text-center pt-8 w-full max-w-5xl px-4 bg-white 
        rounded-lg shadow-lg transition duration-300 ease-in-out
      " >
        <h1 className="text-5xl font-bold mb-6 text-gray-800">Dashboard</h1>
        <p className="text-2xl mb-8 text-gray-600">Your tickets are here</p>
        <div className="flex justify-center mb-8">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create Ticket
          </button>
        </div>
        <div className="flex flex-col items-center">
          {isLoading ? (
            <p className="text-lg text-gray-500">Loading...</p>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="table-auto w-full bg-white shadow-md rounded-lg">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 text-gray-600">Brand</th>
                    <th className="px-4 py-2 text-gray-600">Model</th>
                    <th className="px-4 py-2 text-gray-600">Estimated Cost</th>
                    <th className="px-4 py-2 text-gray-600">Status</th>
                    <th className="px-4 py-2 text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket: Ticket) => (
                    <tr key={ticket.id} className="hover:bg-gray-100">
                      <td className="border px-4 py-2">{ticket.brand}</td>
                      <td className="border px-4 py-2">{ticket.model}</td>
                      <td className="border px-4 py-2">{ticket.totalPrice}</td>
                      <td className="border px-4 py-2">{ticket.status}</td>
                      <td className="border px-4 py-2 flex space-x-2 justify-between">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded transition duration-300">
                          View
                        </button>
                        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded transition duration-300"
                          onClick={
                            () => {
                              setSelectedTicketId(ticket.id);
                              setIsConfirmModalOpen(true);
                            }
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <CreateTicketModal open={isCreateModalOpen} onCreate={onCreate} onCancel={() => setIsCreateModalOpen(false)} />
      <ConfirmModal open={isConfirmModalOpen} message="Are you sure you want to delete this ticket?" onConfirm={async () => {
        await deleteTicket(selectedTicketId);
        setIsConfirmModalOpen(false);
      }} onCancel={() => {
        setIsConfirmModalOpen(false);
      }} />
    </div>
  );
});

export default Main;
