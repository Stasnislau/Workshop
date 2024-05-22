import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../../main';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../constants/consts';
import CreateTicketModal from '../../components/models/createTicket';


const Main = observer(() => {
  const store = useContext(Context);
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function getTickets() {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/ticket`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
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
    <div className="flex pt-4 justify-center grow bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="text-xl">Your tickets are here</p>
        <div className="flex justify-center mt-4">
          <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Create Ticket
          </button>
        </div>
        <div className="flex flex-col items-center mt-8">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <table className="table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Description</th>
                  <th className="px-4 py-2">Estimated cost</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket: any) => (
                  <tr key={ticket.id} className=''>
                    <td className="border px-4 py-2">{ticket.id}</td>
                    <td className="border px-4 py-2">{ticket.description}</td>
                    <td className="border px-4 py-2">{ticket.status}</td>
                    <td className="border px-4 py-2">
                      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Edit
                      </button>
                      <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <CreateTicketModal open={isModalOpen} onCreate={(ticket) => console.log(ticket)} onCancel={() => setIsModalOpen(false)} />

    </div>
  );
});

export default Main;
