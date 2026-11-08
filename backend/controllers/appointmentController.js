import Appointment from "../models/Appointment.js";
import Property from "../models/Property.js";

// POST /api/appointments/guest  (login nahi chahiye)
export const createGuestAppointment = async (req, res) => {
  try {
    const { property, name, email, phone, date, message } = req.body;

    if (!property || !name || !email || !phone || !date) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const exists = await Property.findById(property);
    if (!exists) return res.status(404).json({ message: "Property not found" });

    if (new Date(date) < new Date()) {
      return res.status(400).json({ message: "Date must be in the future" });
    }

    const appointment = await Appointment.create({
      property, name, email, phone, date, message, user: null,
    });

    res.status(201).json({ appointment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/appointments  (protected)
export const createAppointment = async (req, res) => {
  try {
    const { property, date, message, phone } = req.body;

    if (!property || !date) {
      return res.status(400).json({ message: "Property and date are required" });
    }

    const exists = await Property.findById(property);
    if (!exists) return res.status(404).json({ message: "Property not found" });

    if (new Date(date) < new Date()) {
      return res.status(400).json({ message: "Date must be in the future" });
    }

    const appointment = await Appointment.create({
      property,
      user: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: phone || req.user.phone || "N/A",
      date,
      message,
    });

    res.status(201).json({ appointment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/appointments/mine  (protected)
export const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id })
      .populate("property", "title price location images")
      .sort({ createdAt: -1 });
    res.json({ appointments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/appointments/:id/cancel  (protected, sirf apni)
export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    if (!appointment.user || appointment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed to cancel this appointment" });
    }

    appointment.status = "cancelled";
    await appointment.save();
    res.json({ appointment });
  } catch (err) {
    res.status(400).json({ message: "Invalid appointment id" });
  }
};