import random
import sqlite3
import json

# Connessione al database SQLite
conn = sqlite3.connect('what_do_you_meme.sqlite')
cursor = conn.cursor()

# Creazione delle tabelle
cursor.executescript('''
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS games;
DROP TABLE IF EXISTS rounds;
DROP TABLE IF EXISTS memes;
DROP TABLE IF EXISTS captions;

CREATE TABLE users (
    username TEXT PRIMARY KEY,
    password TEXT NOT NULL,
    salt TEXT NOT NULL
);

CREATE TABLE games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    score INTEGER DEFAULT 0,
    status INTEGER NOT NULL,
    rounds TEXT NOT NULL,
    FOREIGN KEY (username) REFERENCES users(username)
);

CREATE TABLE rounds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id INTEGER NOT NULL,
    meme_id INTEGER NOT NULL,
    captions TEXT NOT NULL,
    status INTEGER NOT NULL,
    score INTEGER DEFAULT 0,
    answer INTEGER,
    FOREIGN KEY (game_id) REFERENCES games(id),
    FOREIGN KEY (meme_id) REFERENCES memes(id)
);

CREATE TABLE memes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    imageUrl TEXT NOT NULL
);

CREATE TABLE captions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    meme_ids TEXT NOT NULL
);
''')

# Inserimento dei dati di esempio
memes = [
    ('skinner.jpg',),
    ('think.jpg',),
    ('what.jpg',),
    ('grudank.jpeg',),
    ('grugun.jpg',),
    ('megamind.webp',),
    ('spongebob.jpg',),
    ('OhnoCat.jpg',),
    ('eyes.jpg',),
    ('duck.jpg',),
    ('astonished.jpg',),
    ('beluga.jpg',),
    ('chihuahua.jpg',),
    ('cone.jpg',),
    ('cutie.jpg',),
    ('drunkduck.jpg',),
    ('flipflop.jpg',),
    ('shrek.jpg',),
    ('willsmith.jpg',),
]

import json

captions = [
    # Grudank
    ('When you realize you\'ve been reading the instructions wrong the entire time.', json.dumps([1])),
    ('When someone says "We need to talk."', json.dumps([1])),
    ('When you realize you left your phone at home.', json.dumps([1])),

    # Grugun
    ('When your boss says you have to work late.', json.dumps([2])),
    ('When you find out it\'s all-you-can-eat buffet night.', json.dumps([2])),
    ('When you wake up and realize it\'s Saturday.', json.dumps([2])),

    # Megamind
    ('When you meet someone who loves the same show as you.', json.dumps([3])),
    ('When you realize you\'ve been talking to someone for hours and have no idea what they said.', json.dumps([3])),
    ('When you see a cute animal video online and realize you\'ve been watching for hours.', json.dumps([3])),

    # OhnoCat
    ('When you see a spider in your room.', json.dumps([4])),
    ('When you find out your favorite restaurant is closing down.', json.dumps([4])),
    ('When you hear a weird noise in the middle of the night.', json.dumps([4])),

    # Shrek
    ('When you open a text from your ex.', json.dumps([5])),
    ('When you see your reflection after a long night.', json.dumps([5])),
    ('When you find out your favorite snack is sold out.', json.dumps([5])),

    # Skinner
    ('When you pretend to understand the lecture but you\'re actually lost.', json.dumps([6])),
    ('When you realize you left your keys inside the car.', json.dumps([6])),
    ('When your mom calls you by your full name.', json.dumps([6])),

    # Spongebob
    ('When you realize it\'s already December.', json.dumps([7])),
    ('When you try to eat healthy but junk food exists.', json.dumps([7])),
    ('When you find a parking spot on the first try.', json.dumps([7])),

    # Think
    ('When you come up with the perfect comeback hours later.', json.dumps([8])),
    ('When you realize you\'ve been using a word wrong your whole life.', json.dumps([8])),
    ('When you solve a problem that\'s been bothering you for days.', json.dumps([8])),

    # What
    ('When someone explains math to you and you still don\'t get it.', json.dumps([9])),
    ('When you see your ex with someone else.', json.dumps([9])),
    ('When you realize you sent a text to the wrong person.', json.dumps([9])),

    # Will Smith
    ('When you get caught talking to yourself.', json.dumps([10])),
    ('When you realize you\'ve been muted on the conference call the whole time.', json.dumps([10])),
    ('When you see a hilarious meme but can\'t laugh out loud.', json.dumps([10])),

    # Astonished
    ('When you realize you wore your glasses upside down all day and no one told you.', json.dumps([11])),
    ('When you try to read without your glasses and suddenly everything is a Picasso.', json.dumps([11])),
    ('When you finally understand a joke from last year.', json.dumps([11])),
    ('When you catch your crush staring at you, but it\'s actually someone behind you.', json.dumps([11])),

    # Beluga
    ('When you realize you\'ve been pronouncing a word wrong your whole life.', json.dumps([12])),
    ('When you open the fridge and remember you forgot to buy groceries.', json.dumps([12])),
    ('When you realize your meeting started five minutes ago.', json.dumps([12])),

    # Chihuahua
    ('When you wake up from a nap and can\'t tell if it\'s 7 AM or PM.', json.dumps([13])),
    ('When you see your reflection and wonder why no one told you about the spinach in your teeth.', json.dumps([13])),
    ('When you finally notice the "Kick Me" sign on your back.', json.dumps([13])),

    # Cone
    ('When you try to act cool but trip over your own feet.', json.dumps([14])),
    ('When you realize you\'ve been talking to someone for hours.', json.dumps([14])),
    ('When you find out your flight is delayed.', json.dumps([14])),

    # Cutie
    ('When you realize you\'re the only one who dressed up for the party.', json.dumps([15])),
    ('When you see your pet doing something cute.', json.dumps([15])),
    ('When you get the last slice of pizza.', json.dumps([15])),

    # Drunk Duck
    ('When you wake up after a night out and check your phone.', json.dumps([16])),
    ('When you see your friend doing something embarrassing.', json.dumps([16])),
    ('When you get home and realize you forgot to lock the door.', json.dumps([16])),

    # Duck
    ('When you get a notification that your package has arrived.', json.dumps([17])),
    ('When you discover the hidden fees after booking your vacation.', json.dumps([17])),
    ('When someone says "fun fact" and your brain explodes with knowledge.', json.dumps([17])),

    # Eyes
    ('When you realize you\'ve been using the wrong charger for your phone.', json.dumps([18])),
    ('When you try to be productive but end up watching TV all day.', json.dumps([18])),
    ('When you finally get home after a long day.', json.dumps([18])),

    # Flip Flop
    ('When you try to find your way in a new city without GPS.', json.dumps([19])),
    ('When you remember you left the oven on.', json.dumps([19])),
    ('When you see someone you know but can\'t remember their name.', json.dumps([19])),

    # Captions for multiple memes
    ('When you accidentally send a text to the wrong person and they reply.', json.dumps([0, 8])),
    ('When you find out your favorite show got cancelled.', json.dumps([0, 4])),
    ('When you remember you left the stove on.', json.dumps([0, 18])),
    ('Me, trying to comprehend how I spent $100 at Target."', json.dumps([1, 4])),
    ('When you see a cute animal video online.', json.dumps([2, 14])),
    ('When you\'re half asleep and hear a noise.', json.dumps([3, 16])),
    ('When your crush walks by and you try to act natural.', json.dumps([3, 9])),
    ('When you realize you left the water running and your house is flooded.', json.dumps([0, 18])),
    ('When you discover your favorite shirt has a stain.', json.dumps([4, 0])),
    ('When you find out you missed the bus.', json.dumps([1, 16])),
    ('When you realize you forgot your friend\'s birthday.', json.dumps([3, 8])),
    ('When you see the bill after a fancy dinner.', json.dumps([9, 3])),
    ('When your boss catches you looking at memes during work.', json.dumps([5, 9])),
    ('When you see your crush and accidentally walk into a pole.', json.dumps([10, 13])),
    ('When your pet does something hilarious but no one is around to see it.', json.dumps([14, 2])),
    ('When you try to stay awake during a boring meeting.', json.dumps([15, 17])),
    ('When you hear your favorite song on the radio.', json.dumps([6, 14])),
    ('When your friend starts telling an embarrassing story about you.', json.dumps([12, 15])),
    ('When you realize you\'ve been walking in the wrong direction for ten minutes.', json.dumps([11, 4])),
    ('When your parents use your childhood nickname in public.', json.dumps([0, 9])),
    ('When you find a long-lost item under your bed.', json.dumps([16, 0])),
    ('When you realize you\'ve been pronouncing your coworker\'s name wrong for years.', json.dumps([11, 7])),
    ('When your phone battery dies at the worst possible moment.', json.dumps([8, 17])),
    ('When you see a hilarious meme and try not to laugh out loud in public.', json.dumps([9, 2])),
    ('When you realize you sent a text to the wrong person and they reply.', json.dumps([0, 8])),
    ('When you realize it\'s Monday tomorrow.', json.dumps([4, 9])),
    ('When you try to unlock your phone but it doesn\'t recognize your face.', json.dumps([17, 9])),
    ('When you realize you missed your favorite show\'s new episode.', json.dumps([0, 4])),
    ('When you discover your pet has been hiding your socks.', json.dumps([14, 3])),
    ('When you realize you have to wake up early tomorrow.', json.dumps([4, 9])),
    ('When you see your favorite snack on sale.', json.dumps([6, 14])),
    ('When you finally finish a project you\'ve been working on for weeks.', json.dumps([7, 5])),
    ('When you see someone trip but try not to laugh.', json.dumps([13, 15])),
    ('When you\'re late and every light is green.', json.dumps([18, 16])),
    ('When your friend makes an embarrassing comment.', json.dumps([12, 10])),
    ('When you get a call from an unknown number.', json.dumps([17, 5])),
    ('When you see your favorite character die in a show.', json.dumps([0, 11])),
    ('When you realize you\'ve been talking on mute during a meeting.', json.dumps([9, 7])),
    ('When you find money in your old jacket pocket.', json.dumps([16, 0])),
    ('When your computer crashes right before you save your work.', json.dumps([8, 17])),
    ('When you realize you left the car running.', json.dumps([18, 5])),
    ('When you hear a funny joke and can\'t stop laughing.', json.dumps([14, 2])),
    ('When you discover your sibling has been using your stuff.', json.dumps([0, 12]))
]

users = [
    ('user1', 'hashed_password1', 'salt1'),
    ('user2', 'hashed_password2', 'salt2')
]

games = [
    ('user1', 10, 0, json.dumps([])),
    ('user2', 15, 1, json.dumps([]))
]

rounds = [
    (1, 1, json.dumps([1, 2]), 0),
    (2, 2, json.dumps([8, 9]), 1)
]

cursor.executemany('INSERT INTO memes (imageUrl) VALUES (?)', memes)
cursor.executemany('INSERT INTO captions (text, meme_ids) VALUES (?, ?)', captions)
cursor.executemany('INSERT INTO users (username, password, salt) VALUES (?, ?, ?)', users)
cursor.executemany('INSERT INTO games (username, score, status, rounds) VALUES (?, ?, ?, ?)', games)
cursor.executemany('INSERT INTO rounds (game_id, meme_id, captions, status) VALUES (?, ?, ?, ?)', rounds)

# Salva (committa) le modifiche
conn.commit()

# Chiudi la connessione
conn.close()

print("Database popolato con successo.")
