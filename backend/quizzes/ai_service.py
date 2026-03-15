import json
import os
from groq import Groq


def generate_quiz_questions(topic, difficulty, num_questions):
    """Calls Groq (Llama 3.3 70B) to generate a JSON array of quiz questions."""

    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        return _generate_mock_questions(topic, difficulty, num_questions)

    client = Groq(api_key=api_key)

    prompt = f"""Generate a multiple-choice quiz about '{topic}'.
    Difficulty: {difficulty}
    Number of questions: {num_questions}
    
    Return ONLY a valid JSON array of objects. Each object must have exactly these keys:
    - "question_text": The question string.
    - "option_a": First choice.
    - "option_b": Second choice.
    - "option_c": Third choice.
    - "option_d": Fourth choice.
    - "correct_option": The correct choice letter (exactly "A", "B", "C", or "D").
    - "explanation": A brief, helpful explanation of why the correct answer is right.
    
    Do not include markdown formatting like ```json. Just return the raw JSON array.
    """

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "You are a quiz generator. You ONLY output valid JSON arrays. No markdown, no extra text."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.7,
            max_completion_tokens=4096,
        )

        text = response.choices[0].message.content.strip()

        # Strip potential markdown block syntax if the model includes it
        if text.startswith('```json'):
            text = text[7:]
        if text.startswith('```'):
            text = text[3:]
        if text.endswith('```'):
            text = text[:-3]

        return json.loads(text.strip())

    except Exception as e:
        print(f"Error calling Groq: {e}")
        # Fallback to mock on error to ensure app still functions
        return _generate_mock_questions(topic, difficulty, num_questions)


def _generate_mock_questions(topic, difficulty, num_questions):
    """Fallback mechanism if API key is missing or call fails."""
    questions = []
    for i in range(1, num_questions + 1):
        questions.append({
            "question_text": f"Mock Question {i} about {topic} ({difficulty})?",
            "option_a": f"Mock Option A for Q{i}",
            "option_b": f"Mock Option B for Q{i}",
            "option_c": f"Mock Option C for Q{i}",
            "option_d": f"Mock Option D for Q{i}",
            "correct_option": "A" if i % 2 != 0 else "C",
            "explanation": f"This is a mocked explanation for question {i}. Set the GROQ_API_KEY environment variable to use real AI generation."
        })
    return questions
