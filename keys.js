console.log('this is loaded');

exports.spotify = {
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
};

exports.omdb = {
    id: process.env.OMDB_API_KEY
};

exports.bandsInTown = {
    id: process.env.BANDSINTOWN_CLIENT_ID
};