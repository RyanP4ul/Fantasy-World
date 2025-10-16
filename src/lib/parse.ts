export async function parseFlashUrlencoded(req: Request): Promise<any | null> {
  const contentType = req.headers.get("content-type") || "";

  if (!contentType.includes("application/x-www-form-urlencoded")) {
    return null;
  }

  const text = await req.text();

  return Object.fromEntries(new URLSearchParams(text));
}
