import { getAuth } from "firebase-admin/auth";
import { getAdminDb } from "../lib/firebaseAdmin";

async function main() {
  getAdminDb();
  const token = await getAuth().createCustomToken("demo-sites-smoke-test");
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY!.replace(/^"|"$/g, "");
  const authRes = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, returnSecureToken: true }),
    }
  );
  const auth = await authRes.json();
  const res = await fetch("http://127.0.0.1:3000/api/claim/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth.idToken}`,
    },
    body: JSON.stringify({ siteId: "scott" }),
  });
  console.log("status", res.status);
  console.log(await res.text());
}

main();
