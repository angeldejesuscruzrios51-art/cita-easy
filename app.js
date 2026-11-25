// Citas Easy - JavaScript base
// Tech Lead: structure and wiring only.
// Logic developer: implement every function marked TODO (branch feature/logic).

const form = document.getElementById("appointment-form");
const tableBody = document.getElementById("appointments-body");
const messageBox = document.getElementById("form-message");

// In-memory list of appointments
let appointments = [];

// Readable labels for the specialty values in index.html
const specialtyLabels = {
  general: "Medicina general",
  dentist: "Odontología",
  pediatrics: "Pediatría",
};

// Reads the current values from the form
function getFormData() {
  return {
    patientName: document.getElementById("patient-name").value.trim(),
    patientAge: document.getElementById("patient-age").value,
    specialty: document.getElementById("specialty").value,
    appointmentDate: document.getElementById("appointment-date").value,
    appointmentTime: document.getElementById("appointment-time").value,
  };
}

// Validates the form data.
// Returns { valid: boolean, errors: string[] }
function validateForm(data) {
  const errors = [];

  // Patient name: required, at least 2 characters
  if (!data.patientName) {
    errors.push("El nombre del paciente es obligatorio.");
  } else if (data.patientName.length < 2) {
    errors.push("El nombre del paciente debe tener al menos 2 caracteres.");
  }

  // Age: required, whole number between 0 and 120
  if (data.patientAge === "" || data.patientAge === null || data.patientAge === undefined) {
    errors.push("La edad es obligatoria.");
  } else {
    const age = Number(data.patientAge);
    if (!Number.isInteger(age) || age < 0 || age > 120) {
      errors.push("La edad debe ser un número entero entre 0 y 120.");
    }
  }

  // Specialty: required and must be one of the options in the form
  if (!data.specialty) {
    errors.push("Selecciona una especialidad.");
  } else if (!Object.prototype.hasOwnProperty.call(specialtyLabels, data.specialty)) {
    errors.push("Selecciona una especialidad válida.");
  }

  // Date: required and cannot be in the past (today is allowed)
  if (!data.appointmentDate) {
    errors.push("La fecha de la cita es obligatoria.");
  } else {
    const today = new Date();
    const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const parsedDate = new Date(`${data.appointmentDate}T00:00:00`);
    if (Number.isNaN(parsedDate.getTime())) {
      errors.push("La fecha de la cita no es válida.");
    } else if (data.appointmentDate < todayString) {
      errors.push("La fecha de la cita no puede ser en el pasado.");
    } else if (data.appointmentDate === todayString && data.appointmentTime) {
      // Same-day appointment: the time must not have passed yet
      const nowString = `${String(today.getHours()).padStart(2, "0")}:${String(today.getMinutes()).padStart(2, "0")}`;
      if (data.appointmentTime <= nowString) {
        errors.push("La hora de la cita ya pasó para hoy.");
      }
    }
  }

  // Time: required, HH:MM in 24-hour format
  if (!data.appointmentTime) {
    errors.push("La hora de la cita es obligatoria.");
  } else if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(data.appointmentTime)) {
    errors.push("La hora de la cita no es válida.");
  }

  return { valid: errors.length === 0, errors };
}

// Saves the appointment in the appointments array
function addAppointment(data) {
  appointments.push({
    patientName: data.patientName,
    patientAge: Number(data.patientAge),
    specialty: data.specialty,
    appointmentDate: data.appointmentDate,
    appointmentTime: data.appointmentTime,
  });
}

// Draws the rows of the table from the appointments array
function renderTable() {
  tableBody.innerHTML = "";

  if (appointments.length === 0) {
    const emptyRow = document.createElement("tr");
    const emptyCell = document.createElement("td");
    emptyCell.colSpan = 6;
    emptyCell.textContent = "No hay citas registradas todavía.";
    emptyRow.appendChild(emptyCell);
    tableBody.appendChild(emptyRow);
    return;
  }

  appointments.forEach((appointment, index) => {
    const row = document.createElement("tr");

    const formattedDate = (() => {
      const parsed = new Date(`${appointment.appointmentDate}T00:00:00`);
      if (Number.isNaN(parsed.getTime())) return appointment.appointmentDate;
      return parsed.toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    })();

    const cells = [
      String(index + 1),
      appointment.patientName,
      String(appointment.patientAge),
      specialtyLabels[appointment.specialty] || appointment.specialty,
      formattedDate,
      appointment.appointmentTime,
    ];

    cells.forEach((value) => {
      const cell = document.createElement("td");
      // textContent (not innerHTML) so a name typed in the form
      // can never be interpreted as HTML.
      cell.textContent = value;
      row.appendChild(cell);
    });

    tableBody.appendChild(row);
  });
}

// Shows a message (error or success) inside #form-message
function showMessage(text, type) {
  if (!messageBox) return;
  messageBox.textContent = text || "";
  messageBox.className = type === "error" ? "error" : type === "success" ? "success" : "";
}

// Form wiring: prevents page reload and connects the functions
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = getFormData();
  const result = validateForm(data);

  if (!result.valid) {
    showMessage(result.errors.join(" "), "error");
    return;
  }

  addAppointment(data);
  renderTable();
  showMessage("Cita agendada correctamente.", "success");
  form.reset();
});

document.addEventListener("DOMContentLoaded", () => {
  console.log("Citas Easy loaded");
  renderTable();
});
