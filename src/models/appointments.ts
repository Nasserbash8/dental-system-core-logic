import mongoose from "mongoose";

const appointmentsSchema = new mongoose.Schema({
    name: String, 
    phone: String, 
    appointmentDate: Date,
    notes: String, 
    status: String,
  });

const Appointment = mongoose.models.Appointment || mongoose.model("Appointment", appointmentsSchema);

export default Appointment;
