import requests, json, os, zipfile
from supabase import create_client, Client

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_KEY"]

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Download zip
url = "https://traviscad.org/wp-content/largefiles/2024%20Certified%20JSON%20Export%20Supp%200_07162024.zip"
zip_path = "data.zip"
json_path = "data.json"

r = requests.get(url, stream=True)
with open(zip_path, "wb") as f:
    for chunk in r.iter_content(chunk_size=8192):
        f.write(chunk)

# Unzip
with zipfile.ZipFile(zip_path, 'r') as zip_ref:
    zip_ref.extractall()

# Parse and insert in chunks
with open("Travis-protaxExport-20240718.json", "r") as f:
    data = json.load(f)

chunk_size = 1000
for i in range(0, len(data), chunk_size):
    chunk = data[i:i + chunk_size]
    supabase.table("your_table").insert(chunk).execute()
