from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer

app = Flask(__name__)

model = SentenceTransformer("all-MiniLM-L6-v2")

@app.route("/embedding", methods=["POST"])
def embedding():

    text = request.json["text"]

    vector = model.encode(text).tolist()

    return jsonify(vector)

app.run(
    host="0.0.0.0",
    port=5000
)