from django.db import models


class ContactMessage(models.Model):
    """Stores every portfolio contact form submission as a durable backup."""

    name = models.CharField(max_length=120)
    email = models.EmailField()
    subject = models.CharField(max_length=150, blank=True)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    email_sent = models.BooleanField(default=False)
    error_text = models.TextField(blank=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Contact Message"
        verbose_name_plural = "Contact Messages"

    def __str__(self) -> str:
        label = self.subject or "(No subject)"
        return f"{self.name} <{self.email}> — {label}"
