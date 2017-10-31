try:
    import requests
except:
    import pip
    pip.main(["install", "requests"])
    import requests
import json
import sys

for line in sys.stdin:
    r = requests.put("https://sbhs-place.firebaseio.com/public.json", json=json.loads(line))
