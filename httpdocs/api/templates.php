<?php
// Lista templates com metadados (sem paginação)
header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . '/db.php';
$conn = winove_connect_db();

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

$templates = [];
if ($result) {
  while ($row = $result->fetch_assoc()) {
    $templates[] = $row;
  }
}

echo json_encode($templates, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
$conn->close();
?>
