<?php
// Lista templates com metadados (sem paginação)
header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . '/db.php';
$conn = winove_connect_db();

$templates = [];
if ($conn) {
  $sql = "SELECT id,
                 slug,
                 title,
                 content,
                 meta,
                 created_at,
                 updated_at
          FROM templates
          ORDER BY created_at DESC";

  $result = $conn->query($sql);
  if ($result) {
    while ($row = $result->fetch_assoc()) {
      $templates[] = $row;
    }
  }

  $conn->close();
} else {
  $templates = winove_read_fallback_table('templates', ['templates.json', 'templates.dump.json', 'templates-data.json']);
}

if (!empty($templates)) {
  echo json_encode($templates, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} else {
  http_response_code(500);
  echo json_encode(["error" => "Erro ao carregar templates"]);
}
?>
