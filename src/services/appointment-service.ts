import { v4 as uuid } from 'uuid'
import { pg } from "../database-config";
import { APPOINTMENT_TABLE_FIELDS, DbAppointment, SlotAppointment } from '../models/db-appointment';

export async function insertAppointment(
  customerId: string,
  operatorId: string,
  starttime: Date,
  endtime: Date
): Promise<DbAppointment | null> {
  const trx = await pg.transaction();
  try {
    const dbAppointment: DbAppointment = {
      id: uuid(),
      customerId: customerId,
      operatorId : operatorId,
      starttime: starttime,
      endtime: endtime,
      createdAt: new Date(),
      updatedAt : new Date()
    };

    let result : Promise<DbAppointment | null> = Promise.resolve(null);
    const count = await trx
      .table<DbAppointment>('appointments')
      .where(function() {
        this.where('operatorId', operatorId)
          .andWhere(function() {
            this.whereRaw('? >= starttime AND ? < endtime', [starttime.toUTCString(), starttime.toUTCString()])
                .orWhereRaw('? > starttime AND ? <= endtime', [endtime.toUTCString(), endtime.toUTCString()])
          })
      })
      .select()
      .count()
     .then((data) => data[0].count) as number;
    if(count==0) {
      result = await trx
                .table<DbAppointment>('appointments')
                .returning(APPOINTMENT_TABLE_FIELDS)
                .insert(dbAppointment)
                .then((transactions) => 
                (transactions.length > 0 ? 
                transactions[0] : undefined)) as unknown as
                Promise<DbAppointment>;
    }
    trx.commit();
    return result;
  } catch(err) {
    trx.rollback();
    throw err;
  }
  
}

export async function getAllAppointmetsByOpertaor(
  operatorId: string
): Promise<SlotAppointment[] | null> {
  const results: DbAppointment[] = await pg
    .table<DbAppointment>('appointments')
    .where("operatorId", operatorId)
    .orderBy('updatedAt', 'desc')
    .select(APPOINTMENT_TABLE_FIELDS);
  const updatedResults: SlotAppointment[] = [];
  for(const appointment of results) {
    const app : SlotAppointment = appointment as SlotAppointment;
    app.slot = new Date(appointment.starttime).getUTCHours() + '-' + new Date(appointment.endtime).getUTCHours();
    updatedResults.push(app);
  }
  return updatedResults;
}

export async function deleteAppointment(
  appointmentId: string
): Promise<number> {
  return (await pg
    .table<DbAppointment>('appointments')
    .where("id", appointmentId)
    .del())
}

export async function updateAppointment(
  appointmentId: string,
  starttime : Date,
  endtime : Date
): Promise<DbAppointment | null> {
  const trx = await pg.transaction();
  try {

    let result : Promise<DbAppointment | null> = Promise.resolve(null);
    const count = await trx
      .table<DbAppointment>('appointments')
      .where(function() {
        this.where('id', appointmentId)
          .andWhere(function() {
            this.whereRaw('? >= starttime AND ? < endtime', [starttime.toUTCString(), starttime.toUTCString()])
                .orWhereRaw('? > starttime AND ? <= endtime', [endtime.toUTCString(), endtime.toUTCString()])
          })
      })
      .select()
      .count()
     .then((data) => data[0].count) as number;
    if(count==0) {
      result = await trx
                .table<DbAppointment>('appointments')
                .where('id', appointmentId)
                .update({starttime : starttime, endtime: endtime}, APPOINTMENT_TABLE_FIELDS)
                .then((transactions: any) => 
                (transactions.length > 0 ? 
                transactions[0] : undefined)) as unknown as
                Promise<DbAppointment>;
    }
    trx.commit();
    return result;
  } catch(err) {
    trx.rollback();
    throw err;
  }
}

export async function getFreeOperatorSlots(
  operatorId: string
): Promise<any> {

  const results = (await pg
    .table<DbAppointment>('appointments')
    .where("operatorId", operatorId)
    .orderBy('starttime')
    .select(["starttime"]));

  const resultDates : any = {
  }
  for(const appointment of results) {
   const isostr = appointment.starttime.toISOString()
    const startDate = new Date(isostr);
    const year = startDate.getFullYear();
    const month = startDate.getMonth();
    const day = startDate.getDate();
    const hours = startDate.getUTCHours();

    const date = day+'-'+(month+1)+'-'+year;
    let arr: any = [];
    if(!resultDates[date]) arr = [];
    else arr = resultDates[date];
    arr.push(hours);
    resultDates[date] = arr;
  }

  for(const key of Object.keys(resultDates)) {
    const value = resultDates[key];
    let constArr: number[] = [];
    for(let i=1;i<=24;i++) {
      if(value.indexOf(i) < 0) {
        constArr.push(i);
      }
    }
    const updatedArr = [];
    let start = constArr.length > 0 ? constArr[0] : 0;
    if(start!=0) {
      let i=0;
      for(i=0;i<constArr.length-1;i++) {
        if(constArr[i]!=constArr[i+1]-1) {
          updatedArr.push(start+'-'+(constArr[i]+1));
          start = constArr[i+1];
        }
      }
      updatedArr.push(start+'-'+(constArr[i]+1)%24);
    }
   
    resultDates[key]= updatedArr;
  }
  return resultDates;
}