<?php
// Lista simples de posts (sem paginação), usada na home e fallback
header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . '/db.php';
$conn = winove_connect_db();

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
        ORDER BY data_publicacao DESC";

$result = $conn->query($sql);

$posts = [];
if ($result) {
  while ($row = $result->fetch_assoc()) {
    $posts[] = $row;
  }
}

echo json_encode($posts, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
$conn->close();
?>
