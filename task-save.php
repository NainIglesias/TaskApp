<?php
include ('database.php');
$data = $_POST['data'];
if (!empty($data['name']) && !empty($data['description'])) {
    $query = "INSERT INTO task (name, description, type) VALUES ('$data[name]', '$data[description]','$data[type]')";
    echo $data['name'] . $data['description'];
    if ($conn->query($query) === true) {
        echo 'Registro insertado correctamente';
    } else {
        die('Error en la insercion');
    }

} else if (!empty($data['id'])) {
    $query = "UPDATE task SET done = '$data[state]' WHERE id = '$data[id]'";
    // echo 'Query ' . $query;
    if ($conn->query($query) === true) {
        echo 'Registro editado correctamente';
    } else {
        die('Error en la insercion');
    }
}