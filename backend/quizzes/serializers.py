from rest_framework import serializers
from .models import Quiz, Question
from .ai_service import generate_quiz_questions

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'question_text', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_option', 'explanation']


class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    num_questions = serializers.IntegerField(write_only=True, min_value=1, max_value=20)
    
    class Meta:
        model = Quiz
        fields = ['id', 'topic', 'difficulty_level', 'creator', 'creation_timestamp', 'questions', 'num_questions']
        read_only_fields = ['creator', 'creation_timestamp']

    def create(self, validated_data):
        num_questions = validated_data.pop('num_questions')
        validated_data['creator'] = self.context['request'].user
        quiz = super().create(validated_data)

        # Call AI service entirely synchronously for simplicity. 
        # In a massive prod app, this goes to Celery. But for this size, sync is fine.
        raw_questions = generate_quiz_questions(
            topic=quiz.topic,
            difficulty=quiz.difficulty_level,
            num_questions=num_questions
        )

        # Create question objects in DB
        question_objects = []
        for q_data in raw_questions:
            question_objects.append(
                Question(
                    quiz=quiz,
                    question_text=q_data.get('question_text', 'Fallback Question'),
                    option_a=q_data.get('option_a', 'Option A'),
                    option_b=q_data.get('option_b', 'Option B'),
                    option_c=q_data.get('option_c', 'Option C'),
                    option_d=q_data.get('option_d', 'Option D'),
                    correct_option=q_data.get('correct_option', 'A'),
                    explanation=q_data.get('explanation', '')
                )
            )
        
        Question.objects.bulk_create(question_objects)
        
        return quiz
