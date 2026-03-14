from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Sum, Count, F
from .models import QuizAttempt, UserAnswer
from .serializers import QuizAttemptSerializer

class SubmitAttemptView(generics.CreateAPIView):
    serializer_class = QuizAttemptSerializer
    permission_classes = [permissions.IsAuthenticated]

class UserPerformanceView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        attempts = QuizAttempt.objects.filter(user=user)
        
        total_quizzes = attempts.count()
        if total_quizzes == 0:
            return Response({
                "message": "No quizzes attempted yet.",
                "total_quizzes": 0
            })
            
        total_score = attempts.aggregate(Sum('score'))['score__sum'] or 0
        total_questions = attempts.aggregate(Sum('total_questions'))['total_questions__sum'] or 0
        overall_accuracy = (total_score / total_questions * 100) if total_questions > 0 else 0

        # Topic wise accuracy 
        topic_stats = attempts.values(topic=F('quiz__topic')).annotate(
            topic_score=Sum('score'),
            topic_total=Sum('total_questions')
        )
        
        topics = []
        for stat in topic_stats:
            topics.append({
                "topic": stat['topic'],
                "accuracy": (stat['topic_score'] / stat['topic_total'] * 100) if stat['topic_total'] > 0 else 0
            })

        return Response({
            "total_quizzes": total_quizzes,
            "overall_accuracy": round(overall_accuracy, 2),
            "topic_stats": topics,
            "recent_attempts": QuizAttemptSerializer(attempts.order_by('-attempt_timestamp')[:5], many=True).data
        })
