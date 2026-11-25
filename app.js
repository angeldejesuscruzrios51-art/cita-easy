// Citas Easy - JavaScript base
// Tech Lead: structure and wiring only.
// Logic developer: implement every function marked TODO (branch feature/logic).

const form = document.getElementById("appointment-form");
const tableBody = document.getElementById("appointments-body");
const messageBox = document.getElementById("form-message");

// In-memory list of appointments
let appointments = [];

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

// TODO (Logic): validate empty fields, valid age, future date, etc.
// Must return { valid: boolean, errors: string[] }
function validateForm(data) {
  return { valid: true, errors: [] };
}

// TODO (Logic): save the appointment in the appointments array
function addAppointment(data) {
  console.log("addAppointment not implemented yet", data);
}

// TODO (Logic): draw the rows of the table from the appointments array
function renderTable() {
  console.log("renderTable not implemented yet", appointments);
}

// TODO (Logic): show a message (error or success) inside #form-message
function showMessage(text, type) {
  console.log("showMessage not implemented yet", text, type);
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
  form.reset();
});

document.addEventListener("DOMContentLoaded", () => {
  console.log("Citas Easy loaded");
  renderTable();
});