# South Lofts — Booking Form

Phase 1: an HTML/CSS replica of the PDF booking form, rendered by Node/Express
from JSON. Phase 2 will swap the JSON for live Bitrix24 data and compute the
installment amounts.

## Run

```bash
npm install
npm start
# open http://localhost:3000
```

To see it without running anything, open `preview-standalone.html` in a browser
(CSS is inlined into that file).

## Project layout

```
data/static.json     Static data — same for every booking (vendor, project,
                     terms, bank accounts, note/warning, brand text).
data/booking.json    Dynamic data — changes per booking. TODAY hard-coded from
                     the sample PDF. LATER fed from Bitrix24.
views/booking.ejs    The form template (all 5 pages).
public/styles.css    Styling — A4 / print-ready.
server.js            Loads JSON, renders the form, computes discount + net payable.
```

## Static vs dynamic split (current assumption)

DYNAMIC (per booking → from Bitrix24): booking no, date, building, unit, type,
total area, purchase price, deposit, discount %, all Purchaser 1 / 2 fields,
agency info.

STATIC (project config → not from Bitrix24): vendor, project, location, the
note & warning, all 20 terms & conditions, both bank-account blocks, brand text.

If any field is on the wrong side, move it between `static.json` and
`booking.json` — no template changes needed.

## Bitrix24 field IDs

`booking.json` has a `bitrixFieldMap` block with `UF_CRM_XXXX` placeholders.
Fill those with the real field IDs when you share them; phase 2 will read each
dynamic value from its mapped Bitrix24 field instead of from the static JSON.

## Notes / things flagged for you

- The source PDF prints amounts with the Rupee sign (Rs / Rupees). That looks
  like a number-format bug. This build shows plain AED-formatted numbers
  (`170,810.55`) under an "AMOUNT (AED)" header. Tell me if you want a symbol/prefix.
- Logos are recreated as text (no image files supplied). Drop in the real
  Premier Choice / Southlofts assets when you have them.
- Installment row amounts currently come from `booking.json`. Phase 2 computes
  them. Observed rule from the sample: installments = % of NET PAYABLE,
  DLD fee = 4% of PURCHASE PRICE, admin fee = flat. Net payable = price - discount.
```
