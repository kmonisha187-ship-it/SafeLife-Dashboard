import urllib.request
import os

req = urllib.request.Request("https://raw.githubusercontent.com/datameet/maps/master/Country/india-composite.svg", headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as response:
        with open('images/india.svg', 'wb') as f:
            f.write(response.read())
    print("Success")
except Exception as e:
    print(e)
