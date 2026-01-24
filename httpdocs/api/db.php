<?php
function winove_get_db_config(): array
{
  $host = getenv('DB_HOST') ?: 'lweb03.appuni.com.br';
  $port = getenv('DB_PORT') ?: '3306';
  $user = getenv('DB_USER') ?: 'winove';
  $password = getenv('DB_PASSWORD') ?: '9*19avmU0';
  $database = getenv('DB_NAME') ?: 'fernando_winove_com_br_';

  return [
    'host' => $host,
    'port' => intval($port),
    'user' => $user,
    'password' => $password,
    'database' => $database,
  ];
}

function winove_connect_db(): mysqli
{
  $config = winove_get_db_config();
  $conn = new mysqli(
    $config['host'],
    $config['user'],
    $config['password'],
    $config['database'],
    $config['port']
  );

  if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Erro de conexao com o banco"]);
    exit;
  }

  return $conn;
}
?>
