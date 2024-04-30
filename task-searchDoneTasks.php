<?php
include ('database.php');

// Definir el número de semanas hacia atrás o hacia adelante (por defecto 0)
$weeks_offset = isset($_POST['weeks_offset']) ? intval($_POST['weeks_offset']) : 0;

// Construir la fecha límite
$date_limit = $weeks_offset > 0 ? "DATE_ADD(CURDATE(), INTERVAL $weeks_offset WEEK)" : "DATE_SUB(CURDATE(), INTERVAL " . abs($weeks_offset) . " WEEK)";

$query = "SELECT COUNT(*) as total, DAYOFWEEK(updated_at) as day_of_week 
          FROM task 
          WHERE done = 1 
          AND updated_at >= $date_limit
          GROUP BY DAYOFWEEK(updated_at)";

$result = mysqli_query($conn, $query);

if ($result->num_rows > 0) {
    // Crear un array para almacenar el total de tareas completadas por día de la semana
    $completed_tasks_by_day = ['Lunes', 'Martes','Miércoles', 'Jueves','Viernes','Sábado','Domingo'];

    // Almacenar los resultados en el array
    while ($row = $result->fetch_assoc()) {
        $completed_tasks_by_day[$row["day_of_week"]] = $row["total"];
    }

    // Preparar la respuesta en formato JSON
    $response['success'] = true;
    $response['message'] = 'Tareas completadas por día de la semana';
    $response['data'] = $completed_tasks_by_day;
} else {
    // Si no se encontraron tareas completadas
    $response['success'] = false;
    $response['message'] = 'No se encontraron tareas completadas.';
}

// Enviar la respuesta al usuario en formato JSON
echo json_encode($response);

