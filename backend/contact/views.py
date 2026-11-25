from django.db import connection
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import ContactMessage
from .serializers import ContactSubmissionSerializer
from .services import send_contact_emails
from .throttles import ContactIPThrottle


class HealthCheckView(APIView):
    """Lightweight health check endpoint for uptime monitors and Render."""

    authentication_classes = []
    permission_classes = []

    def get(self, request):
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
            db_status = "ok"
        except Exception:
            return Response(
                {"status": "error", "database": "unavailable"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        return Response({"status": "ok", "database": db_status}, status=status.HTTP_200_OK)


class ContactCreateView(APIView):
    """Accepts portfolio contact submissions, stores them, and emails via Resend."""

    # Token-less public API without SessionAuthentication avoids CSRF cookie exposure.
    authentication_classes = []
    permission_classes = []
    throttle_classes = [ContactIPThrottle]

    def post(self, request):
        raw_honeypot = request.data.get("website") if isinstance(request.data, dict) else ""
        if isinstance(raw_honeypot, str) and raw_honeypot.strip():
            return Response(
                {"status": "ok", "message": "Thank you! Your message has been received."},
                status=status.HTTP_200_OK,
            )

        serializer = ContactSubmissionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        if data.get("website", "").strip():
            return Response(
                {"status": "ok", "message": "Thank you! Your message has been received."},
                status=status.HTTP_200_OK,
            )

        submission = ContactMessage.objects.create(
            name=data["name"],
            email=data["email"],
            subject=data["subject"],
            message=data["message"],
        )

        email_sent, error_text = send_contact_emails(submission)
        submission.email_sent = email_sent
        submission.error_text = error_text[:1000] if error_text else ""
        submission.save(update_fields=["email_sent", "error_text"])

        if email_sent:
            return Response(
                {
                    "status": "sent",
                    "message": "Thanks for reaching out! Your message has been sent.",
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            {
                "status": "saved",
                "message": "Your message has been saved, though email notification is temporarily delayed.",
            },
            status=status.HTTP_202_ACCEPTED,
        )
