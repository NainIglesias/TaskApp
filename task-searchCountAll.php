<?php
include ('database.php');
$query = 'SELECT COUNT(*) AS total FROM task';

$result = mysqli_query($conn, $query);

if ($result) {
    $row = mysqli_fetch_assoc($result);

    $total_rows = $row['total'];


    $response = array('total_rows' => $total_rows);

    echo json_encode($response);
} else {
    echo "Error al ejecutar la consulta: " . mysqli_error($conn);
}