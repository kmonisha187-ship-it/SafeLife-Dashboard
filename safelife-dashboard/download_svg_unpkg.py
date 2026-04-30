import urllib.request
import os

url = "https://unpkg.com/@svg-maps/india@1.0.1/india.svg"
if not os.path.exists('images'):
    os.makedirs('images')

try:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as response:
        content = response.read()
        with open('images/india.svg', 'wb') as f:
            f.write(content)
    print(f"Success downloaded from {url}")
except Exception as e:
    print(f"Failed {url}: {e}")
