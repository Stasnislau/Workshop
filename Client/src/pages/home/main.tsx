import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../../main';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../constants/consts';
import CreateTicketModal from '../../components/modals/createTicket';
import { Ticket, TicketModel } from '../../types/types';
import ConfirmModal from '../../components/modals/confirmModal';
import KebabMenu from '../../components/common/kebabMenu';
import Pagination from 'react-js-pagination';

const Main = observer(() => {
  const store = useContext(Context);
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [ticketsOnPage, setTicketsOnPage] = useState<Ticket[]>([]);
  const [isYours, setIsYours] = useState(true);
  const ticketsPerPage = 5;

  useEffect(() => {
    const start = (currentPage - 1) * ticketsPerPage;
    const end = start + ticketsPerPage;
    setTicketsOnPage(tickets.slice(start, end));
  }, [currentPage, tickets]);

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
        await getAllTickets();
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

  async function getAllTickets() {
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

  const getUserTickets = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/ticket/user/all`, {
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
  const getTickets = async () => {
    if (isYours) {
      await getUserTickets();
    } else {
      await getAllTickets();
    }
  }

  useEffect(() => {
    getTickets();
  }, [isYours]);

  return (
    <div className="flex justify-center grow bg-gray-100">
      <div className="text-center m-4 pt-8 w-full max-w-5xl px-4 bg-white 
        rounded-lg shadow-lg transition duration-300 ease-in-out" >
        <h1 className="text-5xl font-bold mb-6 text-gray-800">Dashboard</h1>
        <div className="flex justify-center space-x-4 border-b-2">
          <a
            className={`py-4 px-6 block hover:text-blue-500 focus:outline-none ${isYours ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
              }`}
            onClick={() => setIsYours(true)}
          >
            Your Tickets
          </a>
          <a
            className={`py-4 px-6 block hover:text-blue-500 focus:outline-none ${!isYours ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
              }`}
            onClick={() => setIsYours(false)}
          >
            All Tickets
          </a>
        </div>
        <div className="flex flex-col items-center">
          {isLoading ? (
            <p className="text-lg text-gray-500">Loading...</p>
          ) : (
            <div className="w-full">
              <table className="table-auto w-full bg-white shadow-md rounded-lg">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 text-gray-600">Brand</th>
                    <th className="px-4 py-2 text-gray-600">Model</th>
                    <th className="px-4 py-2 text-gray-600">Estimated Cost</th>
                    <th className="px-4 py-2 text-gray-600">Status</th>
                    <th className="px-4 py-2 text-gray-600"></th>
                  </tr>
                </thead>
                <tbody>
                  {ticketsOnPage.map((ticket: Ticket) => (
                    <tr key={ticket.id} className="hover:bg-gray-100">
                      <td className="border px-4 py-2">{ticket.brand}</td>
                      <td className="border px-4 py-2">{ticket.model}</td>
                      <td className="border px-4 py-2">{ticket.totalPrice}</td>
                      <td className="border px-4 py-2">{ticket.status}</td>
                      <KebabMenu options={
                        [
                          {
                            name: 'View',
                            callback: () => navigate(`/ticket/${ticket.id}`)
                          },
                          {
                            name: 'Delete',
                            callback: () => {
                              setSelectedTicketId(ticket.id);
                              setIsConfirmModalOpen(true);
                            }
                          }
                        ]
                      }
                      />

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="flex flex-row justify-center mt-8">
            <Pagination
              activePage={currentPage}
              itemsCountPerPage={ticketsPerPage}
              totalItemsCount={tickets.length}
              pageRangeDisplayed={5}
              onChange={(pageNumber) => setCurrentPage(pageNumber)}
              innerClass='flex flex-row space-x-2'
              linkClass="border px-4 py-2 text-gray-600 hover:bg-gray-200 transition duration-300 ease-in-out rounded-lg"
              activeLinkClass="border px-4 py-2 text-gray-600 bg-gray-200 rounded-lg"
            />
          </div>
        </div>
        <div className="flex justify-center my-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create Ticket
          </button>
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
