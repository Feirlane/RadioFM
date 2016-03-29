var RadioM80 = function(){
	this.rds_url = 'http://cors.io?u=http://www.yes.fm/a/radio/fm/hasonado/M80RADIO?';
	this.program_url = 'http://cors.io?u=http://www.yes.fm/a/radio/fm/4/ficha?'

	this.last_track = null;
	this.last_date = null;
	this.second_to_last_track = null;
	this.last_program = null;

	var e = new CustomEvent('new_radio', {'detail': {'radio': this}});
	document.dispatchEvent(e);
};

RadioM80.prototype = Object.create(Radio.prototype);
RadioM80.prototype.constructor = RadioM80 ;

RadioM80.prototype.radio_name = 'M80 Radio';
RadioM80.prototype.stream_url = 'http://13303.live.streamtheworld.com/M80RADIO_SC';
RadioM80.prototype.stream_mimetype = 'audio/mpeg';
RadioM80.prototype.class_name = 'RadioM80';

RadioM80.prototype.get_current_track = function() {
	$.get(this.rds_url, this.m80_get_track.bind(this), 'json');
	$.get(this.program_url, this.m80_get_program.bind(this), 'json');
};

RadioM80.prototype.m80_get_program = function(data) {
	var program = data.result.program;

	if (!this.last_program || program.descripcion !== this.last_program.descripcion) {
		this.last_program = program;
		var e = new CustomEvent('new_program', {'detail': {'program': program.descripcion, 'banner': program.foto_fondo}});
		document.dispatchEvent(e);
	}
}

RadioM80.prototype.m80_get_track = function(data) {
	var new_date = new Date();
	var hhmm = data.result[0].time.split(":");
	new_date.setHours(hhmm[0], hhmm[1], 0, 0);
	var now = new Date();

	if (new_date > now) {
		console.log("M80: This song seems to have started yesterday");
		new_date = new Date(newDate.getDate()-5);
	}


	var track = {name: data.result[0].track, artist:{name: data.result[0].artist}};

	if (this.last_track && track.name == this.last_track.name && track.artist.name == this.last_track.artist.name) {
		return;
	}

	if (new_date < this.last_date) {
		console.log("M80: This song is previous to the last song we've got!");
		console.log(data);
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
	this.last_date = new_date;
	var e = new CustomEvent('new_rds', {'detail': {'track': track}});
	document.dispatchEvent(e);
};
