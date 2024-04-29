<?php
include('database.php');
$type = $_POST['type'];

$page = intval($_POST['page']);
$start = ($page-1) * 10;
$query = "SELECT * from task ORDER BY id $type LIMIT $start, 10";
// echo $query;
$result = mysqli_query($conn,$query);
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