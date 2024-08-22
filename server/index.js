import express from "express";
import cors from "cors";
import { CLIENT_URL, RP_ID } from "./constant/constant.js";
import cookieParser from "cookie-parser";
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";
import { createUser, getUserByEmail } from "./db/db.js";

const app = express();

// application middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: CLIENT_URL, credentials: true }));

app.get("/init-sign-up", async (req, res) => {
  const email = req.query.email;

  if (!email) {
    return res.status(400).json({ error: "Email is Required" });
  }

  const options = await generateRegistrationOptions({
    rpID: RP_ID,
    rpName: "Zain Shah",
    userName: email,
  });

  res.cookie(
    "regInfo",
    JSON.stringify({
      userId: options.user.id,
      email,
      challenge: options.challenge,
    }),
    {
      httpOnly: true,
      maxAge: 60000,
      secure: true,
    }
  );

  res.status(200).json(options);
});

app.post("/verify-regitration", async (req, res) => {
  console.log(req.body.transports);

  const regInfo = JSON.parse(req.cookies.regInfo);
  if (!regInfo) {
    return res.status(400).json({ error: "Registration detail not fount" });
  }
  const verification = await verifyRegistrationResponse({
    response: req.body,
    expectedChallenge: regInfo.challenge,
    expectedOrigin: CLIENT_URL,
    expectedRPID: RP_ID,
  });
  
  console.log(getUserByEmail(regInfo.email));

  if (verification.verified) {
    createUser(regInfo.userId, regInfo.email, {
      id: verification.registrationInfo.credentialID,
      publicKey: verification.registrationInfo.credentialPublicKey,
      counter: verification.registrationInfo.counter,
      deviceType: verification.registrationInfo.credentialDeviceType,
      backedUp: verification.registrationInfo.credentialBackedUp,
      transport: req.body.transports,
    });
    res.clearCookie("regInfo");
    return res.status(200).json({ verified: verification.verified });
  } else {
    return res
      .status(400)
      .json({ verified: false, error: "Verification Failed" });
  }
});
app.listen(3000, () => {
  console.log(`server is running`);
});
