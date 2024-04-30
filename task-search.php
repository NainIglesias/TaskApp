<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
include ('database.php');
$data = $_POST['data'];

$search = $data['search'];
$searchType = $data['searchType'];
$searchMethod = $data['method'];
$page = intval($data['page']);
$start = ($page - 1) * 10;
// echo $search;

$exit = true;
$differencePages = 0;
while ($exit) {

    $taskType = $data['taskType'];
    $query = "SELECT * FROM task WHERE $searchType LIKE '%$search%'";

    // Agregamos la condición de filtrado por tipo de tarea si no es 'Type'
    if ($taskType != 'Type') {
        $query .= " AND type = '$taskType'";
    }

    // Agregamos la parte de ordenamiento y el límite basado en el valor de $searchMethod
    switch ($searchMethod) {
        case 'id-desc':
            $query .= " ORDER BY id DESC";
            break;
        case 'id-asc':
            $query .= " ORDER BY id ASC";
            break;
        case 'name-desc':
            $query .= " ORDER BY name DESC";
            break;
        case 'name-asc':
            $query .= " ORDER BY name ASC";
            break;
    }

    // Agregamos el límite para paginación
    $query .= " LIMIT $start, 10";
    $result = mysqli_query($conn, $query);
    if (!$result) {
        die('Error de consulta ' . mysqli_error($conn));
    }
    $json = [];
    while ($row = mysqli_fetch_array($result)) {
        $json[] = array(
            'name' => $row['name'],
            'description' => $row['description'],
            'id' => $row['id'],
            'done' => $row['done'],
            'type' => $row['type'],

        );
    }
    $jsonString = json_encode($json);


    $json == [] ? $start == 0 ? '' : $start -= 10 : $exit = false;
    if ($exit) {
        $differencePages++;
    }
}

$startPos = strpos($jsonString, '[');

// Extraer el JSON válido utilizando substr
$jsonString = substr($jsonString, $startPos);

// Decodificar el JSON para obtener un array
$jsonArray = json_decode($jsonString, true);

// Filtrar los arrays vacíos
$jsonArray = array_filter($jsonArray);

// Codificar el array nuevamente a JSON
$jsonStringFiltered = json_encode(array_values($jsonArray));

// Imprimir el JSON filtrado para enviar al cliente
$responseObj = [
    'data' => json_decode($jsonStringFiltered, true),
    'differencePages' => $differencePages
];

// Convertir el objeto a JSON
$responseJson = json_encode($responseObj);

// Imprimir el JSON para enviar al cliente
echo $responseJson;

