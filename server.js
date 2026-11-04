const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { parsePhoneNumberFromString } = require("libphonenumber-js");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      mediaSrc: ["'self'", "https:"],
      connectSrc: ["'self'"]
    }
  }
}));
app.use(express.json({ limit: "10kb" }));
app.use(express.static("public"));

const checkLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Trop de vérifications en peu de temps. Réessaie dans une minute." }
});

app.post("/api/check", checkLimiter, (req, res) => {
  const raw = String(req.body?.phone || "").trim();
  const country = String(req.body?.country || "CI").toUpperCase();

  if (!raw || raw.length > 40) {
    return res.status(400).json({ error: "Entre un numéro de téléphone valide." });
  }

  const parsed = parsePhoneNumberFromString(raw, country);
  if (!parsed || !parsed.isPossible()) {
    return res.status(400).json({
      error: "Le numéro semble incomplet ou invalide. Vérifie l'indicatif et les chiffres."
    });
  }

  // WhatsApp ne fournit pas d'API publique permettant de lire le statut
  // de bannissement d'un numéro arbitraire. Ne jamais inventer ce résultat.
  return res.json({
    status: "UNKNOWN",
    label: "IMPOSSIBLE À VÉRIFIER",
    number: parsed.formatInternational(),
    valid: parsed.isValid(),
    message: "Le format du numéro est reconnu, mais WhatsApp ne donne pas publiquement son statut de bannissement."
  });
});

app.get("/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`VORAX WHATSAPP CHECKER lancé sur le port ${PORT}`);
});