from django.db import models
from django.conf import settings
from quizzes.models import Quiz, Question

class QuizAttempt(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='attempts')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='quiz_attempts')
    score = models.IntegerField(default=0)
    total_questions = models.IntegerField()
    attempt_timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.quiz.topic} ({self.score}/{self.total_questions})"

class UserAnswer(models.Model):
    attempt = models.ForeignKey(QuizAttempt, on_delete=models.CASCADE, related_name='answers')
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    selected_option = models.CharField(max_length=1)  # A, B, C, or D
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.attempt.user.username} - {self.question.question_text[:20]}"
