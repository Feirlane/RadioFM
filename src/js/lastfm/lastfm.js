var LastFM = function() {
	this.api_key = "177b6d071cb308964d20562549031f0b";
	this.api_secret = "bd6d6f4fd70d3e6696da309c26123329";
	this.session_key = '';

	this.base_params = {"api_key": this.api_key};
	this.base_url = "//ws.audioscrobbler.com/2.0/";

	this.get_default_params = function() { return {"api_key": this.api_key}; };

	this.logger = function(data) { console.log("lastfm:"); console.log(data); };
};

LastFM.prototype._sign = function(params) {
	var sortedKeys = Object.keys(params).sort();
	var stringToSign = "";
	for (var i = 0; i < sortedKeys.length; ++i)
	{
		stringToSign += sortedKeys[i];
		stringToSign += params[sortedKeys[i]];
	}
	stringToSign += this.api_secret;

	var hash = md5(stringToSign);

	params["api_sig"] = hash;

	return hash;
}

LastFM.prototype.trackGetInfo = function(track, artist, callback) {
	callback = callback || this.logger;
	var params = this.get_default_params();
	params["method"] = "track.getInfo";
	params["track"] = track;
	params["artist"] = artist;
	this._sign(params);
	params["format"] = "json";

	$.ajax({
		url: this.base_url,
		data: params,
	}).always(callback);
}

LastFM.prototype.albumGetInfo = function(album, artist, callback) {
	callback = callback || this.logger;
	var params = this.get_default_params();
	params["method"] = "album.getInfo";
	params["album"] = artist;
	params["artist"] = artist;
	params["autocorrect"] = "1";
	this._sign(params);
	params["format"] = "json";

	$.ajax({
		url: this.base_url,
		data: params,
	}).always(callback);
}

LastFM.prototype.artistGetInfo = function(artist, callback) {
	callback = callback || this.logger;
	var params = this.get_default_params();
	params["method"] = "artist.getInfo";
	params["artist"] = artist;
	params["autocorrect"] = "1";
	this._sign(params);
	params["format"] = "json";

	$.ajax({
		url: this.base_url,
		data: params,
	}).always(callback);
}

LastFM.prototype.trackGetCorrection = function(track, artist, callback) {
	callback = callback || this.logger;
	var params = this.get_default_params();
	params["method"] = "track.getCorrection";
	params["track"] = track;
	params["artist"] = artist;
	this._sign(params);
	params["format"] = "json";

	$.ajax({
		url: this.base_url,
		data: params,
	}).always(callback);
}

LastFM.prototype.authGetSession = function(token, callback) {
	callback = callback || this.logger;

	var params = this.get_default_params();
	params["token"] = token;
	params["method"] = "auth.getsession";
	this._sign(params);
	params["format"] = "json";

	$.ajax({
		url: this.base_url,
		data: params
	}).success((function(data) {
		if (data.session) {
			this.session_key = data.session.key;
		}
	}).bind(this)).always(callback);
}

LastFM.prototype.userGetInfo = function(callback, user) {
	callback = callback || this.logger;
	var params = this.get_default_params();
	params["method"] = "user.getInfo";
	params["sk"] = this.session_key;
	if (user) {
		params["user"] = user;
	}
	this._sign(params);
	params["format"] = "json";

	$.ajax({
		url: this.base_url,
		data: params
	}).always(callback);
}

LastFM.prototype.trackScrobble = function(track, artist, callback) {
	callback = callback || this.logger;

	var params = this.get_default_params();
	params["sk"] = this.session_key;
	params["method"] = "track.scrobble";
	params["track"] = track;
	params["artist"] = artist;
	params["timestamp"] = Math.floor(Date.now() / 1000);
	this._sign(params);
	params["format"] = "json";

	$.ajax({
		method: 'POST',
		url: this.base_url,
		data: params,
	}).always(callback);
}

LastFM.prototype.trackNowPlaying = function(track, artist, callback) {
	callback = callback || this.logger;

	var params = this.get_default_params();
	params["method"] = "track.updateNowPlaying";
	params["artist"] = artist;
	params["track"] = track;
	params["duration"] = 300;
	params["sk"] = this.session_key;

	this._sign(params);
	params["format"] = "json";

	$.ajax({
		method: 'POST',
		url: this.base_url,
		data: params,
	}).always(callback);
}
