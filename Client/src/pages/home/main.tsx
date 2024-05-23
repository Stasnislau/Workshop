import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../../main';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../constants/consts';
import CreateTicketModal from '../../components/models/createTicket';
import { TicketModel } from '../../types/types';

const Main = observer(() => {
  const store = useContext(Context);
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

        setIsModalOpen(false);
      }
      else {
        setError(data.message);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      store.isLoading = false;
    }
  }


  useEffect(() => {
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
    getTickets();
  }, []);

  return (
    <div className="flex pt-8 justify-center grow bg-gray-100">
      <div className="text-center w-full max-w-5xl px-4">
        <h1 className="text-5xl font-bold mb-6 text-gray-800">Dashboard</h1>
        <p className="text-2xl mb-8 text-gray-600">Your tickets are here</p>
        <div className="flex justify-center mb-8">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
            onClick={() => setIsModalOpen(true)}
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
                    <th className="px-4 py-2 text-left text-gray-600">ID</th>
                    <th className="px-4 py-2 text-left text-gray-600">Description</th>
                    <th className="px-4 py-2 text-left text-gray-600">Estimated Cost</th>
                    <th className="px-4 py-2 text-left text-gray-600">Status</th>
                    <th className="px-4 py-2 text-left text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket: any) => (
                    <tr key={ticket.id} className="hover:bg-gray-100">
                      <td className="border px-4 py-2">{ticket.id}</td>
                      <td className="border px-4 py-2">{ticket.description}</td>
                      <td className="border px-4 py-2">{ticket.estimatedCost}</td>
                      <td className="border px-4 py-2">{ticket.status}</td>
                      <td className="border px-4 py-2 flex space-x-2">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded transition duration-300">
                          Edit
                        </button>
                        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded transition duration-300">
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
      <CreateTicketModal open={isModalOpen} onCreate={onCreate} onCancel={() => setIsModalOpen(false)} />
    </div>
  );
});

export default Main;
