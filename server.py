"""Server for movie ratings app."""

from flask import (Flask, render_template, request, flash, session,redirect, url_for)
from model import connect_to_db, db, User
import crud
from jinja2 import StrictUndefined


app = Flask(__name__)
app.secret_key = "dev"
app.jinja_env.undefined = StrictUndefined


@app.route('/')
def homepage():
    """View homepage"""

    return render_template('homepage.html')


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
def all_users():
    """View all users """
    
    users = crud.get_users()

    return render_template("all_users.html", users=users)


@app.route("/users", methods=['POST'])
def register_user():
    """Create a new user"""
    
    email = request.form.get('email')
    password = request.form.get('password')
    
    user = crud.get_user_by_email(email)
    
    if user:
        flash("Cannot create an account with that email. Please try again ")
    else: 
        user = crud.create_user(email,password)
        db.session.add(user)
        db.session.commit()
        flash("Account successfully created. Please log in")
        
    return redirect("/")


@app.route("/login", methods=['POST'])
def process_login():
    """Handle users login"""
    
    email = request.form.get('email')
    password = request.form.get('password')
    
    user = crud.get_user_by_email(email)
    
    if not user or user.password != password:
        flash("Please verify your email and password and try again")
        
    else: 
        session['user'] = email
        flash(f"Successfully logged in!")

        return redirect(url_for('show_user_profile', user_id = user.user_id))

    return redirect("/")   
    

@app.route('/users/<user_id>')
def show_user_profile(user_id):
    """Show profile for specific user"""

    user = crud.get_user_by_id(user_id)

    return render_template('user_profile.html', user = user)


@app.route('/movies/<movie_id>/ratings', methods=['POST'])
def rate_movie(movie_id):
    "Allow users to create a movie ratings"
    
    email = session['user']
    user = crud.get_user_by_email(email)
    
    score = int(request.form.get('rating'))
    rating = crud.create_rating(user_id = user.user_id, movie_id=movie_id, score=score)
    db.session.add(rating)
    db.session.commit()
    
    movie_ratings = crud.get_movie_ratings(movie_id)
    
    return redirect (url_for('show_movie', user_id = user.user_id, movie_id=movie_id,   movie_ratings = movie_ratings))
    

@app.route('/logout')
def logout():
    """Allow users to logout"""
    
    if 'user' in session:
        session.pop('user', None)

    return redirect('/')


if __name__ == "__main__":
    connect_to_db(app)
    app.run(host="0.0.0.0", debug=True)
