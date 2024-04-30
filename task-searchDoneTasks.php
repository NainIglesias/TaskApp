<?php
include ('database.php');
$query = "SELECT COUNT(*) as total, DAYOFWEEK(updated_at) as day_of_week FROM task WHERE done = 1 GROUP BY DAYOFWEEK(updated_at)";
$result = mysqli_query($conn, $query);

if ($result->num_rows > 0) {
    // Crear un array para almacenar el total de tareas completadas por día de la semana
    $completed_tasks_by_day = ['Lunes', 'Martes','Miercoles', 'Jueves','Viernes','Sábado','Domingo'];

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

// Cerrar la conexión

// Enviar la respuesta al usuario en formato JSON
echo json_encode($response);