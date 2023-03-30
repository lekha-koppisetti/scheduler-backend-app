export interface DbAppointment {
    id: string;
    customerId : string;
    operatorId: string;
    starttime: Date;
    endtime : Date;
    // scheduleDate: Date;
    createdAt : Date;
    updatedAt : Date;
}

export const APPOINTMENT_TABLE_FIELDS = ["id","customerId", 
                                   "operatorId","starttime","endtime","createdAt",
                                   "updatedAt"]