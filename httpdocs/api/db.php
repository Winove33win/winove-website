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

function winove_connect_db(): ?mysqli
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
    return null;
  }

  return $conn;
}

function winove_pick_table_data($parsed, ?string $tableName)
{
  if (!is_array($parsed)) {
    return null;
  }

  if (isset($parsed['data']) && is_array($parsed['data'])) {
    return $parsed['data'];
  }

  $isList = array_keys($parsed) === range(0, count($parsed) - 1);
  if ($isList) {
    foreach ($parsed as $item) {
      if (!is_array($item)) {
        continue;
      }
      $type = $item['type'] ?? null;
      $name = $item['name'] ?? null;
      if ($type === 'table' && (!$tableName || $name === $tableName)) {
        if (isset($item['data']) && is_array($item['data'])) {
          return $item['data'];
        }
      }
    }
  }

  return null;
}

function winove_read_fallback_table(string $tableName, array $filenames): array
{
  $baseDir = realpath(__DIR__ . '/../../backend/data');
  if ($baseDir === false) {
    return [];
  }

  foreach ($filenames as $filename) {
    $path = $baseDir . '/' . $filename;
    if (!is_readable($path)) {
      continue;
    }
    $content = file_get_contents($path);
    if ($content === false) {
      continue;
    }
    $parsed = json_decode($content, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
      continue;
    }
    $rows = winove_pick_table_data($parsed, $tableName);
    if (is_array($rows)) {
      return $rows;
    }
  }

  return [];
}

function winove_normalize_blog_row(array $row): array
{
  return [
    'id' => $row['id'] ?? null,
    'title' => $row['title'] ?? $row['titulo'] ?? null,
    'slug' => $row['slug'] ?? null,
    'excerpt' => $row['excerpt'] ?? $row['resumo'] ?? null,
    'content' => $row['content'] ?? $row['conteudo'] ?? null,
    'coverImage' => $row['coverImage'] ?? $row['imagem_destacada'] ?? $row['coverUrl'] ?? null,
    'date' => $row['date'] ?? $row['data_publicacao'] ?? null,
    'author' => $row['author'] ?? $row['autor'] ?? null,
    'category' => $row['category'] ?? $row['categoria'] ?? $row['Categoria'] ?? null,
  ];
}
?>
