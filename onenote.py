import flask
from flask_oauthlib.client import OAuth
from flask import request
import uuid
import json
import config

APP = flask.Flask(__name__, template_folder='static/templates')
APP.debug = True
APP.secret_key = 'development'
OAUTH = OAuth(APP)
MSGRAPH = OAUTH.remote_app(
    'microsoft',
    consumer_key=config.CLIENT_ID,
    consumer_secret=config.CLIENT_SECRET,
    request_token_params={'scope': config.SCOPES},
    base_url=config.RESOURCE + config.API_VERSION + '/',
    request_token_url=None,
    access_token_method='POST',
    access_token_url=config.AUTHORITY_URL + config.TOKEN_ENDPOINT,
    authorize_url=config.AUTHORITY_URL + config.AUTH_ENDPOINT
)


@APP.route('/')
def homepage():
    return flask.render_template('homepage.html')


@APP.route('/login')
def login():
    flask.session['state'] = str(uuid.uuid4())
    return MSGRAPH.authorize(callback=config.REDIRECT_URI, state=flask.session['state'])


@APP.route('/login/authorized')
def authorized():
    response = MSGRAPH.authorized_response()
    flask.session['access_token'] = response['access_token']
    return flask.redirect('/onenote')


@APP.route('/onenote')
def onenote():
    user_profile = MSGRAPH.get('me', headers=request_headers()).data
    user_name = user_profile['displayName']
    return flask.render_template('onenote.html',
                                 name=user_name)


@APP.route('/get', methods=['GET'])
def get():
    if request.args.get('notebook'):
        return json.dumps(MSGRAPH.get('me/onenote/notebooks/' + request.args.get('notebook') + '/sections',
                                      headers=request_headers()).data)
    elif request.args.get('section'):
        return json.dumps(MSGRAPH.get('me/onenote/sections/' + request.args.get('section') + '/pages',
                                      headers=request_headers()).data)
    elif request.args.get('note'):
        return json.dumps(MSGRAPH.get('me/onenote/pages/' + request.args.get('note') + '/preview',
                                      headers=request_headers()).data)
    else:
        return json.dumps(MSGRAPH.get('me/onenote/notebooks', headers=request_headers()).data)


@MSGRAPH.tokengetter
def get_token():
    return flask.session.get('access_token'), ''


def request_headers(headers=None):
    default_headers = {'SdkVersion': 'sample-python-flask',
                       'x-client-SKU': 'sample-python-flask',
                       'client-request-id': str(uuid.uuid4()),
                       'return-client-request-id': 'true'}
    if headers:
        default_headers.update(headers)
    return default_headers


if __name__ == '__main__':
    APP.run()