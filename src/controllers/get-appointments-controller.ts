import { Request, Response, NextFunction } from "express-serve-static-core";
import { getAllAppointmetsByOpertaor, getFreeOperatorSlots } from "../services/appointment-service";
import { validate as isUuid } from 'uuid'

export async function getAppointmetsByOperatorId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const operatorId = req?.params?.operatorId;

      if(!operatorId) {
        res.status(400).send({
          message: 'Request parameters are missing'
        });
      }

      if(!isUuid(operatorId)){
        res.status(400).send({
          message: 'Send valid uuids'
        });
      }


      const status = req?.query?.status || 'booked';
      let appointments : any
      if(status=='free') {
        appointments = await getFreeOperatorSlots(operatorId);
      } else {
        appointments = await getAllAppointmetsByOpertaor(operatorId);
      }
      res.status(200).send(appointments);
    } catch (err) {
      next(err);
    }
  }