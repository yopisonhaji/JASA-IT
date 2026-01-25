import logging
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai

# --- CONFIGURATION ---
TELEGRAM_TOKEN = '8435457650:AAGCkaHd_w7OQFj3Fxmyj1KOwNUNsK3WuDg'
GEMINI_API_KEY = 'AIzaSyB_6kjxUt7xjXc3HIxt9yg8LIey2iVpPXY'

# Global variable to store Admin's Telegram ID (captured when Admin interacts)
ADMIN_ID = None

# Setup Flask
app = Flask(__name__)
CORS(app)

# Setup Logging
logging.basicConfig(level=logging.INFO)

# Setup Gemini
try:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-pro')
    logging.info("Gemini AI Ready")
except Exception as e:
    logging.error(f"Gemini Config Error: {e}")

def get_ai_response(user_text):
    """Helper to get response from Gemini"""
    # 1. Rule-based checks
    text_lower = user_text.lower()
    
    if "harga" in text_lower:
        return "Harga layanan kami bervariasi, tergantung pada jenis servis. Untuk informasi lebih lanjut, Anda bisa menghubungi kami di WhatsApp."
    
    elif "konsultasi" in text_lower:
        return "Untuk melakukan konsultasi, Anda bisa menghubungi kami melalui WhatsApp atau mengunjungi website kami."

    elif any(keyword in text_lower for keyword in ["wa", "whatsapp", "nomer", "nomor"]):
        return "0821-3800-4443\nAdmin kami akan membantu."

    elif any(keyword in text_lower for keyword in ["alamat", "lokasi", "dimana"]):
        return "Alamat kami di:\nJl. H. Nursad, Ciater, Kec. Serpong, Kota Tangerang Selatan, Banten 15310"

    elif any(keyword in text_lower for keyword in ["jasa", "layanan", "servis"]):
        return (
            "Layanan SatuJalan meliputi:\n"
            "1. **Servis HP/Laptop**: Ganti LCD, Baterai, Mati Total, Install Ulang.\n"
            "2. **Web Development**: Pembuatan Website, Aplikasi, & SEO.\n"
            "3. **Data Recovery**: Mengembalikan data hilang.\n"
            "4. **Maintenance**: Perawatan komputer kantor."
        )
    
    # 2. AI Fallback
    try:
        context_prompt = (
            "Anda adalah Customer Service dari SatuJalan 'Admin 24 Jam' yang cerdas. "
            "SatuJalan menawarkan layanan servis HP/Laptop, konsultasi IT, dan pengembangan website. "
            "Jawablah setiap pertanyaan dengan informasi yang akurat, sopan, dan gunakan emoji bila perlu."
            f"User: {user_text}"
        )
        response = model.generate_content(context_prompt)
        return response.text
    except Exception as e:
        print(f"!!! GEMINI ERROR: {e}") # Explicit print for debugging
        logging.error(f"Gemini Error: {e}")
        return "Maaf, server AI sedang sibuk. Silakan hubungi WhatsApp kami untuk respon cepat."

@app.route('/', methods=['GET'])
def index():
    return f"SatuJalan AI Server Running. Admin ID: {ADMIN_ID}", 200

# --- TELEGRAM WEBHOOK ---
@app.route('/webhook', methods=['POST'])
def webhook():
    global ADMIN_ID
    try:
        data = request.json
        if 'message' in data and 'text' in data['message']:
            chat_id = data['message']['chat']['id']
            user_text = data['message']['text']
            
            # Capture Admin ID automatically so we know where to forward web chats
            if ADMIN_ID is None:
                ADMIN_ID = chat_id
                print(f"--- ADMIN DETECTED: {ADMIN_ID} ---")

            # Get AI Response
            reply_text = get_ai_response(user_text)

            # Send back to Telegram
            send_url = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage"
            payload = {"chat_id": chat_id, "text": reply_text}
            requests.post(send_url, json=payload)
        return 'OK', 200
    except Exception as e:
        logging.error(f"Webhook Error: {e}")
        return 'Error', 500

# --- WEB CHAT API ---
@app.route('/api/chat', methods=['POST'])
def web_chat():
    """API for the website chat widget"""
    try:
        data = request.json
        user_message = data.get('message', '')
        
        if not user_message:
            return jsonify({'error': 'No message provided'}), 400

        # 1. Forward to Telegram (if Admin is known)
        if ADMIN_ID:
            try:
                alert_msg = f"🔔 *Pesan dari Website:*\n{user_message}"
                send_url = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage"
                payload = {"chat_id": ADMIN_ID, "text": alert_msg, "parse_mode": "Markdown"}
                requests.post(send_url, json=payload)
            except Exception as notify_err:
                print(f"Failed to notify Telegram: {notify_err}")

        # 2. Get Response from AI
        ai_reply = get_ai_response(user_message)
        
        return jsonify({'reply': ai_reply})

    except Exception as e:
        logging.error(f"Web API Error: {e}")
        return jsonify({'reply': "Error connecting to AI."}), 500

# --- ADMIN ENDPOINT (Manual) ---
@app.route('/admin', methods=['POST'])
def admin():
    try:
        data = request.json
        target_id = ADMIN_ID or data.get('chat_id')
        msg = data.get('message', '')

        if msg and target_id:
            send_url = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage"
            payload = {"chat_id": target_id, "text": msg}
            requests.post(send_url, json=payload)
            return 'Sent', 200
        return 'No target or message', 400
    except Exception as e:
        return str(e), 500

if __name__ == '__main__':
    print("--- SatuJalan AI Server ---")
    print("Runs on http://localhost:5000")
    print("Telegram Webhook endpoint: /webhook")
    print("Web Widget endpoint: /api/chat")
    app.run(debug=True, port=5000)
