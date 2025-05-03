import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_connection(url: str, key: str, key_type: str):
    try:
        print(f"\nTesting {key_type} connection...")
        supabase: Client = create_client(url, key)
        
        # Try a simple query to test the connection
        response = supabase.table('users').select("*").limit(1).execute()
        print(f"✅ {key_type} connection successful!")
        print(f"Response data: {response.data}")
        return True
    except Exception as e:
        print(f"❌ {key_type} connection failed!")
        print(f"Error: {str(e)}")
        return False

# Test anon key connection
anon_url = os.getenv("VITE_SUPABASE_URL")
anon_key = os.getenv("VITE_SUPABASE_ANON_KEY")
test_connection(anon_url, anon_key, "Anon")

# Test service role key connection
service_url = os.getenv("SUPABASE_URL")
service_key = os.getenv("SUPABASE_KEY")
test_connection(service_url, service_key, "Service Role") 