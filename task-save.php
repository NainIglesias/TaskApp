<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
include ('database.php');
$data = $_POST['data'];
if (!empty($data['name']) && !empty($data['description'])) {

    $query = '';
    if (!$data['id'] == "") {
        $query = "UPDATE task SET name ='$data[name]' , description = '$data[description]', type = '$data[type]' WHERE id = '$data[id]'";
    } else {
        $query = "INSERT INTO task (name, description, type) VALUES ('$data[name]', '$data[description]','$data[type]')";
    }

    // echo $data['name'] . $data['description'];

    if ($conn->query($query) === true) {
        if (!empty($data['id'])) {
            echo 'Registro editado correctamente';

        } else {
            echo 'Registro insertado correctamente';
        }
    } else {
        die('Error en la insercion');
    }

} else if (!empty($data['id'])) {
    $query = "UPDATE task SET done = '$data[state]' WHERE id = '$data[id]'";
    // echo 'Query ' . $query;
    if ($conn->query($query) === true) {
    } else {
        die('Error en la insercion');
    }
}