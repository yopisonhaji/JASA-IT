import requests

# Config
TOKEN = '8435457650:AAGCkaHd_w7OQFj3Fxmyj1KOwNUNsK3WuDg'

def set_webhook():
    print("--- Telegram Webhook Setup ---")
    print("1. Pastikan Anda sudah menjalankan 'ngrok http 5000' di terminal lain.")
    print("2. Salin URL HTTPS dari ngrok (contoh: https://a1b2-34-56.ngrok-free.app)")
    
    ngrok_url = input("Masukkan URL Ngrok Anda: ").strip()
    
    if not ngrok_url.startswith("http"):
        print("Error: URL harus dimulai dengan http:// atau https://")
        return

    # Ensure no trailing slash
    ngrok_url = ngrok_url.rstrip("/")
    
    webhook_url = f"{ngrok_url}/webhook"
    api_url = f"https://api.telegram.org/bot{TOKEN}/setWebhook?url={webhook_url}"
    
    try:
        response = requests.get(api_url)
        print(f"\nStatus: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200 and response.json().get('ok'):
            print("\nSUKSES! Bot Telegram sekarang terhubung ke komputer Anda.")
            print("Coba kirim pesan ke bot di Telegram, dan lihat responsnya.")
        else:
            print("\nGAGAL. Cek URL atau koneksi internet Anda.")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    set_webhook()
