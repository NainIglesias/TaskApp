<?php
$servername = "localhost";
$username = "root";
$password = "";
$database = "ajax_task";

$conn = new mysqli($servername, $username, $password, $database);
if ($conn->connect_error) {
    die("Error de conexion: " . $conn->connect_error);
} else {
    // echo "Conexion exitosa";
}

