import { Request, Response, NextFunction } from "express-serve-static-core";
import { deleteAppointment, updateAppointment } from "../services/appointment-service";
import { validate as isUuid } from 'uuid'

export async function cancelAppointment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const appointmentId = req?.params?.id;

      if(!appointmentId) {
        res.status(400).send({
          message: 'Request parameters are missing'
        });
      }

      if(!isUuid(appointmentId)){
        res.status(400).send({
          message: 'Send valid uuids'
        });
      }

      const resp =await deleteAppointment(appointmentId);
      res.status(200).send({
        message : resp+ ' Appointment cancelled successfully'
      });
    } catch (err) {
      next(err);
    }
}

export async function rescheduleAppointment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const appointmentId = req?.params?.id;

      const starttime = req?.body?.starttime;

      if(!appointmentId || !starttime) {
        res.status(400).send({
          message: 'Request parameters are missing'
        });
      }
      
      if(!isUuid(appointmentId)){
        res.status(400).send({
          message: 'Send valid uuids'
        });
      }
      
      const startDateObj = new Date(starttime);
      const endDateObj = new Date(startDateObj);;
      endDateObj.setHours(endDateObj.getHours() + 1);

      let appointment = await updateAppointment(appointmentId, startDateObj, endDateObj);
      if(!appointment) {
        res.status(200).send({
          message : 'No slot is available for this time. Please try to reschedule with different slot'
        });
      }
      res.status(200).send(appointment);
    } catch (err) {
      next(err);
    }
  }