import urllib.request
import os

if not os.path.exists('images'):
    os.makedirs('images')

req = urllib.request.Request(
    'https://upload.wikimedia.org/wikipedia/commons/e/e4/India_blank_map.svg', 
    headers={'User-Agent': 'Mozilla/5.0'}
)
with urllib.request.urlopen(req) as response, open('images/india.svg', 'wb') as out_file:
    data = response.read()
    out_file.write(data)
print("SVG downloaded successfully.")
