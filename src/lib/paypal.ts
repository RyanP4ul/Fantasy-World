const CLIENT_ID = "Ac_PtULrQRH6U2dHEA7lHMJ_wFGwX3HutVtdApQ63nFCvRZhTFvd5JhGabukzIG0fGpT8hJwMS9La9wR";
const CLIENT_SECRET = "ENybCmquj2Fk4DaL7Jzv4jAdAZHzBLIynmAjQqbh3MzOpcTaE6jCor7bEbkmot054Qjg3UrzsKQkM5cK";
const PAYPAL_API = "https://api.sandbox.paypal.com";

export async function getAccessToken() {
  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: "Basic " + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) throw new Error("Failed to get access token");
  const data = await response.json();
  return data.access_token as string;
}

export async function createPayment(accessToken: string, paymentData: any) {
  const response = await fetch(`${PAYPAL_API}/v1/payments/payment`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(paymentData),
  });

  const data = await response.json();
  const approvalUrl = data.links?.find((l: any) => l.rel === "approval_url")?.href;
  return approvalUrl || null;
}

export async function executePayment(accessToken: string, paymentId: string, payerId: string) {
  const response = await fetch(`${PAYPAL_API}/v1/payments/payment/${paymentId}/execute`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ payer_id: payerId }),
  });

  return await response.json();
}
