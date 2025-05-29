from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
# from pymongo import MongoClient  # 🔸 Commented out MongoDB for now

# 🔮 LLM things
import httpx
import os
from dotenv import load_dotenv

# Load API key from .env file
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Function to call Groq API
def get_crystal_ball_llm_response(user_question):
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    prompt = f"You are a sarcastic and funny crystal ball oracle. When answering the user's question, reply with witty sarcasm, humor ansd some roasts. Keep it short and clever. answer in 1 sentence and less than 10 words. Question: '{user_question}'"

    payload = {
        "model": "llama3-8b-8192",  # You can swap the model here if needed
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7
    }

    response = httpx.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=payload)
    result = response.json()
    return result['choices'][0]['message']['content']


def get_fortune_cookie_response():
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    prompt = (
    "You are a fortune cookie oracle. "
    "Reply with exactly one short, witty, sarcastic, or positive fortune. "
    "The fortune must be ONE sentence only, under 10 words, with no extra text or greetings and no repetitions."
    )

    payload = {
        "model": "llama3-8b-8192",  # You can swap the model here if needed
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7
    }

    response = httpx.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=payload)
    response.raise_for_status()  # Optional: raises error if request failed
    result = response.json()
    return result['choices'][0]['message']['content'].strip()






app = Flask(__name__)
CORS(app)


# 🔮 New Crystal Ball LLM Route
@app.route('/crystalBallAnswer', methods=['GET'])
def crystal_ball_answer_route():
    user_question = request.args.get('question')
    
    if not user_question:
        return jsonify({"error": "Please provide a question as a query parameter."}), 400

    try:
        llm_response = get_crystal_ball_llm_response(user_question)
        return jsonify({
            "question": user_question,
            "crystalBallAnswer": llm_response
        })
    except Exception as e:
        return jsonify({"error": f"Failed to get crystal ball answer: {str(e)}"}), 500
    
@app.route('/getFortuneLLM', methods=['GET'])
def get_fortune_llm():
    try:
        fortune = get_fortune_cookie_response()
        return jsonify({"message": fortune})
    except Exception as e:
        return jsonify({"message": "Fortune cookie is empty today."}), 500



if __name__ == '__main__':
    app.run(port=5000, debug=True)
