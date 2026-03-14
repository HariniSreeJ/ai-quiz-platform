from rest_framework import serializers
from .models import QuizAttempt, UserAnswer
from quizzes.models import Question

class UserAnswerSerializer(serializers.ModelSerializer):
    question_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = UserAnswer
        fields = ['question_id', 'selected_option', 'is_correct']
        read_only_fields = ['is_correct']


class QuizAttemptSerializer(serializers.ModelSerializer):
    answers = UserAnswerSerializer(many=True, write_only=True)
    score = serializers.IntegerField(read_only=True)
    attempt_timestamp = serializers.DateTimeField(read_only=True)

    class Meta:
        model = QuizAttempt
        fields = ['id', 'quiz', 'score', 'total_questions', 'attempt_timestamp', 'answers']

    def create(self, validated_data):
        answers_data = validated_data.pop('answers')
        user = self.context['request'].user
        quiz = validated_data['quiz']
        
        # Calculate score
        score = 0
        user_answers = []
        for ans in answers_data:
            question = Question.objects.get(id=ans['question_id'], quiz=quiz)
            is_correct = (question.correct_option == ans['selected_option'])
            if is_correct:
                score += 1
            user_answers.append({
                'question': question,
                'selected_option': ans['selected_option'],
                'is_correct': is_correct
            })

        attempt = QuizAttempt.objects.create(
            user=user,
            quiz=quiz,
            score=score,
            total_questions=validated_data['total_questions']
        )

        UserAnswer.objects.bulk_create([
            UserAnswer(attempt=attempt, **ans_dict) for ans_dict in user_answers
        ])

        return attempt
