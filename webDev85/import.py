import json
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")
db = client["RandomVerseDB"]

# Import fortune.json into 'fortuneMessages' collection
with open("fortune.json", "r") as f1:
    fortune_data = json.load(f1)
fortune_collection = db["fortuneMessages"]
fortune_result = fortune_collection.insert_many(fortune_data)
print(f"Inserted {len(fortune_result.inserted_ids)} fortune messages.")

# Import ball.json into 'magicBallAnswers' collection
with open("ball.json", "r") as f2:
    ball_data = json.load(f2)
ball_collection = db["magicBallAnswers"]
ball_result = ball_collection.insert_many(ball_data)
print(f"Inserted {len(ball_result.inserted_ids)} magic ball answers.")

client.close()
