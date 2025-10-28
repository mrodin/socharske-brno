import jwt
import datetime

TEAM_ID = "VW9V6JMJ84"
CLIENT_ID = "com.kulturnilenochodi.socharske-brno.service"
KEY_ID = "WA9U99WUPJ"


with open("AuthKey_WA9U99WUPJ.p8", "r") as f:
    PRIVATE_KEY = f.read()

now = datetime.datetime.utcnow()
expiration = now + datetime.timedelta(days=180)  # max 6 měsíců

headers = {"kid": KEY_ID, "alg": "ES256"}

payload = {
    "iss": TEAM_ID,
    "iat": now,
    "exp": expiration,
    "aud": "https://appleid.apple.com",
    "sub": CLIENT_ID,
}

client_secret = jwt.encode(payload, PRIVATE_KEY, algorithm="ES256", headers=headers)

print("Client Secret:\n", client_secret)
