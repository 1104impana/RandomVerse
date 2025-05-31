from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)

client = MongoClient('mongodb://localhost:27017')
db = client.RandomVerseDB
collection = db.fortuneMessages
collection2=db.magicBallAnswers

@app.route('/getRandomMessage', methods=['GET'])
def get_random_message_route():
    # Get one random document from collection
    random_doc = list(collection.aggregate([{"$sample": {"size": 1}}]))
    if random_doc:
        message = random_doc[0].get('message', "No fortunes available.")
        return jsonify({"message": message})
    else:
        return jsonify({"message": "No fortunes found."})
    
@app.route('/getAnswer', methods=['GET'])
def get_answer_route():
    user_question = request.args.get('keyword')  # it's the full question text
    
    if not user_question:
        return jsonify({"error": "Please provide a question as a query parameter."}), 400

    user_question_lower = user_question.lower()
    
    # Fetch all documents from collection2
    all_docs = list(collection2.find())

    import random

    matched_docs = []
    
    # Check if any keyword from each doc is in the user's question
    for doc in all_docs:
        for keyword in doc.get('keywords', []):
            if keyword.lower() in user_question_lower:
                matched_docs.append(doc)
                break  # no need to check other keywords in this doc

    if not matched_docs:
        return jsonify({"answer": "hmm tricky question, guess have to call the gods for answers!"})

    # Pick a random matching doc
    selected_doc = random.choice(matched_docs)
    
    # Pick a random message from its messages array
    answer = random.choice(selected_doc.get('messages', ["No messages available."]))

    return jsonify({
        "question": selected_doc.get("question"),
        "category": selected_doc.get("category"),
        "answer": answer
    })



if __name__ == '__main__':
    app.run(port=5000, debug=True)
