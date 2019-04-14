<?php
include_once 'php-db.php';

// get the input
$name = trim(htmlspecialchars($_POST['name'] ?? ''));
$message = trim(htmlspecialchars($_POST['message'] ?? ''));

if (!$name || !$message)
	die;

// insert into the database
$stmt = $mysqli -> prepare('INSERT INTO chat_messages (name, time, message) VALUES (?,?,?)');
$time = time();
$stmt -> bind_param('sis', $name, $time, $message);
$stmt -> execute();
	
// Send the HTTP request to the websockets server (it runs both  HTTP and Websockets)
// (change the URL accordingly)
$ch = curl_init('http://localhost:8080');
// It's POST
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");

// we send JSON encoded data to the client
$jsonData = json_encode([
	'name' => $name,
	'message' => $message
]);
$query = http_build_query(['data' => $jsonData]);
curl_setopt($ch, CURLOPT_POSTFIELDS, $query);
// Just return the transfer
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
// execute
$response = curl_exec($ch);
 // close
curl_close($ch);


// Now real time notification should be sent to all the users


