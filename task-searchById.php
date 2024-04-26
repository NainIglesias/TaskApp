<?php
include('database.php');
$type = $_POST['type'];
$query = "SELECT * FROM task ORDER BY id $type";
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