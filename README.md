project-maya
============

An open-source HTML5 implementation of a springboard with icons that will play speech through the HTML5 audio API.

Use audio/words.txt + speechgen.php to generate your own wordlist
use audio/insert.php to insert them into an sqlite db
use sqlite3 db.sqlite .dump > db.sqlite.sql to dump a fresh wordlist into the default injection db.

The default database contains a list of words grabbed from google translate: http://translate.google.com/translate_tts?tl=en&q=yoursound

This opens up the possiblitiy to define words, phrases, even whole sentences.

The sqlite database provides offline storage, and is autofilled from db.sqlite.sql on first login.

How to use? Open your (webkit) browser, and point it to index.html

More to come soon. Keep an eye on Project Maya via Hacker News:

http://news.ycombinator.com/item?id=4107019