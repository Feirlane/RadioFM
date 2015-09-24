var ConfigManager = function() {
	document.addEventListener('new_radio', function(e) {
		console.log('ConfigManager: Saving radio: ' + e.detail.radio.class_name);
		Cookies.set('radio', e.detail.radio.class_name, { expires: Infinity });
	});

	document.addEventListener('volume_changed', function(e) {
		console.log('ConfigManager: Saving volume: ' + e.detail.volume);
		Cookies.set('player_volume', e.detail.volume, { expires: Infinity });
	});
}

ConfigManager.prototype.get_volume = function() {
	var volume = Cookies.get('player_volume') || 100;
	console.log('ConfigManager: Volume: ' + volume)
	return volume;
};

ConfigManager.prototype.get_radio = function() {
	var radio = Cookies.get('radio') || 'RadioRockFM';
	console.log('ConfigManager: Radio: ' + radio);
	return radio;
}
