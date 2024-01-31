require('dotenv').config();

const express = require('express');
const hbs = require('hbs');


// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

// Iteration 3 - Step 1
app.get('/', (req, res) => {
    res.render('index');
})

// Iteration 3 - Step 2
app.get('/artist-search', (req, res) => {
    
    spotifyApi
    .searchArtists(req.query.artistName)
    .then(data => {
        const artists = data.body.artists.items;
        res.render('artist-search-results', {artists});
    })
    .catch(err => console.log('Error', err));

})

// Iteration 4
app.get('/albums/:artistId', (req, res, next) => {

    spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then(data => {
            res.render('albums', { albums: data.body.items });
        })
        .catch(err => console.log('Error', err));
});

//Iteration 5
app.get('/tracks/:trackId', (req, res, next) => {
    
    spotifyApi
        .getAlbumTracks(req.params.trackId)
        .then(data => {
            res.render('tracks', { tracks: data.body.items });
        })
        .catch(err => console.log('The error while getting album tracks occurred: ', err));
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
