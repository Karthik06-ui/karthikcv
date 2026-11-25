# Resend Email Setup Guide

This portfolio sends contact-form notifications exclusively from the Django backend using the official [`resend`](https://github.com/resend/resend-python) Python SDK. No Resend API key is ever exposed to the frontend.

---

## 1. Account & API Key Setup

1. Create a free account at [resend.com](https://resend.com).
2. In the Resend dashboard, open **API Keys** -> **Create API Key**.
3. Give it a name (for example `portfolio-backend`), choose **Sending access**, and copy the key (`re_...`).
4. Add it to `backend/.env` (locally) and to your Render environment variables (in production):

```env
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=Portfolio <onboarding@resend.dev>
CONTACT_RECEIVER_EMAIL=your-resend-signup-email@example.com
AUTO_REPLY_ENABLED=False
```

---

## 2. Domain Rules: Sandbox vs. Verified Domain

- **Without a verified domain (default):**
  - Resend only allows sending **from** `onboarding@resend.dev`.
  - Resend only allows sending **to** the email address you used to sign up for your Resend account.
  - This works out of the box for a personal portfolio contact form, because all messages go directly to your own inbox (`CONTACT_RECEIVER_EMAIL`), with `reply_to` set to the visitor's email so you can reply normally.
  - Keep `AUTO_REPLY_ENABLED=False` while using `onboarding@resend.dev`, because auto-replies go to visitors' email addresses.

- **With a verified custom domain:**
  1. In Resend, go to **Domains** -> **Add Domain** and enter your domain (e.g. `mydomain.com` or `mail.mydomain.com`).
  2. Add the DNS records (`SPF`, `DKIM`, and optional `DMARC`) shown by Resend at your DNS provider.
  3. Wait for status **Verified** in the Resend dashboard.
  4. Update `RESEND_FROM_EMAIL` to your domain address (e.g. `Karthik S <contact@mydomain.com>`).
  5. Optionally set `AUTO_REPLY_ENABLED=True` so visitors also receive a short confirmation email.

---

## 3. Minimal Python SDK Verification

Activate the backend virtual environment and run a quick check with Python:

```bash
cd backend
# Windows PowerShell: .\.venv\Scripts\Activate.ps1
# macOS/Linux: source .venv/bin/activate

python -c "
import os, resend
resend.api_key = os.environ['RESEND_API_KEY']
res = resend.Emails.send({
    'from': 'Portfolio <onboarding@resend.dev>',
    'to': [os.environ['CONTACT_RECEIVER_EMAIL']],
    'subject': 'Resend SDK smoke test',
    'html': '<p>Resend SDK is configured correctly.</p>',
})
print(res)
"
```

---

## 4. Test via the Django Contact Endpoint (`curl`)

With the Django backend running locally (`http://127.0.0.1:8000`):

```bash
curl -X POST http://127.0.0.1:8000/api/contact/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Visitor",
    "email": "visitor@example.com",
    "subject": "Quick hello",
    "message": "Testing the portfolio contact endpoint end-to-end."
  }'
```

Expected response when Resend succeeds (`201 Created`):

```json
{"status":"sent","message":"Thanks for reaching out! Your message has been sent."}
```

---

## 5. Checking Logs & Common Errors

In the Resend dashboard, open **Emails** (and **Logs**) to inspect delivery status, bounces, and request payloads.

| HTTP Code | Cause | Fix |
| --- | --- | --- |
| `401` | Invalid or missing `RESEND_API_KEY` | Verify the key starts with `re_` and has no extra quotes or spaces in `.env` / Render. |
| `403` | Domain or recipient restriction | Without a verified domain, `from` must be `onboarding@resend.dev` and `to` (`CONTACT_RECEIVER_EMAIL`) must match your Resend signup email. |
| `422` | Payload validation failure | Check that `RESEND_FROM_EMAIL` is formatted as `Name <email@domain>` or a valid email, and `reply_to` is a valid email. |
| `429` | Rate limit exceeded | Resend free-tier or per-second rate limit hit; wait briefly before retrying. (Note: the Django endpoint also enforces `5/hour` per IP.) |

If Resend returns any error in production, the Django backend still saves the submission in `ContactMessage` (`email_sent=False`, `error_text` recorded in Django Admin) and returns a friendly `202 Accepted` response without leaking internal errors.
