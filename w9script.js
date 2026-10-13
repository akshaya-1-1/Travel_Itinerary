let currentStep = 1;
showStep(currentStep); // Display the first step initially

function showStep(n) {
const steps = document.getElementsByClassName("step");
// Hide all steps
for (let i = 0; i < steps.length; i++) {
steps[i].style.display = "none";
}
// Display the current step
if (steps[n - 1]) {
steps[n - 1].style.display = "block";
}

// Update button visibility based on step 'n'
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
if (prevBtn) prevBtn.style.display = (n === 1) ? "none" : "inline";
if (nextBtn) {
if (n === steps.length - 1) { // On Confirmation step
nextBtn.innerHTML = "Confirm & Submit";
nextBtn.style.display = "inline";
} else if (n === steps.length) { // On Success step
nextBtn.style.display = "none";
if (prevBtn) prevBtn.style.display = "none"; // Hide prev on success too
} else {
nextBtn.innerHTML = "Next";
nextBtn.style.display = "inline";
}
}
}

function navigate(n) {
// Basic validation check before moving forward
if (n > 0 && !validateStep(currentStep)) {
return false; // Stop if validation fails when moving forward
}

const steps = document.getElementsByClassName("step");
// Hide current step (optional animation could go here)
if (steps[currentStep - 1]) steps[currentStep - 1].style.display = "none";
// Update step number
currentStep = currentStep + n;

// Special handling for confirmation step
if (currentStep === steps.length - 1) { // Reached Confirmation step (Step 6)
displayConfirmation();
}

 // If Confirm button was clicked (we are moving from confirmation step)
if (currentStep === steps.length) { // Reached Success step (Step 7)
// Here you would normally submit the form data
console.log("Form data submitted (simulation)");
showStep(currentStep); // Show success message
return false; // Stop navigation
}

 // If navigating beyond the last step somehow (shouldn't happen with above logic)
if (currentStep > steps.length) {
 return false;
}

showStep(currentStep);
}

function validateStep(n) {
let isValid = true;
const currentStepDiv = document.getElementById(`step-${n}`);
if (!currentStepDiv) return true; // Step doesn't exist
const inputs = currentStepDiv.querySelectorAll("input[required], textarea[required]");

// Clear previous errors within the current step
const errorMessages = currentStepDiv.querySelectorAll(".error-message");
errorMessages.forEach(msg => msg.remove());
const errorInputs = currentStepDiv.querySelectorAll("input.error, textarea.error");
errorInputs.forEach(inp => inp.classList.remove("error"));

inputs.forEach(input => {
if (!input.value.trim()) {
isValid = false;
input.classList.add("error");
displayError(input, "This field is required.");
}
// Add more specific validations based on input id or type
if (input.id === "confirmPassword") {
const password = document.getElementById("password").value;
if (input.value !== password) {
isValid = false;
input.classList.add("error");
displayError(input, "Passwords do not match.");
}
}
if (input.type === "email" && input.value && !/\S+@\S+\.\S+/.test(input.value)) {
 isValid = false;
 input.classList.add("error");
 displayError(input, "Please enter a valid email address.");
}
if (input.type === "tel" && input.value && !/^\d{10}$/.test(input.value)) { // Simple 10-digit phone validation
 isValid = false;
 input.classList.add("error");
 displayError(input, "Please enter a valid 10-digit phone number.");
}
 if (input.id === "ugCgpa" || input.id === "pgCgpa") {
 // Only validate if not empty (PG might be optional)
 if (input.value.trim()){
 const cgpa = parseFloat(input.value);
 if (isNaN(cgpa) || cgpa < 0 || cgpa > 10) {
  isValid = false;
  input.classList.add("error");
  displayError(input, "CGPA must be between 0 and 10.");
 }
 }
 }
 if (input.type === "date" && input.value && isNaN(new Date(input.value).getTime())) {
    isValid = false;
    input.classList.add("error");
    displayError(input, "Please enter a valid date.");
 }

});

// Radio button validation (Gender)
if (n === 2) { // Step 2 has gender radios
 const genderRadios = currentStepDiv.querySelectorAll('input[name="gender"]');
 let genderSelected = false;
 genderRadios.forEach(radio => { if (radio.checked) genderSelected = true; });
 if (!genderSelected) {
  isValid = false;
  // Display error near the radio group (find a suitable element)
  const firstRadioLabel = currentStepDiv.querySelector('label[for=male]'); // Example element
  if (firstRadioLabel && !currentStepDiv.querySelector('.gender-error')) { // Prevent duplicate errors
   const errorSpan = document.createElement("span");
   errorSpan.className = "error-message gender-error";
   errorSpan.textContent = "Please select a gender.";
   firstRadioLabel.parentNode.insertBefore(errorSpan, firstRadioLabel.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling); // Place after radios/labels
  }
 } else {
     // Remove error if it exists
     const genderError = currentStepDiv.querySelector('.gender-error');
     if (genderError) genderError.remove();
 }
}


return isValid;
}

function displayError(inputElement, message) {
// Check if an error message already exists for this input
if (!inputElement.parentNode.querySelector(`span.error-message[data-for='${inputElement.id}']`)) {
const errorSpan = document.createElement("span");
errorSpan.className = "error-message";
errorSpan.textContent = message;
errorSpan.setAttribute('data-for', inputElement.id); // Mark which input this error is for
inputElement.parentNode.insertBefore(errorSpan, inputElement.nextSibling);
}
}

function displayConfirmation() {
const detailsDiv = document.getElementById("confirmationDetails");
// Helper to get radio value
const getRadioValue = (name) => {
 const radios = document.getElementsByName(name);
 for (let i = 0; i < radios.length; i++) {
  if (radios[i].checked) return radios[i].value;
 }
 return 'Not selected';
};

// Gather all data - make sure IDs match your HTML
detailsDiv.innerHTML = `
<p><strong>Username:</strong> ${document.getElementById('username')?.value || 'N/A'}</p>
<hr>
<p><strong>First Name:</strong> ${document.getElementById('firstName')?.value || 'N/A'}</p>
<p><strong>Last Name:</strong> ${document.getElementById('lastName')?.value || 'N/A'}</p>
<p><strong>Gender:</strong> ${getRadioValue('gender')}</p>
<p><strong>Nationality:</strong> ${document.getElementById('nationality')?.value || 'N/A'}</p>
<p><strong>Date of Birth:</strong> ${document.getElementById('dob')?.value || 'N/A'}</p>
<hr>
<p><strong>Email:</strong> ${document.getElementById('email')?.value || 'N/A'}</p>
<p><strong>Phone:</strong> ${document.getElementById('phone')?.value || 'N/A'}</p>
<p><strong>Address:</strong> ${document.getElementById('address')?.value || 'N/A'}</p>
<hr>
<p><strong>Twitter:</strong> ${document.getElementById('twitter')?.value || 'N/A'}</p>
<p><strong>Facebook:</strong> ${document.getElementById('facebook')?.value || 'N/A'}</p>
<p><strong>Google:</strong> ${document.getElementById('google')?.value || 'N/A'}</p>
<hr>
<p><strong>UG CGPA:</strong> ${document.getElementById('ugCgpa')?.value || 'N/A'}</p>
<p><strong>PG CGPA:</strong> ${document.getElementById('pgCgpa')?.value || 'N/A'}</p>
<p><strong>Project 1:</strong> ${document.getElementById('project1Title')?.value || 'N/A'}</p>
<p><strong>Project 2:</strong> ${document.getElementById('project2Title')?.value || 'N/A'}</p>
<p><strong>Project 3:</strong> ${document.getElementById('project3Title')?.value || 'N/A'}</p>
`;
}