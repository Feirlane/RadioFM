var RDS = function(player) {

	this.current_track = null;

	this.player = player;
	this.timeout = 2 * 1000;

	this.dom_now_playing = $("#nowplaying");
	this.dom_track = $("#track_header");
	this.dom_artist = $("#artist_header");
	this.dom_program_banner = $("#programBanner");

	this.lfm = new LastFM();

	this.checkIfNeedsCorrection = function(track) {
		console.log("rds: checking if needs correction");
		console.log(track);
		this.lfm.trackGetCorrection(track.name, track.artist.name, (function(data){
			if (data.corrections.correction) {
				console.log("\tcorrecting");
				this.lfm.trackGetInfo(data.corrections.correction.track.name,
				 data.corrections.correction.track.artist.name,
				 function( data ){
					 var trackToSend = track;
					 console.log(data);
					 if (data.track) {
						 trackToSend = data.track;
					 }
					 var e = new CustomEvent('new_song', {'detail': {'track': trackToSend}});
					 document.dispatchEvent(e);
				 });
				return;
			}
			console.log("\tno correction needed")
				var e = new CustomEvent('new_song', {'detail': {'track': track}});
			document.dispatchEvent(e);
		}).bind(this));
	}

	this.checkIfNeedsReversing = function(lfmTrack, track) {

		console.log("rds: Checking if needs reversing");
		console.log(track);

		var originalTrack = lfmTrack.track;
		if (!originalTrack) {
			originalTrack = {name: track.name,
				artist: {name: track.artist.name},
				playcount: 1};
		}
		/*
		 * We query for the reversed track and compare the playcounts.
		 * Since rockfm won't usually play esoteric songs, higher playcounts
		 * should yield better song matches
		 */
		this.lfm.trackGetInfo(track.artist.name, track.name, (function( data ){
			var reversedTrack = data.track;
			if (reversedTrack && (parseInt(originalTrack.playcount) < parseInt(reversedTrack.playcount))) {
				console.log("\treversing track<->artist");
				this.checkIfNeedsCorrection(reversedTrack);
			} else {
				console.log("\tno reversing needed");
				this.checkIfNeedsCorrection(originalTrack);
			}
		}).bind(this));
	}

	document.addEventListener('new_rds', (function(e) {
		var track = e.detail.track;
		this.current_track = track;
		console.log("rds: new_rds");
		console.log(track);
		var trackImage = $("#track_image");
		trackImage.hide();
		var artistImage = $("#artist_image");
		artistImage.hide();
		$("#background").css({"background-image": ""});
		if (track) {
			this.lfm.trackGetInfo(track.name, track.artist.name, (function(data) { this.checkIfNeedsReversing(data, track)}).bind(this));
		} else {
			console.log("rds: track is null, firing null new_song");
			$(this.dom_now_playing).hide();
			$(this.dom_program_banner).show();
			var e = new CustomEvent('new_song', {'detail': {'track': null}});
			document.dispatchEvent(e);
		}
	}).bind(this));

	document.addEventListener('new_song', (function(e) {
		var track = e.detail.track;
		console.log("rds: new_song listener");
		console.log(track);
		if (track) {
			$("#track_header").html(track.name);
			$(this.dom_artist).text(track.artist.name);
			$(this.dom_program_banner).hide();
			$(this.dom_now_playing).show();

			$(".track_link").attr("href", track.url);
			$(".artist_link").attr("href", track.artist.url);

			var trackImage = $("#track_image");
			var artistImage = $("#artist_image");

			// "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Solid_white.svg/1px-Solid_white.svg.png";
			if (track.album) {
				if (track.album.image[2]["#text"]) {
					console.log("\tsetting track image from track.album");
					trackImage.one('load', function() { trackImage.show(); }).attr('src', track.album.image[2]["#text"]);
				} else {
					console.debug("\tmissing track image, loading album details");
					this.lfm.albumGetInfo(track.album.name, track.artist.name, function( albumInfo ) {
						if (albumInfo.album.image[2]["#text"]) {
							console.log("\tloading track image from album");
							trackImage.one('load', function() { trackImage.show(); }).attr('src',  albumInfo.album.image[2]["#text"]);
						} else {
							console.log("\timage also missing on album, loading white");
							trackImage.one('load', function() { trackImage.show(); }).attr('src', "assets/images/cover.svg");
						}
					});
				}
			} else {
				console.log("\tthe whole of track.album is missing, loading white");
				trackImage.one('load', function() { trackImage.show(); }).attr('src', "assets/images/cover.svg");

			}

			if (track.wiki) {
				$("#trackBio").html(track.wiki.summary);
			} else {
				$("#trackBio").html("");
			}

			this.lfm.artistGetInfo(track.artist.name, (function( artistInfo ) {
				artistImage.one('load', function() { artistImage.show(); }).attr('src', artistInfo.artist.image[2]["#text"]);
				$("#artistBio").html(artistInfo.artist.bio.summary);
				if (artistInfo.artist.image.length > 5) {
					$("#background").css("background-image", "url('" + artistInfo.artist.image[4]["#text"] + "')");
				}
			}).bind(this));

			$("title").text(track.name + " - " + track.artist.name);
		} else {
			$(this.dom_now_playing).hide();
			$("#background").css({"background-image": ""});
			$(this.dom_program_banner).show();
			$("title").text("RadioFM");
		}
	}).bind(this));

	document.addEventListener('new_program', (function(e) {
		$(this.dom_program_banner).attr('src', e.detail.banner);
	}).bind(this));

	document.addEventListener('new_radio', (function(e) {
		$(this.dom_now_playing).hide();
		this.current_track = null;
	}).bind(this));

};

RDS.prototype.rds_loop = function() {

	this.player.radio.get_current_track();

	setTimeout((function() { this.rds_loop(); }).bind(this), this.timeout);
};
