var ConfigManager = function() {
	document.addEventListener('new_radio', function(e) {
		configManager.set('radio', e.detail.radio.class_name);
	});

	document.addEventListener('volume_changed', function(e) {
		configManager.set('player_volume', e.detail.volume);
	});
}

ConfigManager.prototype.get = function(key) {
	var value = Cookies.get(key);

	console.log("get: " + key + "=" + value);

	return value;
}

ConfigManager.prototype.set = function(key, value) {
	console.log("set: " + key + "=" + value);
	Cookies.set(key, value, { expires: Infinity });
}
