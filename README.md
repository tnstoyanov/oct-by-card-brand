# Card Brand Refund/OCT Config — Mockup

Static, dependency-free HTML/CSS/JS mockup of the "Configure by Card Brand" feature
for Credit Card Gateway Accounts. Built to demo the business logic before this gets
built for real — nothing here talks to a backend, all state is in-memory.

## Run it
Just open `index.html` in a browser. No build step, no server needed.

## Files
- `index.html` — markup
- `styles.css` — all styling
- `script.js` — interaction logic (switching settings modes, searching and
  adding/removing brands, and status toasts)

## What it demonstrates
- The Refund Settings section has two mutually exclusive modes:
  - **Configure by Card Brand off (global settings):** four checkboxes set
    Automatic Refund, Automatic OCT, Manual Refund, and Manual OCT once for the
    gateway account. The same choices apply across card brands.
  - **Configure by Card Brand on (per-brand settings):** the global checkboxes
    are replaced by a table where those same four capabilities can be enabled
    separately for each card brand. OCT is also labelled "Payout" in the table.
- Visa and Mastercard are present by default in per-brand mode. Other brands
  can be added; each row starts with Manual Refund and Manual OCT enabled and
  Automatic Refund and Automatic OCT disabled.
- The global checkboxes initially have the same defaults: manual options on
  and automatic options off.
- In this mockup, switching back to global mode resets the global and per-brand
  checkboxes to those defaults. Per-brand choices are therefore not preserved
  when switching modes.
- Visa and Mastercard cannot be removed. Other brands can be searched for,
  added, and removed directly from the table.
- The Save button is visual only in this static mockup; changes are not
  persisted.

See the accompanying requirement doc for the full business rules and open questions.
