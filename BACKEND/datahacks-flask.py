from flask import Flask, render_template, request
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import numpy as np
from sklearn.linear_model import LogisticRegression
import matplotlib.pyplot as plt
import requests
from PIL import Image
from io import BytesIO
import os

app = Flask(__name__)

# === SPOTIFY SETUP ===
sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials(
    client_id="c90ea70f713742c69defa9541f372d06",
    client_secret="bfa4e194648b47d6a84da1ba3f9026b3"
))

def get_artist_info(artist_name):
    result = sp.search(q=f"artist:{artist_name}", type="artist", limit=1)
    if not result['artists']['items']:
        return None
    
    artist = result['artists']['items'][0]
    artist_id = artist['id']
    followers = artist['followers']['total']
    popularity = artist['popularity']
    image_url = artist['images'][0]['url'] if artist['images'] else None

    top_track_data = sp.artist_top_tracks(artist_id, country='US')
    top_track = top_track_data['tracks'][0] if top_track_data['tracks'] else None

    return {
        "id": artist_id,
        "name": artist['name'],
        "followers": followers,
        "popularity": popularity,
        "image_url": image_url,
        "top_track_name": top_track['name'] if top_track else "N/A",
        "top_track_url": top_track['external_urls']['spotify'] if top_track else None,
        "top_track_preview": top_track['preview_url'] if top_track else None
    }

def simulate_model():
    X = np.array([[1000, 20], [5000, 40], [100000, 75], [10000, 60], [250000, 85]])
    y = [0, 0, 1, 0, 1]
    model = LogisticRegression()
    model.fit(X, y)
    return model

def predict_mainstream_probabilities(model, followers, popularity):
    years = []
    base = np.array([[followers, popularity]])
    if followers >= 70:
        growth_rate_followers = 1.4
        growth_rate_popularity = 1.05
    elif followers >50 or followers <70:
        growth_rate_followers = 1.7
        growth_rate_popularity = 1.1
    else:
        growth_rate_followers = 1.8
        growth_rate_popularity=1.13
    for year in range(1, 6):
        proj_followers = followers * (growth_rate_followers ** year)
        proj_popularity = min(popularity * (growth_rate_popularity ** year), 100)
        prob = model.predict_proba([[proj_followers, proj_popularity]])[0][1]
        years.append(round(prob, 3))
    return years

def plot_probabilities(probabilities, artist_name):
    years = [f"Year {i+1}" for i in range(len(probabilities))]
    plt.figure(figsize=(6, 4))
    plt.plot(years, probabilities, marker='o')
    plt.ylim(0, 1)
    plt.title(f"Mainstream Prediction for {artist_name}")
    plt.ylabel("Probability")
    plt.grid(True)
    plt.tight_layout()
    plot_path = os.path.join("static", "plot.png")
    plt.savefig(plot_path)
    plt.close()
    return plot_path

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        artist_name = request.form["artist"]
        artist = get_artist_info(artist_name)
        if not artist:
            return render_template("index.html", error="Artist not found")

        model = simulate_model()
        probs = predict_mainstream_probabilities(model, artist["followers"], artist["popularity"])
        plot_file = plot_probabilities(probs, artist["name"])

        return render_template("index.html",
            artist=artist,
            probs=probs,
            plot_file=plot_file
        )

    return render_template("index.html")
