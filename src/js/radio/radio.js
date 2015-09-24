var Radio = function() {
	var e = new CustomEvent('new_radio', {'detail': {'radio': this}});
	document.dispatchEvent(e);

	this.rds = false;
};

Radio.prototype.radio_name = 'No radio selected';
Radio.prototype.stream_url = 'No radio selected';
Radio.prototype.stream_mimetype = 'No radio selected';
Radio.prototype.class_name = 'Radio';

Radio.prototype.get_current_track = function() {
	if (!this.rds) {
		this.rds = true;
		var track = {name: 'Track Name', artist: {name: 'Artist Name'}};
		var e = new CustomEvent('new_rds', {'detail': {track: track}});
		document.dispatchEvent(e);
	}
};
