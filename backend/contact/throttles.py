from rest_framework.throttling import SimpleRateThrottle


class ContactIPThrottle(SimpleRateThrottle):
    """Rate-limits contact form submissions per client IP address."""

    scope = "contact"

    def get_cache_key(self, request, view):
        ident = self.get_ident(request)
        if not ident:
            return None
        return self.cache_format % {
            "scope": self.scope,
            "ident": ident,
        }
