export async function GET(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "0.0.0.0";

  const res = await fetch(
    `http://ip-api.com/json/${ip}?fields=status,message,query,isp,org,as,hosting,proxy`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    }
  );

  const geoData = await res.json();

  return Response.json(geoData);
}
