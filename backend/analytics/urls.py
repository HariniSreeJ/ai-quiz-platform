from django.urls import path
from .views import SubmitAttemptView, UserPerformanceView, QuizAttemptDetailView

urlpatterns = [
    path('submit/', SubmitAttemptView.as_view(), name='submit_attempt'),
    path('performance/', UserPerformanceView.as_view(), name='user_performance'),
    path('attempts/<int:pk>/', QuizAttemptDetailView.as_view(), name='attempt_detail'),
]
