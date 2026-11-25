from unittest.mock import patch

from django.core.cache import cache
from django.test import override_settings
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import ContactMessage


@override_settings(
    RESEND_API_KEY="re_test_key",
    RESEND_FROM_EMAIL="Portfolio <onboarding@resend.dev>",
    CONTACT_RECEIVER_EMAIL="owner@example.com",
    AUTO_REPLY_ENABLED=False,
)
class ContactAPITests(APITestCase):
    def setUp(self):
        cache.clear()
        self.contact_url = reverse("api-contact")
        self.health_url = reverse("api-health")
        self.valid_payload = {
            "name": "Ada Lovelace",
            "email": "ada@example.com",
            "subject": "Backend Internship",
            "message": "Hello Karthik, I enjoyed reading about SatSaathi and Re-EMS.",
            "website": "",
        }

    def tearDown(self):
        cache.clear()

    def test_health_endpoint(self):
        response = self.client.get(self.health_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), {"status": "ok", "database": "ok"})

    @patch("contact.services.resend.Emails.send")
    def test_valid_submission_saves_and_sends_email(self, mock_send):
        payload = {
            "name": "<b>Ada</b> Lovelace",
            "email": "ada@example.com",
            "subject": "<script>alert(1)</script>Hello",
            "message": "Hi Karthik, <script>bad()</script> let us connect about an internship!",
            "website": "",
        }
        response = self.client.post(self.contact_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.json()["status"], "sent")
        self.assertEqual(ContactMessage.objects.count(), 1)

        record = ContactMessage.objects.first()
        self.assertEqual(record.name, "Ada Lovelace")
        self.assertEqual(record.subject, "alert(1)Hello")
        self.assertNotIn("<script>", record.message)
        self.assertTrue(record.email_sent)
        self.assertEqual(record.error_text, "")

        mock_send.assert_called_once()
        sent_params = mock_send.call_args[0][0]
        self.assertEqual(sent_params["to"], ["owner@example.com"])
        self.assertEqual(sent_params["reply_to"], "ada@example.com")
        self.assertEqual(sent_params["from"], "Portfolio <onboarding@resend.dev>")
        self.assertEqual(sent_params["subject"], "New portfolio message: alert(1)Hello")

    @patch("contact.services.resend.Emails.send")
    def test_invalid_inputs_rejected(self, mock_send):
        bad_payloads = [
            {"name": "", "email": "ada@example.com", "message": "Valid message length here."},
            {"name": "Ada", "email": "not-an-email", "message": "Valid message length here."},
            {"name": "Ada", "email": "ada@example.com", "message": "Too short"},
            {"name": "Ada", "email": "ada@example.com", "message": "<b>hi</b>"},
            {"name": "Ada", "email": "ada@example.com", "message": "x" * 2001},
        ]
        for payload in bad_payloads:
            response = self.client.post(self.contact_url, payload, format="json")
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.assertEqual(ContactMessage.objects.count(), 0)
        mock_send.assert_not_called()

    @patch("contact.services.resend.Emails.send")
    def test_honeypot_silently_rejected(self, mock_send):
        payload = {**self.valid_payload, "website": "https://spam.example.com"}
        response = self.client.post(self.contact_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(ContactMessage.objects.count(), 0)
        mock_send.assert_not_called()

    @patch("contact.services.resend.Emails.send")
    def test_rate_limit_blocks_sixth_submission_from_same_ip(self, mock_send):
        for i in range(5):
            response = self.client.post(
                self.contact_url,
                {**self.valid_payload, "subject": f"Ping {i}"},
                format="json",
                REMOTE_ADDR="203.0.113.10",
            )
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        blocked = self.client.post(
            self.contact_url,
            self.valid_payload,
            format="json",
            REMOTE_ADDR="203.0.113.10",
        )
        self.assertEqual(blocked.status_code, status.HTTP_429_TOO_MANY_REQUESTS)
        self.assertEqual(ContactMessage.objects.count(), 5)
        self.assertEqual(mock_send.call_count, 5)

    @patch("contact.services.resend.Emails.send", side_effect=RuntimeError("Resend secret stack error"))
    def test_resend_failure_still_saves_message_and_hides_internals(self, mock_send):
        response = self.client.post(self.contact_url, self.valid_payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)
        body = response.json()
        self.assertEqual(body["status"], "saved")
        self.assertNotIn("Resend secret stack error", body["message"])

        self.assertEqual(ContactMessage.objects.count(), 1)
        record = ContactMessage.objects.first()
        self.assertFalse(record.email_sent)
        self.assertIn("Resend secret stack error", record.error_text)
        mock_send.assert_called_once()

    @override_settings(AUTO_REPLY_ENABLED=True)
    @patch("contact.services.resend.Emails.send")
    def test_auto_reply_sent_when_enabled(self, mock_send):
        response = self.client.post(self.contact_url, self.valid_payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(mock_send.call_count, 2)
        auto_reply_args = mock_send.call_args_list[1][0][0]
        self.assertEqual(auto_reply_args["to"], ["ada@example.com"])
