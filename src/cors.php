<?php

if (isset($_GET['url'])) {
	$url = $_GET['url'];

	$contents = file_get_contents($url);

	print($contents);
}
