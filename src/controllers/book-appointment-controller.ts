import { Request, Response, NextFunction } from "express-serve-static-core";
import { insertAppointment } from "../services/appointment-service";
import { validate as isUuid } from 'uuid';
import * as moment from 'moment';

export async function bookAppointmentController(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const customerId = req?.body?.customerId;
      const operatorId = req?.body?.operatorId;
      const starttime = req?.body?.starttime;

      if(!customerId || !operatorId || !starttime) {
        res.status(400).send({
          message: 'Request parameters are missing'
        });
      }
      
      if(!isUuid(customerId) || !isUuid(operatorId)){
        res.status(400).send({
          message: 'Send valid uuids'
        });
      }

      const isValid = moment(starttime, moment.ISO_8601, true).isValid();

      if(!isValid) {
        res.status(400).send({
          message: 'Send Date in ISO format'
        });
      }
      const startDateObj = new Date(starttime);

      const endDateObj = new Date(startDateObj);;
      endDateObj.setHours(endDateObj.getHours() + 1);
      
      let appointment = await insertAppointment(customerId, operatorId, startDateObj, endDateObj)
      if(!appointment) {
        res.status(200).send({
          message : 'No slot is available for this time. Please try to create appointment with different slot'
        });
      }
      res.status(200).send(appointment);
    } catch (err) {
      next(err);
    }
  }