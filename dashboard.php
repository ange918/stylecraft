<?php
ini_set('session.cookie_httponly', 1);
session_start();

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: login.php');
    exit;
}

$adminUsername = $_SESSION['admin_username'] ?? 'Admin';
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Admin - Craft-Style</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Poppins', sans-serif;
            background: #f5f6fa;
            color: #333;
        }

        .dashboard-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .dashboard-header h1 {
            font-size: 24px;
        }

        .header-actions {
            display: flex;
            gap: 20px;
            align-items: center;
        }

        .user-info {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .logout-btn {
            background: rgba(255,255,255,0.2);
            color: white;
            padding: 8px 16px;
            border-radius: 6px;
            text-decoration: none;
            transition: background 0.3s;
        }

        .logout-btn:hover {
            background: rgba(255,255,255,0.3);
        }

        .dashboard-container {
            max-width: 1400px;
            margin: 30px auto;
            padding: 0 20px;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .stat-card {
            background: white;
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            transition: transform 0.3s;
        }

        .stat-card:hover {
            transform: translateY(-5px);
        }

        .stat-card .icon {
            width: 50px;
            height: 50px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            margin-bottom: 15px;
        }

        .stat-card.cart .icon {
            background: #e3f2fd;
            color: #2196f3;
        }

        .stat-card.pending .icon {
            background: #fff3e0;
            color: #ff9800;
        }

        .stat-card.confirmed .icon {
            background: #e8f5e9;
            color: #4caf50;
        }

        .stat-card.sales .icon {
            background: #f3e5f5;
            color: #9c27b0;
        }

        .stat-card h3 {
            font-size: 14px;
            color: #666;
            margin-bottom: 10px;
        }

        .stat-card .value {
            font-size: 32px;
            font-weight: 700;
            color: #333;
        }

        .charts-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
        }

        .chart-card {
            background: white;
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .chart-card h3 {
            margin-bottom: 20px;
            color: #333;
        }

        .orders-section {
            background: white;
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .orders-section h3 {
            margin-bottom: 20px;
            color: #333;
        }

        .orders-table {
            width: 100%;
            border-collapse: collapse;
        }

        .orders-table th {
            background: #f5f6fa;
            padding: 12px;
            text-align: left;
            font-weight: 600;
            color: #666;
            border-bottom: 2px solid #ddd;
        }

        .orders-table td {
            padding: 12px;
            border-bottom: 1px solid #eee;
        }

        .status-badge {
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
        }

        .status-badge.pending {
            background: #fff3e0;
            color: #ff9800;
        }

        .status-badge.confirmed {
            background: #e8f5e9;
            color: #4caf50;
        }

        @media (max-width: 768px) {
            .charts-section {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="dashboard-header">
        <h1><i class="fas fa-chart-line"></i> Dashboard Craft-Style</h1>
        <div class="header-actions">
            <div class="user-info">
                <i class="fas fa-user-circle" style="font-size: 24px;"></i>
                <span><?php echo htmlspecialchars($adminUsername); ?></span>
            </div>
            <a href="logout.php" class="logout-btn">
                <i class="fas fa-sign-out-alt"></i> Déconnexion
            </a>
        </div>
    </div>

    <div class="dashboard-container">
        <!-- Stats Grid -->
        <div class="stats-grid">
            <div class="stat-card cart">
                <div class="icon">
                    <i class="fas fa-shopping-cart"></i>
                </div>
                <h3>Ajouts au panier</h3>
                <div class="value" id="totalCartAdditions">0</div>
            </div>
            
            <div class="stat-card pending">
                <div class="icon">
                    <i class="fas fa-clock"></i>
                </div>
                <h3>Paniers en attente</h3>
                <div class="value" id="pendingOrders">0</div>
            </div>
            
            <div class="stat-card confirmed">
                <div class="icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>Commandes confirmées</h3>
                <div class="value" id="confirmedOrders">0</div>
            </div>
            
            <div class="stat-card sales">
                <div class="icon">
                    <i class="fas fa-dollar-sign"></i>
                </div>
                <h3>Total des ventes</h3>
                <div class="value" id="totalSales">$0</div>
            </div>
        </div>

        <!-- Charts Section -->
        <div class="charts-section">
            <div class="chart-card">
                <h3><i class="fas fa-chart-bar"></i> Top 5 Produits</h3>
                <canvas id="topProductsChart"></canvas>
            </div>
            
            <div class="chart-card">
                <h3><i class="fas fa-chart-pie"></i> Répartition Commandes</h3>
                <canvas id="ordersChart"></canvas>
            </div>
        </div>

        <!-- Latest Orders Section -->
        <div class="orders-section">
            <h3><i class="fas fa-list"></i> Dernières Commandes</h3>
            <table class="orders-table">
                <thead>
                    <tr>
                        <th>ID Commande</th>
                        <th>Client</th>
                        <th>Email</th>
                        <th>Total</th>
                        <th>Statut</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody id="ordersTableBody">
                    <tr>
                        <td colspan="6" style="text-align: center; padding: 30px; color: #999;">
                            Chargement des données...
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <script>
        let topProductsChart = null;
        let ordersChart = null;

        async function loadStats() {
            try {
                const response = await fetch('api/stats.php');
                const stats = await response.json();

                document.getElementById('totalCartAdditions').textContent = stats.total_cart_additions || 0;
                document.getElementById('pendingOrders').textContent = stats.pending_orders || 0;
                document.getElementById('confirmedOrders').textContent = stats.confirmed_orders || 0;
                document.getElementById('totalSales').textContent = '$' + (stats.total_sales || 0).toFixed(2);

                updateTopProductsChart(stats.top_products || {});
                updateOrdersChart(stats.pending_orders || 0, stats.confirmed_orders || 0);
                updateOrdersTable(stats.latest_orders || []);

            } catch (error) {
                console.error('Erreur lors du chargement des statistiques:', error);
            }
        }

        function updateTopProductsChart(topProducts) {
            const ctx = document.getElementById('topProductsChart').getContext('2d');
            
            if (topProductsChart) {
                topProductsChart.destroy();
            }

            const labels = Object.keys(topProducts).slice(0, 5);
            const data = Object.values(topProducts).slice(0, 5);

            topProductsChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Nombre d\'ajouts',
                        data: data,
                        backgroundColor: [
                            'rgba(102, 126, 234, 0.8)',
                            'rgba(118, 75, 162, 0.8)',
                            'rgba(33, 150, 243, 0.8)',
                            'rgba(255, 152, 0, 0.8)',
                            'rgba(76, 175, 80, 0.8)'
                        ],
                        borderRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        }

        function updateOrdersChart(pending, confirmed) {
            const ctx = document.getElementById('ordersChart').getContext('2d');
            
            if (ordersChart) {
                ordersChart.destroy();
            }

            ordersChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['En attente', 'Confirmées'],
                    datasets: [{
                        data: [pending, confirmed],
                        backgroundColor: [
                            'rgba(255, 152, 0, 0.8)',
                            'rgba(76, 175, 80, 0.8)'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }

        function updateOrdersTable(orders) {
            const tbody = document.getElementById('ordersTableBody');
            
            if (orders.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="6" style="text-align: center; padding: 30px; color: #999;">
                            Aucune commande pour le moment
                        </td>
                    </tr>
                `;
                return;
            }

            tbody.innerHTML = orders.map(order => `
                <tr>
                    <td>${order.order_id || 'N/A'}</td>
                    <td>${order.customer_name || 'N/A'}</td>
                    <td>${order.customer_email || 'N/A'}</td>
                    <td>$${parseFloat(order.total || 0).toFixed(2)}</td>
                    <td><span class="status-badge ${order.status || 'pending'}">${order.status === 'confirmed' ? 'Confirmée' : 'En attente'}</span></td>
                    <td>${order.timestamp || 'N/A'}</td>
                </tr>
            `).join('');
        }

        loadStats();
        setInterval(loadStats, 30000);
    </script>
</body>
</html>
