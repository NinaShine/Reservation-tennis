const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const path = require("path");

const { readBookings, addBooking } = require('./storage');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: String(process.env.SMTP_SECURE || "false") === "true",
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});

transporter.verify().then(
  () => console.log("SMTP prêt ✅"),
  (err) => console.warn("SMTP non vérifié ❗", err?.message)
);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.post("/api/send-confirmation", async (req, res) => {
  try {
    const { playerName, playerEmail, playerPhone, courtName, coachName, dateISO, timeSlot, duration, bookingId } = req.body || {};
    if (!playerEmail || !playerName || !dateISO || !timeSlot || !bookingId) {
      return res.status(400).json({ ok: false, message: "Champs manquants." });
    }

    const subject = `M.B.B — Confirmation réservation ${bookingId}`;
    const logoPath = path.join(__dirname, "assets", "mbb-logo.png"); // mets le fichier ici

    const html = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto;line-height:1.5">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
          <img src="cid:mbbLogo" alt="M.B.B" style="height:40px"/>
          <div>
            <div style="font-weight:600;color:#111827">M.B.B</div>
            <div style="font-size:12px;color:#6b7280">Mechaal Baladiat Bejaia</div>
          </div>
        </div>
        <h2>🎾 Réservation confirmée</h2>
        <p>Bonjour <strong>${escapeHtml(playerName)}</strong>,</p>
        <p>Votre réservation a bien été enregistrée.</p>
        <table style="border-collapse:collapse;margin:12px 0">
          <tr><td style="padding:4px 8px">Référence</td><td><strong>${escapeHtml(bookingId)}</strong></td></tr>
          <tr><td style="padding:4px 8px">Terrain</td><td>${escapeHtml(courtName || "—")}</td></tr>
          ${coachName ? `<tr><td style="padding:4px 8px">Coach</td><td>${escapeHtml(coachName)}</td></tr>` : ""}
          <tr><td style="padding:4px 8px">Date</td><td>${escapeHtml(dateISO)}</td></tr>
          <tr><td style="padding:4px 8px">Heure</td><td>${escapeHtml(timeSlot)} (${duration || 1}h)</td></tr>
        </table>
        <p>Tel indiqué : ${escapeHtml(playerPhone || "—")}</p>
        <p>À bientôt !</p>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to: playerEmail,
      subject,
      html,
      attachments: [
        {
          filename: "mbb-logo.png",
          path: logoPath,
          cid: "mbbLogo"
        }
      ]
    });

    res.json({ ok: true });
  } catch (err) {
    console.error("send-confirmation error:", err);
    res.status(500).json({ ok: false, message: "Erreur serveur" });
  }
});

function escapeHtml(str) {
  return String(str).replace(/[&<>'"]/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  }[c]));
}

// Liste complète des réservations (admin)
app.get('/api/bookings', async (_req, res) => {
    try {
      const list = await readBookings();
      res.json({ ok: true, items: list });
    } catch (e) {
      console.error('readBookings error:', e);
      res.status(500).json({ ok: false, message: 'Erreur lecture réservations' });
    }
  });
  
  // Création/Enregistrement d'une réservation (après vérif côté front)
  app.post('/api/bookings', async (req, res) => {
    try {
      const {
        id, date, timeSlot, duration,
        courtId, courtName,
        coachId, coachName,
        playerName, playerEmail, playerPhone
      } = req.body || {};
  
      if (!id || !date || !timeSlot || !courtId || !playerName || !playerEmail) {
        return res.status(400).json({ ok: false, message: 'Champs requis manquants.' });
      }
  
      const payload = {
        id, date, timeSlot, duration: duration ?? 1,
        courtId, courtName: courtName || null,
        coachId: coachId || null, coachName: coachName || null,
        playerName, playerEmail, playerPhone: playerPhone || null,
        createdAt: new Date().toISOString()
      };
  
      await addBooking(payload);
      res.json({ ok: true, item: payload });
    } catch (e) {
      console.error('addBooking error:', e);
      res.status(500).json({ ok: false, message: 'Erreur enregistrement réservation' });
    }
  });

const PORT = Number(process.env.PORT || 5174);
app.listen(PORT, () => console.log(`API en écoute sur http://localhost:${PORT}`));
