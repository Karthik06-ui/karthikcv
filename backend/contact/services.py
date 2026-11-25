import html
import logging

import resend
from django.conf import settings
from django.utils import timezone

from .models import ContactMessage

logger = logging.getLogger(__name__)


def send_contact_emails(submission: ContactMessage) -> tuple[bool, str]:
    """Send contact notification email via Resend SDK and optional auto-reply.

    Returns (email_sent, error_text). Never raises so DB backup persists.
    """
    api_key = getattr(settings, "RESEND_API_KEY", "").strip()
    receiver = getattr(settings, "CONTACT_RECEIVER_EMAIL", "").strip()
    sender = getattr(settings, "RESEND_FROM_EMAIL", "Portfolio <onboarding@resend.dev>").strip()

    if not api_key or not receiver:
        msg = "RESEND_API_KEY or CONTACT_RECEIVER_EMAIL is not configured."
        logger.warning(msg)
        return False, msg

    resend.api_key = api_key

    local_ts = timezone.localtime(submission.created_at).strftime("%Y-%m-%d %H:%M:%S %Z")
    subject_line = f"New portfolio message: {submission.subject or submission.name}"

    safe_name = html.escape(submission.name)
    safe_email = html.escape(submission.email)
    safe_subject = html.escape(submission.subject or "(No subject)")
    safe_message = html.escape(submission.message).replace("\n", "<br>")
    safe_ts = html.escape(local_ts)

    html_body = (
        "<div style=\"font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; "
        "line-height: 1.6; color: #111827;\">"
        "<h2 style=\"margin-bottom: 12px;\">New Portfolio Contact Message</h2>"
        f"<p><strong>Name:</strong> {safe_name}</p>"
        f"<p><strong>Email:</strong> {safe_email}</p>"
        f"<p><strong>Subject:</strong> {safe_subject}</p>"
        f"<p><strong>Received:</strong> {safe_ts}</p>"
        "<hr style=\"border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;\">"
        f"<p>{safe_message}</p>"
        "</div>"
    )

    text_body = (
        "New Portfolio Contact Message\n"
        "-----------------------------\n"
        f"Name: {submission.name}\n"
        f"Email: {submission.email}\n"
        f"Subject: {submission.subject or '(No subject)'}\n"
        f"Received: {local_ts}\n\n"
        f"{submission.message}\n"
    )

    try:
        resend.Emails.send(
            {
                "from": sender,
                "to": [receiver],
                "reply_to": submission.email,
                "subject": subject_line,
                "html": html_body,
                "text": text_body,
            }
        )
    except Exception as exc:
        logger.exception("Failed to send contact email via Resend.")
        return False, str(exc)

    if getattr(settings, "AUTO_REPLY_ENABLED", False):
        try:
            resend.Emails.send(
                {
                    "from": sender,
                    "to": [submission.email],
                    "subject": "Thanks for reaching out — Karthik S",
                    "html": (
                        f"<p>Hi {safe_name},</p>"
                        "<p>Thanks for reaching out via my portfolio. "
                        "I have received your message and will get back to you soon.</p>"
                        "<p>Best regards,<br>Karthik S</p>"
                    ),
                    "text": (
                        f"Hi {submission.name},\n\n"
                        "Thanks for reaching out via my portfolio. "
                        "I have received your message and will get back to you soon.\n\n"
                        "Best regards,\nKarthik S\n"
                    ),
                }
            )
        except Exception:
            logger.warning("Auto-reply email failed for submission %s", submission.pk, exc_info=True)

    return True, ""
