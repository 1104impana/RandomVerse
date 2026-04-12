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

EXCLUDED_PAGES = ['Homepage.html', 'donation.html']

@app.route('/')
def home():
    return render_template('Homepage.html', current_file='Homepage.html')

@app.route('/random')
def random_page():
    template_folder = app.template_folder or 'templates'

    html_files = [
        f for f in os.listdir(template_folder)
        if f.endswith('.html') and not f.startswith('_') and f not in EXCLUDED_PAGES
    ]

    if not html_files:
        return "No HTML files found!", 404

    # 🔥 Shuffle once and store order
    order = random.sample(html_files, len(html_files))
    session['order'] = order
    session['index'] = 0

    first_page = order[0]
    session['index'] = 1  # move pointer forward

    return render_template(first_page, current_file=first_page)

@app.route('/next_verse')
def next_verse():
    order = session.get('order', [])
    index = session.get('index', 0)

    # 🚨 If no session (user refreshed directly)
    if not order:
        return redirect(url_for('random_page'))

    # ✅ If finished all pages → show donation
    if index >= len(order):
        session.clear()  # optional reset
        return render_template('donation.html')

    next_page = order[index]
    session['index'] = index + 1

    return render_template(next_page, current_file=next_page)
    
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

@app.route('/donation')
def donation():
    return render_template('donation.html',current_file='donation.html')


# Function to call Groq API
def get_crystal_ball_llm_response(user_question):
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    prompt = f"You are a sarcastic and funny crystal ball oracle. When answering the user's question, reply with witty sarcasm, humor ansd some roasts. Keep it short and clever. answer in 1 sentence and less than 10 words. Question: '{user_question}'"

    payload = {
        "model": "llama-3.1-8b-instant",  # You can swap the model here if needed
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
        "model": "llama-3.1-8b-instant",  # You can swap the model here if needed
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
     print("FORTUNE ERROR:", e)   # add this line
     return jsonify({"message": str(e)}), 500



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 10000)), debug=True)