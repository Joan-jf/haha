from flask import Flask, request, jsonify
import pickle
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
#  Load the model and vectorizer
with open('model.pkl', 'rb') as model_file:
    model = pickle.load(model_file)

with open('vectorizer.pkl', 'rb') as vectorizer_file:
    vectorizer = pickle.load(vectorizer_file)

app = Flask(__name__)


@app.route('/')
def home():
    return "<h1>Phishing Mail Detection API</h1><p>Use the /detect endpoint to check emails.</p>"


@app.route('/detect', methods=['POST'])
def detect():
    data = request.json
    if 'email_text' not in data:
        return jsonify({'error': 'No email_text provided'}), 400

    email_text = data['email_text']

    # Transform the email text using the vectorizer
    email_vector = vectorizer.transform([email_text])
    email_vector_dense = email_vector.toarray()

    # Make a prediction using the model
    prediction = model.predict(email_vector_dense)[0]
    result = 'Be careful, this mail might be a Phishing' if prediction == 1 else "It is a safe mail, don't worry :>"

    return jsonify({'result': result})


if __name__ == '__main__':
    app.run(debug=True)
