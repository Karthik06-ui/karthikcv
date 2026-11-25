import re

from django.utils.html import strip_tags
from rest_framework import serializers


def _sanitize_text(value: str, preserve_newlines: bool = False) -> str:
    """Strip HTML tags and normalize whitespace."""
    cleaned = strip_tags(value or "").strip()
    if preserve_newlines:
        lines = [re.sub(r"[ \t]+", " ", line).strip() for line in cleaned.splitlines()]
        cleaned = "\n".join(lines).strip()
        cleaned = re.sub(r"\n{3,}", "\n\n", cleaned)
    else:
        cleaned = re.sub(r"\s+", " ", cleaned).strip()
    return cleaned


class ContactSubmissionSerializer(serializers.Serializer):
    """Validates and sanitizes incoming portfolio contact messages."""

    name = serializers.CharField(max_length=120, trim_whitespace=True)
    email = serializers.EmailField(max_length=254, trim_whitespace=True)
    subject = serializers.CharField(
        max_length=150,
        required=False,
        allow_blank=True,
        default="",
        trim_whitespace=True,
    )
    message = serializers.CharField(max_length=4000, trim_whitespace=True)
    website = serializers.CharField(
        max_length=200,
        required=False,
        allow_blank=True,
        default="",
    )

    def validate_name(self, value: str) -> str:
        cleaned = _sanitize_text(value)
        if len(cleaned) < 2:
            raise serializers.ValidationError("Please enter your name (at least 2 characters).")
        if len(cleaned) > 120:
            raise serializers.ValidationError("Name must be 120 characters or fewer.")
        return cleaned

    def validate_subject(self, value: str) -> str:
        cleaned = _sanitize_text(value)
        if len(cleaned) > 150:
            raise serializers.ValidationError("Subject must be 150 characters or fewer.")
        return cleaned

    def validate_message(self, value: str) -> str:
        cleaned = _sanitize_text(value, preserve_newlines=True)
        if len(cleaned) < 10:
            raise serializers.ValidationError("Message must be at least 10 characters.")
        if len(cleaned) > 2000:
            raise serializers.ValidationError("Message must be 2000 characters or fewer.")
        return cleaned
