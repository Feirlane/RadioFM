var RadioM80 = function(){
	this.rds_url = 'http://www.yes.fm/a/radio/M80Radio/getWhatsOn?';

	this.last_track = null;
	this.second_to_last_track = null;
	this.last_program = null;
	this.last_data = null;

	var e = new CustomEvent('new_radio', {'detail': {'radio': this}});
	document.dispatchEvent(e);
};

RadioM80.prototype = Object.create(Radio.prototype);
RadioM80.prototype.constructor = RadioM80 ;

RadioM80.prototype.radio_name = 'M80 Radio';
RadioM80.prototype.stream_url = 'http://13393.live.streamtheworld.com/M80RADIO_SC';
RadioM80.prototype.stream_mimetype = 'audio/mpeg';

RadioM80.prototype.get_current_track = function() {
	$.get(this.rds_url, this.m80_get_track.bind(this), 'json');
};

RadioM80.prototype.m80_get_track = function(data) {
	var program = data.radio.programaactual;

	if (!this.last_program || program.descripcion !== this.last_program.descripcion) {
		this.last_program = program;
		var e = new CustomEvent('new_program', {'detail': {'program': program.descripcion, 'banner': program.foto_fondo}});
		document.dispatchEvent(e);
	}

	var track = {name: data.radio.hasonado[0].track, artist:{name: data.radio.hasonado[0].artist}};


	if (this.last_track && track.name == this.last_track.name && track.artist.name == this.last_track.artist.name) {
		return;
	}

	/*
	 * Sometimes, when a song changes, the next request after the changes is the previous song. Keep two last songs to check for this and don't change the current track if the second to last was the same as the one we've got now
	 */
	if (this.second_to_last_track && track.name == this.second_to_last_track.name && track.artist.name == this.second_to_last_track.artist.name) {
		return;
	}

	this.second_to_last_track = this.last_track;
	this.last_track = track;
	var e = new CustomEvent('new_rds', {'detail': {'track': track}});
	document.dispatchEvent(e);
};
