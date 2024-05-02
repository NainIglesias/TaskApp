<?php
include ('database.php');

$weeks_offset = isset($_POST['weeks_offset']) ? intval($_POST['weeks_offset']) : 0;

// Construir la fecha límite
if ($weeks_offset >= 0) {
    // Si $weeks_offset es mayor o igual a 0, obtener la fecha límite para esta semana y semanas futuras
    $date_limit = "WEEK(updated_at) = WEEK(DATE_ADD(CURDATE(), INTERVAL $weeks_offset WEEK))";
} else {
    // Si $weeks_offset es negativo, obtener la fecha límite para la semana anterior a la fecha actual
    $weeks_to_subtract = abs($weeks_offset) + 1; // Sumar 1 para excluir la semana actual
    $date_limit = "WEEK(updated_at) = WEEK(DATE_SUB(DATE(CURDATE()), INTERVAL $weeks_to_subtract WEEK))";
}

$query = "SELECT COUNT(*) as total, DAYOFWEEK(updated_at) as day_of_week 
          FROM task 
          WHERE done = 1 
          AND $date_limit
          GROUP BY DAYOFWEEK(updated_at)";


$result = mysqli_query($conn, $query);

if ($result->num_rows > 0) {
    // Crear un array para almacenar el total de tareas completadas por día de la semana
    $completed_tasks_by_day = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

    // Almacenar los resultados en el array
    while ($row = $result->fetch_assoc()) {
        $completed_tasks_by_day[$row["day_of_week"]] = $row["total"];
    }

    // Preparar la respuesta en formato JSON
    $response['success'] = true;
    $response['message'] = 'Tareas completadas por día de la semana';
    $response['data'] = $completed_tasks_by_day;
    $response['query'] = $query;
} else {
    // Si no se encontraron tareas completadas
    $response['success'] = false;
    $response['message'] = 'No se encontraron tareas completadas.';
}

// Enviar la respuesta al usuario en formato JSON
echo json_encode($response);

