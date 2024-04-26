<?php
include ('database.php');
$data = $_POST['data'];
if (!empty($data['id'])) {
    $query = "DELETE FROM task WHERE id = '$data[id]'";
    if($conn->query($query) == true){
        echo 'Registro eliminado correctamente';
    }else{
        die('Error al eliminar el registro');
    }
}