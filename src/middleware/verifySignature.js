const crypto = require("crypto");

function verifySignature(req, res, next) {
  const signature = req.headers["x-signature"];
  console.log("Received signature:", signature);
  if (!signature) {
    return res.status(400).json({ message: "Missing signature" });
  }
  const secret = "key123";

 const bodyString = req.method === "GET" ? "" : JSON.stringify(req.body || {});
   const expected = crypto.createHmac("sha256", secret)
    .update(bodyString)
    .digest("hex");
    console.log("Expected signature:", expected);

  if (signature !== expected) {
    return res.status(401).json({ message: "Invalid signature" });
  }

  next();
}

module.exports = verifySignature;
