/**
 * South Lofts — Booking Form server
 */

const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

function loadJson(file) {
  const raw = fs.readFileSync(path.join(__dirname, "data", file), "utf-8");
  return JSON.parse(raw);
}

function money(n) {
  if (n === "" || n === null || n === undefined) return "";
  const num = typeof n === "string" ? parseFloat(n.replace(/,/g, "")) : n;
  if (Number.isNaN(num)) return n;
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function computePlan(d) {
  const price = Number(d.purchasePrice) || 0;
  const discountPct = Number(d.discountPercentage) || 0;
  const discountValue = +(price * (discountPct / 100)).toFixed(2);
  const netPayable = +(price - discountValue).toFixed(2);
  return { discountValue, netPayable };
}

app.get("/", (req, res) => {
  const s = loadJson("static.json");
  const d = loadJson("booking.json");
  const plan = computePlan(d);
  res.render("booking", { s, d, plan, money });
});

app.listen(PORT, () => {
  console.log(`Booking form running at http://localhost:${PORT}`);
});

module.exports = { app, computePlan, money };
