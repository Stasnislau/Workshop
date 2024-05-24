export interface RegisterModel {
    Username: string;
    Password: string;
}

export interface TimeSlot {
    id: number;
    startTime: string;
    endTime: string;
    ticketId: number;
}

export interface Ticket {
    id: number;
    brand: string;
    model: string;
    registrationId: string;
    description: string;
    totalPrice: number;
    status: string;
    timeSlots: TimeSlot[];
}

export interface User {
    id: number;
    username: string;
    password: string;
    tickets: Ticket[];
}

export interface TicketModel {
    brand: string;
    model: string;
    registrationId: string;
    description: string;
}