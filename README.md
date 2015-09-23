# RadioFM
RadioFM is a web radio player

## Building
Simply check out the source and run `npm install` and `grunt` at the root of the repo. Deploy the created `build` directory on any web server and you're set.

## Contributing
The best way to contribute is to add new radios.

Radios should:

* Have a _radio_name_ and _stream_url_ properties
* Emit the `new_radio` event containing their object and their class name when they're instantiated so the config manager can save them for resuming the session later and the player can play the stream
* Emit the `new_rds` event when queried for the current song and it has changed sinces the last query

You can find the _Radio_ superclass in `src/js/radio.js` and use that as an example of all that should be implemented.

Additionaly, for now you'll have to add the radio manually to the radio selector in _index.html_
