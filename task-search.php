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
$moreResults = 0;

$differencePages = 0;
while ($exit) {

    $taskType = $data['taskType'];
    // Se descompone la query en trozos para poder agregar partes dependiendo de los filtros
    // sin tener que repetir el mismo código 2 veces
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
    // Se hace una copia de la query para comprobar si hay resultados antes o despues
    $queryMoreResults = $query;
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
    $nextPageStart = ($page * 10);
    // Query para verificar si hay resultados en la siguiente página
    $queryNextPage = $queryMoreResults . " LIMIT $nextPageStart, 10";
    $resultNextPage = mysqli_query($conn, $queryNextPage);

    // Si el numero de filas es mayor a 0, hay resultados
    if (mysqli_num_rows($resultNextPage) > 0) {
        $moreResults = true;
    }

    $jsonString = json_encode($json);

    // Verificación para salir del bucle, si json = [] se resta 10 a start para que haga la paginación anterior,
    //  a menos que start ya sea 0 entonces sale del bucle
    $json == [] ? $start == 0 ? $exit = false : $start -= 10 : $exit = false;
    if ($exit) {
        $differencePages++;
    }
}
// Como la respuesta está puede estar compuesta por objetos vacios [], se filtra para convertirla a texto plano 
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
    // Información de la query
    'data' => json_decode($jsonStringFiltered, true),
    // Las páginas de diferencia con respecto a la página pasada
    'differencePages' => $differencePages,
    // Variable de corte que define si hay resultados en la siguiente paginación de esta misma sentencia
    'moreResults' => $moreResults,
];

// Convertir el objeto a JSON
$responseJson = json_encode($responseObj);

// Imprimir el JSON para enviar al cliente
echo $responseJson;

