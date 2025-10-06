<?php
header('Content-Type: application/json');

// Basic origin validation - only allow requests from the same server
$referer = $_SERVER['HTTP_REFERER'] ?? '';
$serverName = $_SERVER['SERVER_NAME'] ?? '';
if (!empty($referer) && !str_contains($referer, $serverName)) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Invalid origin']);
    exit;
}

$dataDir = __DIR__ . '/../data';
if (!file_exists($dataDir)) {
    mkdir($dataDir, 0777, true);
}

$cartFile = $dataDir . '/cart_additions.json';
$ordersFile = $dataDir . '/orders.json';

function loadData($file) {
    if (file_exists($file)) {
        $content = file_get_contents($file);
        return json_decode($content, true) ?: [];
    }
    return [];
}

function saveData($file, $data) {
    file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT));
}

// Rate limiting: max 100 events per IP per hour
function checkRateLimit($ip) {
    $rateLimitFile = __DIR__ . '/../data/rate_limit.json';
    $limits = [];
    if (file_exists($rateLimitFile)) {
        $limits = json_decode(file_get_contents($rateLimitFile), true) ?: [];
    }
    
    $hour = date('Y-m-d H');
    $key = $ip . '_' . $hour;
    $count = $limits[$key] ?? 0;
    
    if ($count >= 100) {
        return false;
    }
    
    $limits[$key] = $count + 1;
    
    // Clean old entries
    foreach ($limits as $k => $v) {
        if (!str_contains($k, $hour)) {
            unset($limits[$k]);
        }
    }
    
    file_put_contents($rateLimitFile, json_encode($limits));
    return true;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $clientIp = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    
    if (!checkRateLimit($clientIp)) {
        http_response_code(429);
        echo json_encode(['success' => false, 'message' => 'Rate limit exceeded']);
        exit;
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    $type = $input['type'] ?? '';
    
    // Only allow cart_add tracking from client (orders are tracked server-side)
    if ($type === 'cart_add') {
        // Validate required fields
        $productId = filter_var($input['product_id'] ?? 0, FILTER_VALIDATE_INT);
        $productName = htmlspecialchars($input['product_name'] ?? '', ENT_QUOTES, 'UTF-8');
        $quantity = filter_var($input['quantity'] ?? 1, FILTER_VALIDATE_INT);
        $price = filter_var($input['price'] ?? 0, FILTER_VALIDATE_FLOAT);
        
        if (!$productId || empty($productName) || !$quantity || !$price) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid data']);
            exit;
        }
        
        // Additional validation: reasonable limits
        if ($quantity > 10 || $quantity < 1) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid quantity']);
            exit;
        }
        
        if ($price < 0 || $price > 10000) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid price']);
            exit;
        }
        
        $cartData = loadData($cartFile);
        $cartData[] = [
            'product_id' => $productId,
            'product_name' => $productName,
            'quantity' => $quantity,
            'price' => $price,
            'timestamp' => date('Y-m-d H:i:s')
        ];
        saveData($cartFile, $cartData);
        echo json_encode(['success' => true, 'message' => 'Cart addition tracked']);
        
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid type']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
