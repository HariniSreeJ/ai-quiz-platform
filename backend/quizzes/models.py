from django.db import models
from django.conf import settings

class Quiz(models.Model):
    topic = models.CharField(max_length=255)
    difficulty_level = models.CharField(max_length=50)
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_quizzes')
    creation_timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.topic} ({self.difficulty_level})"


class Question(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='questions')
    question_text = models.TextField()
    option_a = models.CharField(max_length=255)
    option_b = models.CharField(max_length=255)
    option_c = models.CharField(max_length=255)
    option_d = models.CharField(max_length=255)
    correct_option = models.CharField(max_length=1)  # A, B, C, or D
    explanation = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.question_text
