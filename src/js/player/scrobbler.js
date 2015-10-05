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

	document.addEventListener('new_song', (function(e) {
		var track = e.detail.track;

		if (this.lastTrack) {
			if (!this.lastScrobbledTrack || (this.lastTrack.name != this.lastScrobbledTrack.name && this.lastTrack.artist.name != this.lastScrobbledTrack.artist.name)) {
				this.lastFM.trackScrobble(this.lastTrack.name, this.lastTrack.artist.name, (function() { this.lastFM.trackNowPlaying(track.name, track.artist.name)}).bind(this));
				this.lastScrobbledTrack = track;
			}
		} else if (track) {
			this.lastFM.trackNowPlaying(track.name, track.artist.name);
		}

		this.lastTrack = track;
	}).bind(this));
}