import mongoose, { Schema, model } from "mongoose";

const MensajeSchema = new Schema({
  emisor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Usuario", 
    required: true 
  },
  mensaje: { 
    type: String, 
    required: true 
  },
  fecha: { 
    type: Date, 
    default: Date.now 
  }
});

const ConversacionSchema = new Schema({
  participantes: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true }
  ],
  mensajes: [MensajeSchema]
});

export default model("Conversacion", ConversacionSchema);