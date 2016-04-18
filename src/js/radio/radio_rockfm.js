var RadioRockFM = function(){
	this.rds_url = 'cors.php?url=http://player.rockfm.fm/rdsrock.php?';
	this.program_banner_base = 'http://player.rockfm.fm/xml/img/';

	this.last_track = null;
	this.last_program = null;
	this.last_data = null;

	this.songReplacements = {};
	this.songReplacements[["", ""]] = ["", ""];
	/*
	this.songReplacements[["AEROSMITH FEAT.RUN DMC","WALK THIS WAY"]] =
		["Run-D.M.C.", "Walk This Way"];
	this.songReplacements[["BEASTIE BOYS", "FIGHT FOR YOU RIGHT"]] =
		["Beastie Boys", "Fight for Your Right"];
	this.songReplacements[["DYLAN BOB", "THE TIMES THEY ARE A CHANGING"]] =
		["Bob Dylan", "The Times They Are a-Changin'"];
	this.songReplacements[["CREEDENCE CLEARWATER REVIVAL", "HAVE YOU EVER SEEN TH"]] =
		["Creedence Clearwater Revival", "Have You Ever Seen the Rain"];
	this.songReplacements[["DIRE STRAITS", "WALK OF LIFEE"]] =
		["Dire Straits", "Walk of Life"];
	this.songReplacements[["FRAMPTON PETER", "BABY I LOVE YOUR WAY"]] =
		["Peter Frampton", "Baby, I Love Your Way"];
	this.songReplacements[["HELLOWEEN", "I WANT IT OUT MP3"]] =
		["HELLOWEEN", "I WANT OUT"];
	this.songReplacements[["HOLE", "CELEBRITY SKIN MP3"]] =
		["Hole", "Celebrity Skin"];
	this.songReplacements[["IRON MAIDEN", "TROOPER THE"]] =
		["Iron Maiden", "The Trooper"];
	this.songReplacements[["IGGY POP", "PASSENGER"]] =
		["Iggy Pop", "The Passenger"];
	this.songReplacements[["JETT JOAN & BLACKHEARTS", "I LOVE ROCK AND ROLL"]] =
		["Joan Jett and the Blackhearts", "I Love Rock 'n' Roll"];
	this.songReplacements[["JOE COCKER", "WTH A LITTLE HELP FROM MY FRIENDS"]] =
		["Joe Cocker", "With A Little Help From My Friends"];
	this.songReplacements[["KISS", "I WAS MADE FOR LOVIN YOU"]] =
		["Kiss", "I Was Made for Lovin' You"];
	this.songReplacements[["MEAT LOAF", "I'D DO ANYTHING FOR LOVE"]] =
		["Meat Loaf", "I'd Do Anything for Love (But I Won't Do That)"];
	this.songReplacements[["METALLICA", "FOR WHOM THE BELL TOLLS"]] =
		["Metallica", "For Whom the Bell Tolls"];
	this.songReplacements[["METALLICA", "MEMORY REMAINS"]] =
		["Metallica", "The Memory Remains"];
	this.songReplacements[["NEIL YOUNG", "ROCKIN´IN THE FREE WORLD"]] =
		["Neil Young", "Rockin' in the Free World"];
	this.songReplacements[["RAMONES", "ROCK & ROLL RADIO"]] =
		["Ramones", "Do You Remember Rock 'n' Roll Radio?"];
	this.songReplacements[["SCORPIONS", "ROCK YOU LIKE A HURRICAINE"]] =
		["Scorpions", "Rock You Like a Hurricane"];
	this.songReplacements[["SPIN DOCTORS", "TWO PRINCESS"]] =
		["Spin Doctors", "Two Princes"];
	this.songReplacements[["LEMONHEADS", "MRS.ROBINSON"]] =
		["The Lemonheads", "Mrs. Robinson"];
	this.songReplacements[["THE DOORS", "L.A. WOMAN MP3"]] =
		["The Doors", "L.A. Woman"];
	this.songReplacements[["THE OFFSPRING", "CAN'T GET MY (HEAD AROUND YOU)"]] =
		["The Offspring", "(Can't Get My) Head Around You"];
	this.songReplacements[["THE OFFSPRING", "KIDS AREN'T ALLRIGHT"]] =
		["The Offspring", "The Kids Aren't Alright"];
	this.songReplacements[["THE OFFSPRING", "PRETTY FLY (FOR THE WHITE GUY)"]] =
		["THE OFFSPRING", "PRETTY FLY (FOR A WHITE GUY)"];
	this.songReplacements[["THE ROLLING STONES", "IT´S ONLY ROCK&ROLL (BUT I LIKE"]] =
		["The Rolling Stones ", "It's Only Rock 'n Roll (But I Like It)"];
	this.songReplacements[["THE ROLLING STONES", "SYMPATHY FOR TTHE DEVIL"]] =
		["THE ROLLING STONES", "SYMPATHY FOR THE DEVIL"];
	this.songReplacements[["TOM PETTY & THE HEARTBREAKERS", "FREE FALLIN"]] =
		["Tom Petty and The Heartbreakers", "Free Fallin'"];
	this.songReplacements[["TROGGS THE", "WILD THING"]] =
		["The Troggs", "Wild Thing"];
	this.songReplacements[["U2", "I STILL HAVEN'T FOUND WHAT I AM LOOKING FOR"]] =
		["U2", "I Still Haven't Found What I'm Looking For"];
	this.songReplacements[["VAN HALEN", "AIN'T TALKING BOUT LOVE"]] =
		["Van Halen", "Ain't Talkin' 'Bout Love"];
	this.songReplacements[["VIVO Y SALVAJE)", "QUE HACE UNA CHICA... (DIRECTO"]] =
		["Burning", "¿Que Hace Una Chica Como Tu En Un Sitio Como Este?"];
	this.songReplacements[["YOUNG RASCALS", "GOOD LOVIN'"]] =
		["The Young Rascals", "Good Lovin'"];
		*/

	this.songIgnores = [];
	this.songIgnores.push(["Jingle", "EPYSB"]);

	var e = new CustomEvent('new_radio', {'detail': {'radio': this, 'name': 'RadioRockFM'}});
	document.dispatchEvent(e);
};


RadioRockFM.prototype = Object.create(Radio.prototype);
RadioRockFM.prototype.constructor = RadioRockFM;

RadioRockFM.prototype.get_current_track = function() {
	$.get(this.rds_url, this.rockfm_get_track.bind(this));
};

RadioRockFM.prototype.radio_name = 'RockFM';
RadioRockFM.prototype.stream_urls = ['http://195.55.74.211/cope/rockfm.aac', 'http://195.55.74.211/cope/rockfm-low.mp3'];
RadioRockFM.prototype.stream_mimetypes = ['audio/mpeg', 'audio/mpeg'];
RadioRockFM.prototype.class_name = 'RadioRockFM';

RadioRockFM.prototype.rockfm_get_track = function(data) {
	/*
	 * Remove track properties from the title, such as remaster or live
	 */
	data = data.replace(/\s*\(\s*remaster[^\)]*\)\s*/ig, "").trim();
	data = data.replace(/\s*\(\s*live[^\)]*\)\s*/ig, "").trim();

	/*
	 * If the raw data is the same as the last data obtained, just update
	 * the now playing untill the next check and return
	 */
	if (data == this.lastData)
		return;

	var tokens = data.split("@");
	if (tokens.length != 2) {
		return;
	}

	this.lastData = data

	var program = tokens[1]
	if (program != this.last_program) {
		var e = new CustomEvent('new_program', {'detail': {'program': program, 'banner': this.program_banner_base + program}});
		document.dispatchEvent(e);
	}

	this.last_program = program;

	tokens = tokens[0].split(':');

	if (tokens.length != 2 || !tokens[0] || !tokens[1]) {
		this.last_track = null;
		var e = new CustomEvent('new_rds', {'detail': {'track': null}});
		document.dispatchEvent(e);
		return;
	}

	var trackName = tokens[1].replace(/"/g, '').trim();
	var artistName = tokens[0].replace(/"/g, '').trim();
	var track = {name: trackName, artist:{name: artistName}};

	if (this.last_track && track.name == this.last_track.name && track.artist.name == this.last_track.artist.name) {
		return;
	}

	var comparison = [track.artist.name, track.name]
	if (this.songReplacements[comparison] !== undefined) {
		var replacement = this.songReplacements[comparison];
		track.name = replacement[1];
		track.artist.name = replacement[0]
	}

	comparison = [track.name, track.artist.name]
	if (this.songIgnores.indexOf(comparison) != -1) {
		track = null;
	} else if (this.songReplacements[comparison] !== undefined) {
		var replacement = this.songReplacements[comparison];
		track.name = replacement[0];
		track.artist.name = replacement[1]
	}

	this.last_track = track;
	var e = new CustomEvent('new_rds', {'detail': {'track': track}});
	document.dispatchEvent(e);
};

