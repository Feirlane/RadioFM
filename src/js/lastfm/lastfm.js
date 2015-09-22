(function(exports){
	if (typeof window === 'undefined') {
		md5 = require('MD5');
		domino=require('domino');
		$=require('jquery')(domino.createWindow());
		XMLHttpRequest=require('xmlhttprequest').XMLHttpRequest;
		$.support.cors=true; // cross domain
		$.ajaxSettings.xhr=function(){return new XMLHttpRequest();};
	}

	exports.api_key = "177b6d071cb308964d20562549031f0b";
	api_secret = "bd6d6f4fd70d3e6696da309c26123329";
	exports.session_key = '';

	exports.user = {};

	baseParams = {"api_key": this.api_key};

	baseUrl = "http://ws.audioscrobbler.com/2.0/";

	exports.init = function(oldSessionKey, token, callback) {

		callback = callback || function(){};

		this.session_key = oldSessionKey;

		if(!this.session_key) {
			console.log('LASTFM: Creating session key');
			if (!token) {
				console.log('LASTFM: Token not present');
			} else {
				console.log('LASTFM: Generating key with token "' + token + '"');
				exports.auth(token, function(data) {
					exports.session_key = data.session.key;
					getUserInfo(function( data ){ callback(exports.session_key, data);	});
				});
			}
		} else {
			console.log("LASTFM: Resuming sesion with key'" + exports.session_key + "'");
			getUserInfo(function( data ){ callback(exports.session_key, data);	});
		}

	}

	getUserInfo = function(callback) {
		exports.userInfo(function(data){
			exports.user = data.user;
			callback(data);
		});
	}

	_getDefaultParams = function() {
		return {"api_key": exports.api_key};
	}

	_sign = function(params) {
		var sortedKeys = Object.keys(params).sort();
		var stringToSign = "";
		for (var i = 0; i < sortedKeys.length; ++i)
		{
			stringToSign += sortedKeys[i];
			stringToSign += params[sortedKeys[i]];
		}
		stringToSign += api_secret;

		var hash = md5(stringToSign);

		params["api_sig"] = hash;

		return hash;
	}

	exports.auth = function(token, callback) {
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
		callback = callback || log;
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

	exports.trackInfo = function(song, artist, callback) {
		callback = callback || log;
		var params = _getDefaultParams();
		params["method"] = "track.getInfo";
		params["track"] = song;
		params["artist"] = artist;
		_sign(params);
		params["format"] = "json";

		$.get(baseUrl, params,callback);
	}

	exports.artistInfo = function(artist, callback) {
		callback = callback || log;
		var params = _getDefaultParams();
		params["method"] = "artist.getInfo";
		params["artist"] = artist;
		params["autocorrect"] = "1";
		_sign(params);
		params["format"] = "json";

		$.get(baseUrl, params, callback);
	}

	exports.trackCorrection = function(track, artist, callback) {
		callback = callback || log;
		var params = _getDefaultParams();
		params["method"] = "track.getCorrection";
		params["track"] = track;
		params["artist"] = artist;
		_sign(params);
		params["format"] = "json";

		$.get(baseUrl, params, callback);
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
