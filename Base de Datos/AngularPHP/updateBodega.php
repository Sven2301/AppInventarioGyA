<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requestes-Whit, Content-Type, Accept');

$json = file_get_contents('php://input');
$params = json_decode($json);
require("./DBConnection.php");
$con = returnConection();

mysqli_query($con ,"update bodega set IDBodega='$params->IDBodega' where IDBodega=$params->IDBodega");

class Result{}

$response = new Result();
$response->resultado = 'OK';
$response->mensaje = 'bodega modificada';


header('Content-Type: application/json');
echo json_encode($response);