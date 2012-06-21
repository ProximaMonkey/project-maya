<?php



     if ($db = new SQLite3('../db.sqlite')) {
        
        $files = glob("*.wav");

        foreach($files as $file) {
            $file = trim($file);
            $f = base64_encode(file_get_contents($file));
            $fname = explode(".", $file);
            $fn = $fname[0];
            print_r($fname);
            $db->query("insert into audio values (NULL, 'speech', 0, '#EFEFEF', '{$fn}', '{$fn}', 1, '{$f}')");
            echo("insert into audio values (NULL, 'speech',0, '#EFEFEF', '{$fn}', '{$fn}', 1, '{$f}')<br>");
        }
       
    } else {
        die($err);
    }