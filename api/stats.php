<?php
ini_set('session.cookie_httponly', 1);
session_start();

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('HTTP/1.1 401 Unauthorized');
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

header('Content-Type: application/json');

$dataDir = __DIR__ . '/../data';
$cartFile = $dataDir . '/cart_additions.json';
$ordersFile = $dataDir . '/orders.json';

function loadData($file) {
    if (file_exists($file)) {
        $content = file_get_contents($file);
        return json_decode($content, true) ?: [];
    }
    return [];
}

$cartData = loadData($cartFile);
$ordersData = loadData($ordersFile);

$totalCartAdditions = count($cartData);
$pendingOrders = array_filter($ordersData, function($order) {
    return ($order['status'] ?? 'pending') === 'pending';
});
$confirmedOrders = array_filter($ordersData, function($order) {
    return ($order['status'] ?? 'pending') === 'confirmed';
});

$totalSales = array_reduce($confirmedOrders, function($sum, $order) {
    return $sum + (float)($order['total'] ?? 0);
}, 0);

$productCounts = [];
foreach ($cartData as $item) {
    $productName = $item['product_name'] ?? 'Unknown';
    if (!isset($productCounts[$productName])) {
        $productCounts[$productName] = 0;
    }
    $productCounts[$productName] += ($item['quantity'] ?? 1);
}
arsort($productCounts);
$topProducts = array_slice($productCounts, 0, 5, true);

$latestOrders = array_slice(array_reverse($ordersData), 0, 10);

$stats = [
    'total_cart_additions' => $totalCartAdditions,
    'pending_orders' => count($pendingOrders),
    'confirmed_orders' => count($confirmedOrders),
    'total_sales' => $totalSales,
    'top_products' => $topProducts,
    'latest_orders' => $latestOrders,
    'last_updated' => date('Y-m-d H:i:s')
];

echo json_encode($stats);
