<?php
// Lista categorias com contagem
header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . '/db.php';
$conn = winove_connect_db();

$items = [];
if ($conn) {
  $sql = "SELECT categoria AS category, COUNT(*) AS count
          FROM blog_posts
          GROUP BY categoria
          ORDER BY count DESC";

  $result = $conn->query($sql);
  if ($result) {
    while ($row = $result->fetch_assoc()) {
      $items[] = [
        'category' => $row['category'] !== null && $row['category'] !== '' ? $row['category'] : 'Sem categoria',
        'count' => intval($row['count'] ?? 0),
      ];
    }
  }

  $conn->close();
} else {
  $fallback = winove_read_fallback_table('blog_posts', ['blog_posts.json', 'blog-posts.json', 'blog-posts.dump.json']);
  $counts = [];
  foreach ($fallback as $row) {
    $normalized = winove_normalize_blog_row($row);
    $category = $normalized['category'] ?? 'Sem categoria';
    if ($category === '') {
      $category = 'Sem categoria';
    }
    $counts[$category] = ($counts[$category] ?? 0) + 1;
  }
  foreach ($counts as $category => $count) {
    $items[] = [
      'category' => $category,
      'count' => $count,
    ];
  }
}

if (!empty($items)) {
  echo json_encode($items, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} else {
  http_response_code(500);
  echo json_encode(["error" => "Erro ao carregar categorias"]);
}
?>
