import json
import os
from google import genai
from google.genai import types

def generate_quiz_questions(topic, difficulty, num_questions):
    """Calls Gemini to generate a JSON array of quiz questions."""
    
    # Check for API key; if missing, use fallback mock logic (for development/review without key)
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return _generate_mock_questions(topic, difficulty, num_questions)

    client = genai.Client(api_key=api_key)

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
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
        )
        
        # Strip potential markdown block syntax if the model decides to include it anyway
        text = response.text.strip()
        if text.startswith('```json'):
            text = text[7:]
        if text.endswith('```'):
            text = text[:-3]
            
        return json.loads(text.strip())
        
    except Exception as e:
        print(f"Error calling Gemini: {e}")
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
            "correct_option": "A" if i % 2 != 0 else "C", # Alternate correct answers
            "explanation": f"This is a mocked explanation for question {i}. You need to provide a GEMINI_API_KEY environment variable to use the real AI."
        })
    return questions
