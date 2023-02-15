"""Server for movie ratings app."""

from flask import (Flask, render_template, request, flash, session,redirect, url_for)
from model import connect_to_db, db
import crud
from jinja2 import StrictUndefined
import os

# import googleapiclient
import hashlib
import googleoauth
from google_auth_oauthlib.flow import Flow


 
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

from flask_login import(
    LoginManager,
    current_user,
    login_required,
    login_user,
    logout_user)


app = Flask(__name__)
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
        return render_template('user_profile.html', user= current_user)
    else:
        return render_template('homepage.html')
    



@app.route("/users", methods=['POST'])
def register_user():
    """Create a new user"""
    

    username = request.form.get('username')
    email = request.form.get('email')
    password = request.form.get('password')
    
    user = crud.get_user_by_email(email)
    
    if user:
        flash("Cannot create an account with that email. Please try again ")
    else: 
        user = crud.create_user(username, email, password)
        db.session.add(user)
        db.session.commit()
        flash("Account successfully created. Please log in")
        
    return redirect("/")


@app.route("/gmailsignup", methods=["GET"])
def signup_google():
    """ redirect users to sign up using their gmail account"""
    state = hashlib.sha256(os.urandom(1024)).hexdigest()
    session['state'] = state

    flow = Flow.from_client_secrets_file(client_secrets_file = googleoauth.CLIENT_SECRETS,
    scopes= googleoauth.SCOPES)
    flow.redirect_uri = googleoauth.REDIRECT_URI

    authorization_url = flow.authorization_url(
    access_type="offline",
    prompt="consent",
    state = state,
    include_granted_scopes='true')

    return redirect(authorization_url)


@app.route("/login", methods=['POST', 'GET'])
def login():
    """Handle users login"""
    

    if request.method == 'GET':
        
        flow = Flow.from_client_secrets_file(client_secrets_file = googleoauth.CLIENT_SECRETS,
        scopes= googleoauth.SCOPES)
        flow.redirect_uri = googleoauth.REDIRECT_URI

        authorization_url, state = flow.authorization_url(
        access_type="offline",
        prompt="consent",
        include_granted_scopes='true')
        session['state'] = state

        print("im the session state", session['state'])
        
        return redirect(authorization_url)
    
    email = request.form.get('email')
    password = request.form.get('password')
    
    user = crud.get_user_by_email(email)
    
    if not user or user.password != password:
        flash("Please verify your email and password and try again")
        
    elif email == user.email and password == user.password: 
        
        session['user'] = email
        login_user(user)
        flash("Successfully logged in!")
        
        return redirect(url_for('show_user_profile'))
    
    return redirect("/")



@app.route('/callback')
def callback():

    # flow = googleoauth.flow()
    state = session.get('state')
    # if state != request.args.get('state'):
    #     redirect('/')

    print("im the current state", state)
    print("state", request.args.get('state'))
    if request.args.get('state', '') != state:
        del session['state']
        flash("something went wrong, please try logging in again")
        return redirect('/')
    
    # code = request.args.get("code")
    # endpoint = request.args.get("token_endpoint")

    flow = Flow.from_client_secrets_file(client_secrets_file = googleoauth.CLIENT_SECRETS,
        scopes= googleoauth.SCOPES,
        state = state,
        redirect_uri = googleoauth.REDIRECT_URI)
    

    flow.fetch_token(authorization_response = request.url)
    
    credentials = flow.credentials
    
    session['credentials'] = {
        'token': credentials.token,
        'refresh_token': credentials.refresh_token,
        'token_uri': credentials.token_uri,
        'client_id': credentials.client_id,
        'client_secret': credentials.client_secret,
        'scopes': credentials.scopes}

    return redirect(url_for('show_user_profile'))



@app.route('/users/')
@login_required
def show_user_profile():
    """Show profile user profile"""

    return render_template('user_profile.html', user= current_user)


@app.route('/movies')
def all_movies():
    """View all movies """
    
    movies = crud.get_movies()

    return render_template("all_movies.html", movies=movies)


@app.route("/movies/<movie_id>")
def show_movie(movie_id):
    """Show details on a particular movie"""

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

    return render_template('movie_details.html', movie=movie, average_rating = average_rating)


@app.route('/users')
@login_required
def all_users():
    """View all users """
    
    users = crud.get_users()

    return render_template("all_users.html", users=users)


@app.route('/movies/<movie_id>/ratings', methods=['POST'])
@login_required
def rate_movie(movie_id):
    "Allow users to create a movie ratings"
    
   
    user = current_user
    score = int(request.form.get('rating'))
    rating = crud.create_rating(user_id = user.user_id, movie_id=movie_id, score=score)
    db.session.add(rating)
    db.session.commit()
    
    movie_ratings = crud.get_movie_ratings(movie_id)
    
    return redirect (url_for('show_movie', user_id = user.user_id, movie_id=movie_id,   movie_ratings = movie_ratings))
    

@app.route('/logout')
@login_required
def logout():
    """Allow users to logout"""

    if 'credentials' in session:
        del session['credentials']
        del session['state']
    logout_user()
   
    return redirect('/')


if __name__ == "__main__":
    connect_to_db(app)
    app.run(host="0.0.0.0", debug=True)
