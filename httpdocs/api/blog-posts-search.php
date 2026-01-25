<?php
// Busca com filtros + paginação
header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . '/db.php';
$conn = winove_connect_db();

$page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
$pageSize = isset($_GET['pageSize']) ? max(1, intval($_GET['pageSize'])) : 10;
$offset = ($page - 1) * $pageSize;
$q = isset($_GET['q']) ? trim($_GET['q']) : '';
$category = isset($_GET['category']) ? trim($_GET['category']) : '';

$items = [];
if ($conn) {
  $wheres = [];
  if ($q !== '') {
    $qEsc = $conn->real_escape_string($q);
    $wheres[] = "(titulo LIKE '%$qEsc%' OR resumo LIKE '%$qEsc%')";
  }

  if ($category !== '') {
    $catEsc = $conn->real_escape_string($category);
    $wheres[] = "categoria = '$catEsc'";
  }
  $whereSql = count($wheres) ? ('WHERE ' . implode(' AND ', $wheres)) : '';

  // total
  $total = 0;
  $countSql = "SELECT COUNT(*) AS total FROM blog_posts $whereSql";
  if ($resCount = $conn->query($countSql)) {
    if ($row = $resCount->fetch_assoc()) {
      $total = intval($row['total']);
    }
  }

  $sql = "SELECT id,
                 titulo           AS title,
                 slug             AS slug,
                 resumo           AS excerpt,
                 conteudo         AS content,
                 imagem_destacada AS coverImage,
                 data_publicacao  AS date,
                 autor            AS author,
                 categoria        AS category
          FROM blog_posts
          $whereSql
          ORDER BY data_publicacao DESC
          LIMIT $pageSize OFFSET $offset";

  $result = $conn->query($sql);
  if ($result) {
    while ($row = $result->fetch_assoc()) {
      $items[] = $row;
    }
  }

  $conn->close();
} else {
  $fallback = winove_read_fallback_table('blog_posts', ['blog_posts.json', 'blog-posts.json', 'blog-posts.dump.json']);
  $filtered = [];
  foreach ($fallback as $row) {
    $normalized = winove_normalize_blog_row($row);
    if ($category !== '' && strcasecmp($normalized['category'] ?? '', $category) !== 0) {
      continue;
    }
    if ($q !== '') {
      $haystack = strtolower(
        trim(($normalized['title'] ?? '') . ' ' . ($normalized['excerpt'] ?? '') . ' ' . ($normalized['content'] ?? ''))
      );
      if (strpos($haystack, strtolower($q)) === false) {
        continue;
      }
    }
    $filtered[] = $normalized;
  }
  $total = count($filtered);
  $items = array_slice($filtered, $offset, $pageSize);
}

echo json_encode([
  'items' => $items,
  'total' => $total,
  'page' => $page,
  'pageSize' => $pageSize,
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

?>
