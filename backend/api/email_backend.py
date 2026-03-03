import resend
from django.core.mail.backends.base import BaseEmailBackend
from django.conf import settings
from django.core.mail import EmailMessage, EmailMultiAlternatives
import logging

logger = logging.getLogger(__name__)

class ResendBackend(BaseEmailBackend):
    def __init__(self, fail_silently=False, **kwargs):
        super().__init__(fail_silently=fail_silently, **kwargs)
        resend.api_key = getattr(settings, 'RESEND_API_KEY', None)

    def send_messages(self, email_messages):
        if not email_messages:
            return 0

        count = 0
        for message in email_messages:
            if self._send(message):
                count += 1
        return count

    def _send(self, email_message):
        try:
            params = {
                "from": email_message.from_email or settings.DEFAULT_FROM_EMAIL,
                "to": email_message.to,
                "subject": email_message.subject,
                "text": email_message.body,
            }

            if isinstance(email_message, EmailMultiAlternatives):
                for content, mimetype in email_message.alternatives:
                    if mimetype == 'text/html':
                        params["html"] = content
                        break
            elif hasattr(email_message, 'content_subtype') and email_message.content_subtype == 'html':
                params["html"] = email_message.body

            # Resend expects 'to' as a list of strings or a single string
            # Django's email_message.to is already a list

            resend.Emails.send(params)
            return True
        except Exception as e:
            logger.error(f"Resend email sending failed: {e}")
            if not self.fail_silently:
                raise
            return False
