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
$start = ($page-1) * 10;
// echo $search;
if (!empty($search)) {

    $query = '';
    if ($searchMethod == 'id-desc') {
        $query = "SELECT * FROM task WHERE $searchType LIKE '%$search%' ORDER BY id DESC LIMIT $start, 10";
    }
    if ($searchMethod == 'id-asc') {
        $query = "SELECT * FROM task WHERE $searchType LIKE '%$search%' ORDER BY id ASC LIMIT $start, 10";
    }
    if ($searchMethod == 'name-desc') {
        $query = "SELECT * FROM task WHERE $searchType LIKE '%$search%' ORDER BY name DESC LIMIT $start, 10";
    }
    if ($searchMethod == 'name-asc') {
        $query = "SELECT * FROM task WHERE $searchType LIKE '%$search%' ORDER BY name ASC LIMIT $start, 10";
    }
    $result = mysqli_query($conn, $query);
    if (!$result) {
        die('Error de consulta ' . mysqli_error($conn));
    }
    $json = array();
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

    echo $jsonString;
} else {
    $query = "SELECT * FROM task ORDER BY id DESC LIMIT $start, 10";
    $result = mysqli_query($conn, $query);
    $json = array();
    while ($row = mysqli_fetch_array($result)) {
        $json[] = array(
            'name' => $row['name'],
            'description' => $row['description'],
            'id' => $row['id'],
            'done' => $row['done'],
            'type' => $row['type'],
        );
    }
    echo json_encode($json);
}