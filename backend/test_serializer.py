import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from analytics.serializers import QuizAttemptSerializer
from analytics.models import QuizAttempt

# Get any existing attempt
attempt = QuizAttempt.objects.first()
if attempt:
    data = QuizAttemptSerializer(attempt).data
    print("Serialized quiz field:", data['quiz'])
    print("Type of quiz field:", type(data['quiz']))
else:
    print("No attempts found.")
