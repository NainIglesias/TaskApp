<?php
include ('database.php');
$query = 'SELECT COUNT(*) AS count FROM task';
$result = mysqli_query($conn, $query);

if ($result) {
    $row = mysqli_fetch_assoc($result);
    $count = $row['count'];

    echo json_encode(array('count' => $count));
} else {
    echo json_encode(array('error' => 'Error al obtener el recuento de registros'));
}