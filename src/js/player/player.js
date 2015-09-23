var Player = function(radio) {
	this.player = $("#player");
	this.playPauseButton = $("#playPauseButton");
	this.muteButton = $("#muteButton");
	this.volumeSlider = $("#volumeSlider");
	this.radioSelector = $("#radioSelector");

	this.set_radio(radio);

	$(this.radioSelector).on('change input', (function() {
		console.log($(this.radioSelector).val());
		var radio = new window['' + $(this.radioSelector).val()]();
		this.set_radio(radio);
	}).bind(this));

	$(this.player).on('play playing', (function() {
		$(this.playPauseButton).removeClass("fa-play");
		$(this.playPauseButton).addClass("fa-pause");
	}).bind(this));

	$(this.player).on('pause ended', (function() {
		$(this.playPauseButton).removeClass("fa-pause");
		$(this.playPauseButton).addClass("fa-play");
	}).bind(this));

	$(this.player).on('volumechange', (function() {

		var volume = $(this.player).prop('volume');

		if ($(this.player).prop("volume") == 0 || $(this.player).prop("muted")) {
			$(this.muteButton).removeClass("fa-volume-up");
			$(this.muteButton).addClass("fa-volume-off");
		} else {
			$(this.muteButton).removeClass("fa-volume-off");
			$(this.muteButton).addClass("fa-volume-up");
		}

		var e = new CustomEvent('volume_changed', {'detail': {'volume': volume * 100}});
		document.dispatchEvent(e);
	}).bind(this));

	/*
	if (Cookies.get('playerVolume')) {
		$(player).prop('volume', Cookies.get('playerVolume'));
	}*/

	$(this.volumeSlider).val($(this.player).prop("volume") * 100);

	$(this.volumeSlider).on('change input', (function() {
		$(this.player).prop("volume", $(this.volumeSlider).val() / 100);
	}).bind(this));

	$(this.playPauseButton).on('click', (function() { this.play_pause() }).bind(this));
	$(this.muteButton).on('click', (function() { this.toggle_mute()}).bind(this));

	$(document).keypress((function(e) {
		if(e.which == 32) {
			this.play_pause();
		}
	}).bind(this));

	$(this.player).prop("muted", '');

	this.rds  = new RDS(this);
	this.rds.rds_loop();
};

Player.prototype.toggle_mute = function() {
	if ($(this.player).prop("muted")) {
		$(this.player).prop("muted", false);
	} else {
		$(this.player).prop("muted", true);
	}
}

Player.prototype.play_pause = function() {
		if ($(this.player).prop("paused")) {
			$(this.player).trigger("load");
		} else {
			$(this.player).trigger("pause");
		}
	}

Player.prototype.set_source = function(source) {
	$(this.player).children().first().attr("src", source);
	$(this.player).trigger("load");
}

Player.prototype.set_radio = function(radio) {
	this.radio = radio;
	this.set_source(radio.stream_url);
}

Player.prototype.set_volume = function(volume) {
	$(this.player).prop("volume", volume / 100);
	$(this.volumeSlider).val($(this.player).prop("volume") * 100);
}
