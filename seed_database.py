"""Script to seed database."""

import os
import json
from random import choice, randint
from datetime import datetime

import crud
import model
import server

os.system('dropdb ratings')
os.system('createdb ratings')
model.connect_to_db(server.app)
model.db.create_all()


with open('data/movies.json') as f:
    movie_data = json.loads(f.read())
    

movies_in_db = []
for movie in movie_data:
    title, overview, poster_path = (
        movie['title'],
        movie['overview'],
        movie['poster_path'],
    )
    release_date = datetime.strptime(movie['release_date'], '%Y-%m-%d')

    db_movie = crud.create_movie(title, overview, release_date, poster_path)
    movies_in_db.append(db_movie)

model.db.session.add_all(movies_in_db)
model.db.session.commit()


for n in range(10):
    email = f"user{n}@test.com" 
    password = "test"
    username = "user" + "" + str(n)
    user = crud.create_user(username, email, password=password)
    model.db.session.add(user)

    for movie in range(10):
        # print("Im the movie_database", type(movies_in_db))
        random_movie = choice(movies_in_db)
        
        score = randint(1, 5)
        rating = crud.create_rating(user.id, random_movie.movie_id, score)
        model.db.session.add(rating)

model.db.session.commit()
