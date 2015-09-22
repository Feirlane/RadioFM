var Radio = function() {
};

Radio.prototype.radio_name = 'No radio selected';
Radio.prototype.stream_url = 'No radio selected';
Radio.prototype.stream_mimetype = 'No radio selected';

Radio.prototype.get_current_track = function() {
	var track = {name: 'Track Name', artist: {name: 'Artist Name'}};
	var e = new CustomEvent('new_rds', {'detail': {track: track}});
	document.dispatchEvent(e);
};
