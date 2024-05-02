<?php
include ('database.php');
if (isset($_POST['checkedGroup'])) {
    // Obtener los datos de "checkedGroup"
    $checkedGroup = $_POST['checkedGroup'];

    // Verificar si el array no está vacío
    if (!empty($checkedGroup)) {
        // Aquí puedes realizar cualquier proceso necesario con los datos recibidos
        $id_list = implode(",", $checkedGroup);

        // Construir la consulta SQL
        $query = "UPDATE task SET done = 1 WHERE id IN ($id_list)";
        if ($conn->query($query) == true) {
            echo "Elimiación de registros con éxito";
        } else {
            echo "Error en la eliminación de registros";
        }
    } else {
        // Si el array está vacío, enviar un mensaje indicando esto
    }
} else {
    echo "Array vacío";

}