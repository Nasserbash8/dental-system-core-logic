import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';
const patientsSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: false, // Can be empty initially for pending patients
  },
  phone: {
    type: Number,
    required: false, // Can be empty initially for pending patients
  },
  work: {
    type: String,
    default: undefined,
  },
  age: {
    type: String,
    required: false, // Can be empty initially for pending patients
  },
  treatments: [
    {
      treatmentId:String,
      treatmentNames: [{ 
          name : String
      }],
      cost: { type: Number, required: true },
      currency: { 
          type: String, 
          enum: ['USD', 'EUR', 'SYP'], 
          default: 'SYP' 
      },
       teeth: [
        {
          id: String,        
          value: String,       
          customTreatment: String, 
        }
  ],
      sessions: [
        {
          sessionId: String,
          sessionDate: Date,
          Payments: String,
          PaymentsDate: Date,
          paymentCurrency: { 
          type: String, 
          enum: ['USD', 'EUR', 'SYP'], 
          default: 'SYP' 
        },
        },
      ],
    },
  ],
  nextSessionDate: Date,
  illnesses: [
    {
      illness: String,
    },
  ],
  Medicines: [
    {
      medicine: String,
    },
  ],
  info: {
    type: String,
    required: false, // Allow for empty info if patient is pending
  },
  images : [{
    src:String,
    date:Date
  }],
  code: {
    type: String,
    required: true,
    unique: true,
  },
});

const Patient = mongoose.models.Patient || mongoose.model("Patient", patientsSchema);

export default Patient;
