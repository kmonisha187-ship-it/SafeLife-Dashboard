import urllib.request
import os

urls = [
    "https://raw.githubusercontent.com/samarth-2561/india-svg-map/master/india.svg",
    "https://raw.githubusercontent.com/jacksonkasi1/india-map-svg/master/india.svg",
    "https://raw.githubusercontent.com/arav-ind/svgmaps-india/master/public/india.svg",
    "https://upload.wikimedia.org/wikipedia/commons/b/b4/India_State_Map.svg"
]

if not os.path.exists('images'):
    os.makedirs('images')

for url in urls:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            content = response.read()
            if b"<svg" in content.lower():
                with open('images/india.svg', 'wb') as f:
                    f.write(content)
                print(f"Success downloaded from {url}")
                break
    except Exception as e:
        print(f"Failed {url}: {e}")
