from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from PIL import Image
import os
import io
import base64
from tools import predictLca,lca_chat
from graphs import graphs
from ClassPred import category
from MetalSurface import predict_metal_damage
from fetch import FetchData
from model import summarize

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/", methods=['GET'])
def home():
    return jsonify({"message": "Welcome to the BhoomiPath server !"})

@app.route("/health", methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"})



@app.route("/predict_missing", methods=['POST'])
def predict_missing():
    payload = request.get_json()   # original dict with 'sample' and 'question'
    sample_processed = predictLca(payload['sample'])
    

    return jsonify({
        "data": sample_processed,
    })




@app.route("/chat_ai", methods=['POST'])
def chat_reply():
    payload = request.get_json()   # payload has 'sample_row' and 'question'

    # Correct key
    sample_processed = payload.get('sample_row', {})  
    if sample_processed:
        sample_processed = predictLca(sample_processed)

    # Get question safely
    user_question = payload.get('question', 'No question provided')

    # Call your LCA function
    response = lca_chat(sample_processed, user_question)

    return jsonify({
        "airesponse": response
    })


@app.route("/graphs", methods=['POST'])
def generate_graphs():
    data = request.get_json()
    print("data",data)


    data=predictLca(data)
    print("Filed_data",data)
    
    charts = graphs(data)  # pass full data instead of data['sample']
    return jsonify({
        "data": data,
        "charts": charts
    })





@app.route("/predict_spectroscopy", methods=["POST"])
def predict_spectroscopy():
    data = request.get_json()

    if 'specta' not in data:
        return jsonify({"status": "error", "message": "'specta' key not found"}), 400

    y_pred = category(data['specta'])

    return jsonify({
        "status": "successful",
        "class": y_pred
    })



@app.route("/damage", methods=["POST"])
def predict_damage():
    try:
        data = request.get_json()

        # Get base64 string from JSON
        img_base64 = data.get("image")
        if not img_base64:
            return jsonify({"status": "error", "message": "No image provided"}), 400

        # Decode base64 to bytes
        img_bytes = base64.b64decode(img_base64)

        # Convert bytes to PIL Image
        pil_img = Image.open(io.BytesIO(img_bytes))

        # Predict using your function
        pred_class = predict_metal_damage(pil_img)

        return jsonify({"status": "success", "predicted_class": pred_class})

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500





news = FetchData()



@app.route('/fetch/google')
def google():
    return jsonify(news.google())


@app.route('/fetch/youtube')
def youtube():
    return jsonify(news.youtubenews())


@app.route('/fetch/newsapi')
def newsapi():
    return jsonify(news.newsapi())




@app.route('/model/summarise')
def summarise():
    url = request.args.get('url')
    if not url:
        return jsonify({"error": "Please provide a url parameter"}), 400

    summary_text = summarize(url=url)
    print("Generated Summary:", summary_text)  # Debugging ke liye
    return jsonify({"summary": summary_text})


@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

if __name__ == "__main__":
    app.run(debug=True,port=5000)
