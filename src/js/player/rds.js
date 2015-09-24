var RDS = function(player) {

	this.player = player;
	this.timeout = 2 * 1000;

	this.dom_now_playing = $("#nowplaying");
	this.dom_track = $("#track");
	this.dom_artist = $("#artist");
	this.dom_program_banner = $("#programBanner");

	this.lfm = new LastFM();

	this.checkIfNeedsCorrection = function(track) {
		this.lfm.trackGetCorrection(track.name, track.artist.name, (function(data){
			if (data.corrections.correction) {
				this.lfm.trackGetInfo(data.corrections.correction.track.name,
							  data.corrections.correction.track.artist.name,
							  function( data ){
								  var e = new CustomEvent('new_song', {'detail': {'track': data.track}});
								  document.dispatchEvent(e);
							  });
				return;
			}
			var e = new CustomEvent('new_song', {'detail': {'track': track}});
			document.dispatchEvent(e);
		}).bind(this));
	}

	this.checkIfNeedsReversing = function(lfmTrack, track) {

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
				this.checkIfNeedsCorrection(reversedTrack);
			} else {
				this.checkIfNeedsCorrection(originalTrack);
			}
		}).bind(this));
	}

	document.addEventListener('new_rds', (function(e) {
		var track = e.detail.track;
		if (track) {
			this.lfm.trackGetInfo(track.name, track.artist.name, (function(data) { this.checkIfNeedsReversing(data, track)}).bind(this));
		} else {
			$(this.dom_now_playing).hide();
			$("body").css({"background-image": ""});
			$(this.dom_program_banner).show();
		}
	}).bind(this));

	document.addEventListener('new_song', (function(e) {
		var track = e.detail.track;
		if (track) {
			$(this.dom_track).text(track.name);
			$(this.dom_artist).text(track.artist.name);
			$(this.dom_program_banner).hide();
			$(this.dom_now_playing).show();
			$("#trackImage").attr("src", "loading.gif");
			$("#artistImage").attr("src", "loading.gif");
			$(".trackLink").attr("href", track.url);
			$(".artistLink").attr("href", track.artist.url);
			if (track.album && track.album.image[2]["#text"]) {
				$("#trackImage").attr("src", track.album.image[2]["#text"]);
			} else {
				$("#trackImage").attr("src", "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Solid_white.svg/1px-Solid_white.svg.png");
			}
			if (track.wiki) {
				$("#trackBio").html(track.wiki.summary);
			} else {
				$("#trackBio").html("");
			}

			this.lfm.artistGetInfo(track.artist.name, (function( artistInfo ) {
				$("#artistImage").attr("src", artistInfo.artist.image[3]["#text"]);
				$("#artistBio").html(artistInfo.artist.bio.summary);
				if (artistInfo.artist.image.length > 5) {
					$("body").css("background-image", "url('" + artistInfo.artist.image[4]["#text"] + "')");
				}
			}).bind(this));

			$("title").text(track.name + " - " + track.artist.name);
		} else {
			$(this.dom_now_playing).hide();
			$("body").css({"background-image": ""});
			$(this.dom_program_banner).show();
			$("title").text("RadioFM");
		}
	}).bind(this));

	document.addEventListener('new_program', (function(e) {
		$(this.dom_program_banner).attr('src', e.detail.banner);
	}).bind(this));

	document.addEventListener('new_radio', (function(e) {
		$(this.dom_now_playing).hide();
	}).bind(this));

};

RDS.prototype.rds_loop = function() {

	this.player.radio.get_current_track();

	setTimeout((function() { this.rds_loop(); }).bind(this), this.timeout);
};
