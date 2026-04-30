import urllib.request
import os

if not os.path.exists('images'):
    os.makedirs('images')

url = "https://raw.githubusercontent.com/Anujarya300/bubble_maps/master/data/India.svg"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as response:
        data = response.read()
        with open('images/india.svg', 'wb') as out_file:
            out_file.write(data)
    print("SVG downloaded successfully.")
except Exception as e:
    print(f"Failed: {e}")
