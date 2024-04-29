<?php
include ('database.php');
$type = $_POST['type'];
$page = intval($_POST['page']);
$start = ($page-1) * 10;
$query = "SELECT * from task ORDER BY name $type LIMIT $start, 10";
$result = mysqli_query($conn, $query);
$json = [];
while ($row = mysqli_fetch_array($result)) {
    $json[] = [
        'id' => $row['id'],
        'name' => $row['name'],
        'description' => $row['description'],
        'done' => $row['done'],
        'type' => $row['type'],
    ];
}
$jsonString = json_encode($json);
echo $jsonString;