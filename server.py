"""Server for movie ratings app."""

from flask import (Flask, render_template, request, flash, session,redirect, url_for, jsonify, make_response)
from flask_cors import CORS
from model import connect_to_db, db
import crud
from jinja2 import StrictUndefined
import os
import jwt
# import googleapiclient
# import hashlib
# import googleoauth

from google.oauth2 import id_token
# from google_auth_oauthlib.flow import Flow
from google.auth.transport import requests as google_requests
import requests
from cachecontrol import CacheControl

 
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

from flask_login import(
    LoginManager,
    current_user,
    login_required,
    login_user,
    logout_user)


app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'])
app.secret_key = 'dev'

# app.secret_key = os.environ.get("SECRET_KEY")
app.jinja_env.undefined = StrictUndefined



login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'


@login_manager.user_loader
def load_user(id):
    """given an id it returns the objects associated with that id"""

    if id is not None:

        return crud.get_user_by_id(id)
    
    return None


@login_manager.unauthorized_handler
def unauthorized():
    """Redirect unauthorized users to Login page."""


    flash('You must be logged in to view that page.')
    return render_template('homepage.html')


@app.route('/')
# @app.route('/login')
def index():
    """View homepage"""
    
    
    if current_user.is_authenticated:
        
        return redirect(url_for('show_user_profile'))
    else:
       
        return render_template('homepage.html')
    


@app.route("/api/signup", methods=['POST'])
def register_user():
    """Create a new user"""
    

    name = request.json.get('name')
    email = request.json.get('email')
    password = request.json.get('pwd')
    
    user = crud.get_user_by_email(email)

    print("name", name, "email", email, "password", password)
    if user:
        print("user found", user)
        return {"success": False,
                "msg": "Cannot create an account with that email, please try again"}, 409
    else: 
        user = crud.create_user(name=name, email=email, password=password)
        db.session.add(user)
        db.session.commit()
        
        return { 
            "msg": "Account successfully created. Please log in",
            }, 201



# @app.route("/googlesignin")
# def googlesignin():
#     """Process Google sign in authorization flow"""


#     state = hashlib.sha256(os.urandom(1024)).hexdigest()
#     flow = Flow.from_client_secrets_file(client_secrets_file = googleoauth.CLIENT_SECRETS,
#     scopes= googleoauth.SCOPES)
#     flow.redirect_uri = googleoauth.REDIRECT_URI
#     authorization_url, state = flow.authorization_url(
#     access_type="offline",
#     prompt="consent",
#     state = state,
#     include_granted_scopes='true')

#     session['state'] = state


#     return redirect(authorization_url)



@app.route("/login", methods=['POST'])
def login():
    """Process user's login"""
    
    email = request.json.get("email")
    print("current email", email)

    password = request.json.get("password")
    print("current password", password)

    user = crud.get_user_by_email(email)
    print("current user", user.email, "pwd", user.password)
    
    if not user or user.password != password:
        print("user", user, "password", password)
        return {"msg": "failed"}, 401
    
    
    elif (email == user.email and password == user.password): 
        
        session['user'] = user.name
        login_user(user) 
        
        return {"name": session['user'],
                "emailLogin": email,
                "pwdLogin": password,
                "msg": "success"}
    else:
        
        return {"msg": "failed"}


@app.route('/callback', methods=["POST"])
def callback():
    """ callback function from Google OAuth"""
    
    data = request.get_json()

    print("data", data)
    credential = data["credential"]
    client_id = data["client_id"]


    try: 
        sess = requests.session()
        cached_sess = CacheControl(sess)

        id_info = id_token.verify_oauth2_token(credential, google_requests.Request(session=cached_sess), client_id)
        
        if id_info['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError('Invalid issuer')
        email = id_info['email'] 
        user = crud.get_user_by_email(email)

    # If user has an account sign in user
        if user:
        
            login_user(user)

        # return ({user: user, id_info:id_info})

    # if user is signing in for the first time and is using google sign in, after they pass google authentication,
    # we create a new account for them and then log them in
        else:
            email_split = (id_info['email']).split("@")
            name = email_split[0]
            
            user = crud.create_user(name = name , email= id_info['email'] )
            db.session.add(user)
            db.session.commit()
            login_user(user)

        google_user = id_info
        
            # Use caching to reduce latency
    #     sess = requests.session()
    #     cached_sess = CacheControl(sess)
    #    S google_signin_request = google_requests.Request(session=cached_sess)

        # # Verify the ID Token issued by Google’s OAuth 2.0 authorization server.
        # id_info = id_token.verify_oauth2_token(
        # id_token = session['credentials']['id_token'], request = google_signin_request, audience = session['credentials']['client_id'])
        # email = id_info['email']
        return {"user": google_user}

    except ValueError:
        print("invalid token")
        return None
    # if 'state' in session:
        
    #     if request.args.get('state', '') != session['state']:
    #         logout_user()
    #         flash("something went wrong, please try logging in again")
    #         return redirect('/')

    
    # flow = Flow.from_client_secrets_file(client_secrets_file = googleoauth.CLIENT_SECRETS,
    #     scopes= googleoauth.SCOPES,
    #     )
    # flow.redirect_uri = googleoauth.REDIRECT_URI

    # flow.fetch_token(authorization_response = request.url)
    
    # credentials = flow.credentials
    
    # session['credentials'] = {
    #     'token': credentials.token,
    #     'refresh_token': credentials.refresh_token,
    #     'token_uri': credentials.token_uri,
    #     'client_id': credentials.client_id,
    #     'client_secret': credentials.client_secret,
    #     'id_token': credentials.id_token,
    #     'scopes': credentials.scopes}



    # Check if user is already in the database
    # user = crud.get_user_by_email(email)

    # # If user has an account sign in user
    # if user:
        
    #     login_user(user)

    #     return ({user: user, id_info:id_info})

    # # if user is signing in for the first time and is using google sign in, after they pass google authentication,
    # # we create a new account for them and then log them in
    # else:
    #     email_split = (id_info['email']).split("@")
    #     name = email_split[0]
        
    #     user = crud.create_user(name = name , email= id_info['email'] )
    #     db.session.add(user)
    #     db.session.commit()
    #     login_user(user)

        
        # return {user: user}



@app.route('/users/')
@login_required
def show_user_profile():
    """Show profile user profile"""
    
        
    return render_template('user_profile.html', user = current_user)



@app.route('/movies')
def all_movies():
    """View all movies """
    
    movies = crud.get_movies()

    return render_template("all_movies.html", movies=movies)



@app.route("/movies/<movie_id>/")
def show_movie(movie_id):
    """Show details on a particular movie"""

    
    if '_user_id' in session:
        user = crud.get_user_by_id(session['_user_id'])
        session['user'] = user.name

    else:
        user = None
    
    movie = crud.get_movie_by_id(movie_id)
    ratings_list = crud.get_movie_ratings(movie_id)
    num_users = 0
    movie_rating = 0
    if ratings_list != []:
        for rating in ratings_list:
            movie_rating += rating.score
            num_users += 1
        average_rating = movie_rating / num_users
    else: 
        average_rating = movie_rating  


    return render_template('movie_details.html', current_user=user, movie=movie, average_rating = average_rating)



@app.route('/allusers')
@login_required
def all_users():
    """View all users """
    
    users = crud.get_users()


    return render_template("all_users.html", users=users)



@app.route('/movies/<movie_id>/ratings', methods=['POST'])
@login_required
def rate_movie(movie_id):
    "Allow users to rate a movie"
    
   
    user = current_user
    score = int(request.form.get('rating'))
    rating = crud.create_rating(user_id = user.user_id, movie_id=movie_id, score=score)
    db.session.add(rating)
    db.session.commit()
    
    movie_ratings = crud.get_movie_ratings(movie_id)
    

    return redirect (url_for('show_movie', user_id = user.user_id, movie_id=movie_id,   movie_ratings = movie_ratings))
    
    

@app.route('/logout', methods=['POST'])
@login_required
def logout():
    """Logout users"""
    
   
    user = request.json.get("currentUser")

    if 'credentials' in session:
        session.pop('credentials', None)
    
    if 'state' in session:
        session.pop('state', None)
    
    if ('user' in session == user):
    
        session.pop('user', None)
        logout_user()
   
        return ({"message": "sucessfully logged out"}, 200)
    else:
        return user

if __name__ == "__main__":
    connect_to_db(app)
    app.run(host="0.0.0.0", debug=True)
