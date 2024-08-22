import "./style.css";
const emailInput = document.querySelector("[data-email]");
const signupButton = document.querySelector("[data-signup]");
const loginInput = document.querySelector("[data-login]");
const modal = document.querySelector("[data-modal]");
const closeModalButton = document.querySelector("[data-close]");
import { startRegistration } from "@simplewebauthn/browser";

const SERVER_URL = "http://localhost:3000";

signupButton.addEventListener("click", signUp);
closeModalButton.addEventListener("click", closeModal);

function showModalText(text) {
  modal.querySelector("[data-content]").innerHTML = text;
  modal.showModal();
}

async function signUp() {
  const email = emailInput.value;
  // get challenge from the server
  const initResponse = await fetch(
    `${SERVER_URL}/init-sign-up?email=${email}`,
    {
      credentials: "include",
    }
  );
  
  const options = await initResponse.json();
  console.log(options);

  if (!initResponse.ok) {
    showModalText(options.error);
  }
  // create passkeys
  const registrationResponse = await startRegistration(options);

  // Save passkey into Db
  const verifyResponse = await fetch(`${SERVER_URL}/verify-regitration`, {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(registrationResponse),
  });

  const verifyData = await verifyResponse.json();

  if (!verifyResponse.ok) {
    showModalText(verifyData.error);
  }

  if (verifyData.verified) {
    showModalText(`Registered Successfully ${email}`);
  } else {
    showModalText(`Failed to register`);
  }
}

function closeModal() {
  modal.close();
}
