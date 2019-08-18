console.log('\nKeys Loaded');
console.log("\n------------------\n")

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