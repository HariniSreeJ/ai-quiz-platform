from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Quiz, Question
from .serializers import QuizSerializer

class QuizListCreateView(generics.ListCreateAPIView):
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Users can only see their own generated quizzes in this list
        return Quiz.objects.filter(creator=self.request.user).order_by('-creation_timestamp')


class QuizDetailView(generics.RetrieveAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated]
