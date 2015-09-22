var LastFM = function() {
	this.api_key = "177b6d071cb308964d20562549031f0b";
	this.api_secret = "bd6d6f4fd70d3e6696da309c26123329";
	this.session_key = '';

	this.base_params = {"api_key": this.api_key};
	this.base_url = "http://ws.audioscrobbler.com/2.0/";

	this.get_default_params = function() { return {"api_key": this.api_key}; };
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
	callback = callback || console.log;
	var params = this.get_default_params();
	params["method"] = "track.getInfo";
	params["track"] = track;
	params["artist"] = artist;
	this._sign(params);
	params["format"] = "json";

	$.get(this.base_url, params, callback);
}

LastFM.prototype.artistGetInfo = function(artist, callback) {
	callback = callback || console.log;
	var params = this.get_default_params();
	params["method"] = "artist.getInfo";
	params["artist"] = artist;
	params["autocorrect"] = "1";
	this._sign(params);
	params["format"] = "json";

	$.get(this.base_url, params, callback);
}

LastFM.prototype.trackGetCorrection = function(track, artist, callback) {
	callback = callback || console.log;
	var params = this.get_default_params();
	params["method"] = "track.getCorrection";
	params["track"] = track;
	params["artist"] = artist;
	this._sign(params);
	params["format"] = "json";

	$.get(this.base_url, params, callback);
}
/*
   LastFM.prototype.login(parameters, callback) {

   callback = callback || function(){};

   if (parameters.session_key) {
   console.log("LastFM: Loging in with old session key");
   console.log(parameters.session_key);
   this.session_key = parameters.session_key;
   } else if (parameters.token){
   console.log("LastFM: Generating sesion key with token");
   console.log(parameters.token);
   this.auth(parameters.token, callback);
   } else {
   console.log("LastFM: No useful data found");
   }
   };

   LastFM.prototype.userGetInfo()

   getUserInfo = function(callback) {
   exports.userInfo(function(data){
   exports.user = data.user;
   callback(data);
   });
   }

   _getDefaultParams = function() {
   return {"api_key": exports.api_key};
   }

   LastFM.prototype.authGetSession = function(token, callback) {

   callback = callback || log;
   var params = _getDefaultParams();
   params["token"] = token;
   params["method"] = "auth.getsession";
   _sign(params);
   params["format"] = "json";

   $.get(baseUrl, params, callback);
   }

   exports.userInfo = function(callback) {
   callback = callback || log;
   var params = _getDefaultParams();
   params["sk"] = this.session_key;
   params["method"] = "user.getInfo";
   _sign(params);
   params["format"] = "json";

   $.get(baseUrl, params, callback);
   }

   exports.nowPlaying = function(song, artist, duration, callback) {
   callback = callback || console.log;
   var params = _getDefaultParams();
   params["sk"] = this.session_key;
   params["method"] = "track.updateNowPlaying";
   params["track"] = song;
   params["artist"] = artist;
   params["duration"] = duration + 5;
   _sign(params);
   params["format"] = "json";

   $.post(baseUrl, params, callback);
   }

   exports.scrobble = function(song, artist, callback) {
   callback = callback || log;
   var params = _getDefaultParams();
params["sk"] = this.session_key;
params["method"] = "track.scrobble";
params["track"] = song;
params["artist"] = artist;
params["timestamp"] = Math.floor(Date.now() / 1000);
_sign(params);
params["format"] = "json";

$.post(baseUrl, params, callback);
}


exports.trackBuyLinks = function(track, artist, callback) {
	callback = callback || log;
	var params = _getDefaultParams();
	params["method"] = "track.getBuyLinks";
	params["track"] = track;
	params["artist"] = artist;
	params["country"] = 'es';
	_sign(params);
	params["format"] = "json";

	$.get(baseUrl, params, callback);
}

log = function( data ) {
	//console.log(data);
}
})(typeof exports === 'undefined' ? this['lastfm']={}: exports);
*/
