CLIENT_ID = 'INCLUDE YOUR OWN APP ID'
CLIENT_SECRET = 'INCLUDE YOUR OWN SECRET KEY'
REDIRECT_URI = 'http://localhost:5000/login/authorized'

AUTHORITY_URL = 'https://login.microsoftonline.com/common'

AUTH_ENDPOINT = '/oauth2/v2.0/authorize'
TOKEN_ENDPOINT = '/oauth2/v2.0/token'

RESOURCE = 'https://graph.microsoft.com/'
API_VERSION = 'v1.0'
SCOPES = ['User.Read', 'Files.ReadWrite', 'Notes.ReadWrite']
