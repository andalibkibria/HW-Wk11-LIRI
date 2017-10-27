require('dotenv').config();
// ---- OMDB ----
const omdb = require('./commands/omdb');
// ---- TWITTER ----
const twitter = require('./commands/twitter');
// ---- SPOTIFY ----
const spotify = require('./commands/spotify');
// ---- DO WHAT IS SAYS ----

let command = process.argv[2];

let handle_song_movie = process.argv[3] === "--say" ? undefined : process.argv[3];
let options = {
	say: false
};

(function (arguments) {
	arguments.find((item, index) => {
		if (command === 'movie' && index === 4 && item === '--say') {
			options.say = true;
		}
	});
}(process.argv));

log_command(process.argv);

switch (command) {
	case ('tweets'):
		twitter(handle_song_movie, options);
		break;
	case ('spotify'):
		spotify(handle_song_movie, options);
		break;
	case ('movie'):
		omdb(handle_song_movie, options);
		break;
	case ('do-what-it-says'):
		doWhatItSays(handle_song_movie, options);
		break;
	default:
		help();
		break;
}