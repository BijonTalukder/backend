export function getClientIp(req) {
  const xff = req.headers["x-forwarded-for"];
  if (xff) {
    return xff.split(",")[0].trim();
  }

  if (req.ip) return req.ip;

  
  return (
    req.socket?.remoteAddress ||
    req.connection?.remoteAddress ||
    null
  );
}