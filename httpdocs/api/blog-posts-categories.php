<?php
// Lista categorias com contagem
header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . '/db.php';
$conn = winove_connect_db();

$sql = "SELECT categoria AS category, COUNT(*) AS count
        FROM blog_posts
        GROUP BY categoria
        ORDER BY count DESC";

$result = $conn->query($sql);
$items = [];
if ($result) {
  while ($row = $result->fetch_assoc()) {
    $items[] = [
      'category' => $row['category'] !== null && $row['category'] !== '' ? $row['category'] : 'Sem categoria',
      'count' => intval($row['count'] ?? 0),
    ];
  }
}

echo json_encode($items, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
$conn->close();
?>
