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