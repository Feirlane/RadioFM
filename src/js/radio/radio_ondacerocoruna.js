var RadioOndaCeroCoruna = function(){
	this.rds_url = '';
	this.program_url = ''

	this.last_track = null;
	this.last_date = null;
	this.second_to_last_track = null;
	this.last_program = null;

	var e = new CustomEvent('new_radio', {'detail': {'radio': this}});
	document.dispatchEvent(e);
};

RadioOndaCeroCoruna.prototype = Object.create(Radio.prototype);
RadioOndaCeroCoruna.prototype.constructor = RadioM80 ;

RadioOndaCeroCoruna.prototype.radio_name = 'Onda Cero Coruña';
RadioOndaCeroCoruna.prototype.stream_urls = ['http://icecast-streaming.nice264.com/acoruna'];
RadioOndaCeroCoruna.prototype.stream_mimetypes = ['audio/mpeg'];
RadioOndaCeroCoruna.prototype.class_name = 'RadioOndaCeroCoruna';

RadioOndaCeroCoruna.prototype.get_current_track = function() {
	var e = new CustomEvent('new_program', {'detail': {'program': 'Onda Cero A Coruña', 'banner': ''}});
	document.dispatchEvent(e);
	e = new CustomEvent('new_rds', {'detail': {'track': null}});
	document.dispatchEvent(e);
};
