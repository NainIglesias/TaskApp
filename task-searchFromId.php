<?php
include ('database.php');
$data = $_POST['data'];
if($data['id'] != ""){
    $query = "SELECT * FROM task WHERE id = '$data[id]'";
    $result = mysqli_query($conn, $query);

    $json = [];
    while($row = mysqli_fetch_array($result)){
        $json[] = ['name' => $row['name'], 'description' => $row['description'], 'type' => $row['type']];
    }
    
    echo json_encode($json);
}