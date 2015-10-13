var LastFMClient = function(radio) {
	this.lastFM = new LastFM();
	this.lastScrobbledTrack = null;
	this.lastTrack = null;

	this.lastFMLoginLink = $("#lastFmLogIn");
	this.lastFMLoginLink.attr('href', 'http://www.last.fm/api/auth/?api_key=' + this.lastFM.api_key + '&cb=' + window.location.origin + window.location.pathname);

	var checkUserSession = (function() {
		this.lastFM.userGetInfo((function(data) {
			if (data.user) {
				this.lastFMLoginLink.hide();
			} else {
				configManager.set('lastfm_session_key', undefined);
			}
		}).bind(this));
	}).bind(this);

	var session_key = configManager.get('lastfm_session_key');
	if (session_key && session_key != 'undefined') {
		this.lastFM.session_key = session_key;
		checkUserSession();
	} else {
		var token = getURLParameter('token');
		if (token) {
			this.lastFM.authGetSession(token, (function(data) {
				configManager.set('lastfm_session_key', this.lastFM.session_key);
				checkUserSession();
			}).bind(this));
		}
	}

	document.addEventListener('new_radio', (function(e) {
		console.log("lastfm_client: new_radio listener, whiping scrobbling history");
		this.lastScrobbledTrack = null;
		this.lastTrack = null;
	}).bind(this));

	document.addEventListener('new_song', (function(e) {
		var track = e.detail.track;
		console.log("lastfm_client: new_song listener");
		console.log(track);

		if (this.lastTrack) {
			console.log("\twe have a track to scrobble");
			if (!this.lastScrobbledTrack || (this.lastTrack.name != this.lastScrobbledTrack.name && this.lastTrack.artist.name != this.lastScrobbledTrack.artist.name)) {
				console.log("\tthe new track is different from the one saved for scrobbling");
				this.lastFM.trackScrobble(this.lastTrack.name,
				 this.lastTrack.artist.name,
				 (function(data) {
					 console.log("\tscrobble result:");
					 console.log(data);
					 /*
					  * This needs to go in the callback because if the scrobble request arrives after the nowPlaying update lastfm will whipe the
					  * nowplaying status
					  */
					 if (track) {
						 console.log("\tupdating nowplaying after scrobble");
						 this.lastFM.trackNowPlaying(track.name, track.artist.name);
					 }

					 this.lastScrobbledTrack = this.lastTrack;
					 this.lastTrack = track;
				 }).bind(this));
			}
		} else if (track) {
			console.log("\twe didn't have a track, so just update the nowplaying")
			this.lastFM.trackNowPlaying(track.name, track.artist.name);
			this.lastTrack = track;
		} else {
			this.lastTrack = track;
		}

	}).bind(this));
}
