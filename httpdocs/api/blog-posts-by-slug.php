<?php
// Obtém um post por slug
header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . '/db.php';
$conn = winove_connect_db();

if (!isset($_GET['slug']) || $_GET['slug'] === '') {
  http_response_code(400);
  echo json_encode(["error" => "slug_obrigatorio"]);
  exit;
}

$slug = $conn->real_escape_string($_GET['slug']);
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
        WHERE slug = '$slug' LIMIT 1";

$result = $conn->query($sql);
if ($result && $row = $result->fetch_assoc()) {
  echo json_encode($row, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} else {
  http_response_code(404);
  echo json_encode(["error" => "nao_encontrado"]);
}

$conn->close();
?>
