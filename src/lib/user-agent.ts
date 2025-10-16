export default function getDeviceType(request: Request): "Windows" | "Mobile" | "Air" | "Unknown" {
  const userAgent = request.headers.get("user-agent") || "";

  if (/Windows/i.test(userAgent)) {
    return "Windows";
  } else if (/Mobile|Android|iPhone|iPad/i.test(userAgent)) {
    return "Mobile";
  } else if (/AdobeAIR/i.test(userAgent)) {
    return "Air";
  }

  return "Unknown";
}