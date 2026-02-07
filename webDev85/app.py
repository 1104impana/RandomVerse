from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from flask import session  
# from pymongo import MongoClient  # 🔸 Commented out MongoDB for now

# 🔮 LLM things
import httpx
import os
from dotenv import load_dotenv
import random


app = Flask(__name__)
CORS(app)
app.jinja_env.globals.update(random=random.random)
app.secret_key = 'supersecretkey123'


# Load API key from .env file
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

@app.route('/')
def home():
    return render_template('Homepage.html', current_file='Homepage.html')
@app.route('/random')
def random_page():
    template_folder = app.template_folder or 'templates'

    html_files = [
        f for f in os.listdir(template_folder)
        if f.endswith('.html') and not f.startswith('_') and f != 'Homepage.html'
    ]

    if not html_files:
        return "No HTML files found!", 404

    selected = random.choice(html_files)

    return render_template(selected, current_file=selected)


@app.route('/next_verse')
def next_verse():
    current = request.args.get('current')  # e.g. meditation.html
    template_folder = app.template_folder or 'templates'

    # Get all HTML files excluding Homepage and current
    all_html_files = [
        f for f in os.listdir(template_folder)
        if f.endswith('.html') and f not in ['Homepage.html', current]
    ]

    # Load visited files from session, or initialize
    visited = session.get('visited', [])

    # Get unvisited ones
    unvisited = [f for f in all_html_files if f not in visited]

    # If all visited, reset
    if not unvisited:
        visited = []
        unvisited = all_html_files

    # Pick next verse
    next_file = random.choice(unvisited)

    # Update session
    visited.append(next_file)
    session['visited'] = visited

    return render_template(next_file, current_file=next_file)

@app.route('/ripple')
def ripple():
    return render_template('ripple.html', current_file='ripple.html')

@app.route('/crystal')
def crystal():
    return render_template('crystall.html', current_file='crystall.html')

@app.route('/fortune')
def fortune():
    return render_template('fortune.html', current_file='fortune.html')

@app.route('/meditation')
def meditation():
    return render_template('meditation.html', current_file='meditation.html')

@app.route('/snake')
def snake():
    return render_template('snake.html', current_file='snake.html')

@app.route('/flappy')
def flappy():
    return render_template('flappy.html',current_file='flappy.html')

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



#check



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
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 10000)), debug=True)