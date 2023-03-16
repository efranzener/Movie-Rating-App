from model import db, User, Movie, Rating, connect_to_db


def create_user(name, email, **kwargs):
    """Create and return a new user."""

    user = User(name=name, email=email)


    if "password" in kwargs.keys():
        user.password = kwargs['password']

        user = User(name=name, email=email, id=user.id, password=user.password)
    

    return user


def get_users():
    """ Return all users"""

    return User.query.all()


def get_user_by_email(email):
    """Return a user by email."""

    return User.query.filter(User.email == email).first()

# def get_user_by_username(username):
#     """Return a user by email."""

#     return User.query.filter(User.username == username).first()

def get_user_by_id(id):
    """Return a user by id"""

    return User.query.get(id)


def create_movie(title, overview, release_date, poster_path):
    """Create and return a new movie."""

    movie = Movie(
        title=title,
        overview=overview,
        release_date=release_date,
        poster_path=poster_path,
    )

    return movie


def get_movies():
    """ Return all movies"""

    return Movie.query.all()


def get_movie_by_id(movie_id):
    """ Return a particular movie by its id"""
    
    movie = Movie.query.get(movie_id)
    
    return movie


def create_rating(id, movie_id, score):
    """Create and return a new rating."""

    rating = Rating(id=id, movie_id=movie_id, score=score)
    
    return rating


def get_movie_ratings(movie_id):
    """Get all the ratings for a specific movie"""
    
    movie_ratings = Rating.query.filter(Rating.movie_id == movie_id).all()
    
    return movie_ratings

def update_rating(rating_id, new_score):
    """ Update a rating given rating_id and the updated score. """
    rating = Rating.query.get(rating_id)
    rating.score = new_score



if __name__ == '__main__':
    from server import app
    connect_to_db(app)