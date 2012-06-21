<?php


$base = "http://translate.google.com/translate_tts?tl=en&q=";

set_time_limit(0);

$words = file('words.txt');

foreach($words as $idx=>$word) {
	$word = trim($word);
	echo("Downloading voicefile for word: {$word}<br>");
	file_put_contents("{$word}.wav", file_get_contents("http://translate.google.com/translate_tts?tl=en&q=".urlencode($word)));
	flush();
}