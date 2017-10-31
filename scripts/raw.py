try:
    import requests
except:
    import pip
    pip.main(["install", "requests"])
    import requests
    
r = requests.get("https://sbhs-place.firebaseio.com/public.json")
print (r.text)
