<?php
include ('database.php');
$data = $_POST['data'];

$search = $data['search'];
$searchType = $data['searchType'];

// echo $search;
if (!empty($search)) {

    $query = "SELECT * FROM task WHERE $searchType LIKE '%$search%'";
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
    $query = "SELECT * FROM task";
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