import { Request, Response } from "express";
import { bookAppointmentController } from "./controllers/book-appointment-controller";
import { getAppointmetsByOperatorId } from "./controllers/get-appointments-controller";
import { cancelAppointment, rescheduleAppointment } from "./controllers/update-appointment-controller";

const express = require("express"); 
const cors = require('cors');

const app= express();

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '1mb' }));

app.get("/", function(req: Request,res: Response){
   console.log("Schedular App")
});

app.post("/appointment/book", bookAppointmentController);

app.put("/appointment/reschedule/:id", rescheduleAppointment);

app.put("/appointment/cancel/:id", cancelAppointment);

app.get("/appointments/:operatorId", getAppointmetsByOperatorId);


app.listen(3000, function(){
  console.log("SERVER STARTED ON localhost:3000");     
})