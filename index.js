const email = document.getElementById("email");
const signUp = document.getElementById("sign-up");

signUp.addEventListener("click", sign);

async function sign() {
  const publicCredentail = await navigator.credentials.create({
    publicKey: {
      challenge: new Uint8Array([0, 1, 2, 3, 4, 5, 6]),
      rp: { name: "Zain Shah" },
      user: {
        id: new Uint8Array(16),
        name: email.value,
        displayName: "",
      },
      pubKeyCredParams: [
        {
          type: "public-key",
          alg: -7,
        },
        {
          type: "public-key",
          alg: -8,
        },
        {
          type: "public-key",
          alg: -257,
        },
      ],
    },
  });
  console.log(publicCredentail);
}
