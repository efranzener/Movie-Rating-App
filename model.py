"""Models for movie ratings app."""

from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin

db = SQLAlchemy()

class User(db.Model, UserMixin):
    """ A user."""
    
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key = True, autoincrement = True )
    name = db.Column(db.String, nullable = False)
    email = db.Column(db.String, unique = True, nullable = False)
    password = db.Column(db.String)

    def is_anonymous(self):
        return False


    def __repr__(self):
        return f"<User id = {self.id} email = {self.email}>"
    
 
class Movie(db.Model):
    """A movie"""

    __tablename__ = 'movies'

    movie_id = db.Column(db.Integer, autoincrement = True, primary_key = True)
    title = db.Column(db.String)
    overview = db.Column(db.Text)
    release_date = db.Column(db.DateTime)
    poster_path = db.Column(db.String)

    # ratings = a list of Rating objects
    
    def __repr__(self):
        return f"<Movie movie_id = {self.movie_id} title = {self.title}>"


class Rating(db.Model):
    """A movie rating"""

    __tablename__ = 'ratings'

    rating_id = db.Column(db.Integer, autoincrement = True, primary_key = True)
    score = db.Column(db.Integer)
    movie_id = db.Column(db.Integer, db.ForeignKey("movies.movie_id"))
    id = db.Column(db.Integer, db.ForeignKey("users.id"))

    movie = db.relationship("Movie", backref="ratings")
    user = db.relationship("User", backref="ratings")

    def __repr__(self):
        return f"<Rating rating_id={self.rating_id} score={self.score}>"


def connect_to_db(flask_app, db_uri="postgresql:///ratings", echo=True):
    flask_app.config["SQLALCHEMY_DATABASE_URI"] = db_uri
    flask_app.config["SQLALCHEMY_ECHO"] = False
    flask_app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.app = flask_app
    db.init_app(flask_app)

    print("Connected to the db!")


if __name__ == "__main__":
    from server import app

    # Call connect_to_db(app, echo=False) if your program output gets
    # too annoying; this will tell SQLAlchemy not to print out every
    # query it executes.

    connect_to_db(app)
