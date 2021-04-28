<?php

//reference post variables using $_POST[""]
$tags = $_POST["tags"];
echo $tags;

//show details of all variables posted
echo "<pre>"; print_r($_POST);

// \ is added as escape sequence at a lot of places, remove them.
$tags = str_replace("\\","",$tags);
echo $tags;

//PHP equivalent of JSON.parse();
//json_decode($tags);
?>