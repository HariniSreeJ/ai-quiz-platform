from django.urls import path
from .views import SubmitAttemptView, UserPerformanceView

urlpatterns = [
    path('submit/', SubmitAttemptView.as_view(), name='submit_attempt'),
    path('performance/', UserPerformanceView.as_view(), name='user_performance'),
]
