document.addEventListener("DOMContentLoaded", () => {
    // Scan History and Statistics Elements
    const scanHistoryTable = document.getElementById('scan-history-table');
    const totalScannedEl = document.getElementById('total-scanned-count');
    const spamDetectedEl = document.getElementById('spam-detected-count');
    const nonSpamDetectedEl = document.getElementById('non-spam-detected-count');
    const timeFilterEl = document.getElementById('time-filter');

    let pieChart, barChart;

    // Function to filter scan history based on selected time period
    function filterScanHistory(history, timePeriod) {
        const now = new Date();
        return history.filter(scan => {
            const scanDate = new Date(scan.date);
            if (timePeriod === 'today') {
                return scanDate.toDateString() === now.toDateString();
            } else if (timePeriod === 'week') {
                return scanDate >= new Date(now.setDate(now.getDate() - 7));
            } else if (timePeriod === 'month') {
                return scanDate >= new Date(now.setMonth(now.getMonth() - 1));
            } else if (timePeriod === 'year') {
                return scanDate >= new Date(now.setFullYear(now.getFullYear() - 1));
            }
            return true; // all time
        });
    }

    // Function to create or update charts
    function updateCharts(spamDetected, nonSpamDetected) {
        const data = [spamDetected, nonSpamDetected];
        const labels = ['Phishing', 'Non-Spam'];

        // Pie chart
        if (pieChart) pieChart.destroy();
        pieChart = new Chart(document.getElementById('pieChart'), {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Scan Results',
                    data: data,
                    backgroundColor: ['#A91D3A', '#ffa90b'],
                    borderColor: '#EEEEEE',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: 'Phishing vs. Non-Spam' }
                }
            }
        });

        // Bar chart
        if (barChart) barChart.destroy();
        barChart = new Chart(document.getElementById('barChart'), {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Number of Scans',
                    data: data,
                    backgroundColor: ['#A91D3A', '#ffa90b'],
                    borderColor: '#151515',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true }
                },
                plugins: {
                    legend: { display: false },
                    title: { display: true, text: 'Phishing and Non-Spam Counts' }
                }
            }
        });
    }

    function loadScanHistory() {
        const history = JSON.parse(localStorage.getItem('scanHistory')) || [];
        const timePeriod = timeFilterEl.value;

        const filteredHistory = filterScanHistory(history, timePeriod);

        const totalScans = filteredHistory.length;
        const spamDetected = filteredHistory.filter(scan => scan.result && scan.result.includes('Phishing')).length;
        const nonSpamDetected = totalScans - spamDetected;

        totalScannedEl.textContent = totalScans;
        spamDetectedEl.textContent = spamDetected;
        nonSpamDetectedEl.textContent = nonSpamDetected;

        scanHistoryTable.innerHTML = '';
        const header = document.createElement('thead');
        header.innerHTML = `
            <tr>
                <th>#</th>
                <th>Sender</th>
                <th>Title</th>
                <th>Result</th>
                <th>Date</th>
                <th>Action</th>
            </tr>
        `;
        scanHistoryTable.appendChild(header);

        if (filteredHistory.length === 0) {
            scanHistoryTable.innerHTML += '<tr><td colspan="6" class="no-history">No scan history available</td></tr>';
        } else {
            filteredHistory.forEach((scan, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${scan.sender}</td>
                    <td>${scan.title}</td>
                    <td>${scan.result}</td>
                    <td>${scan.date || 'N/A'}</td>
                    <td><button class="delete-btn" data-index="${index}" style="background-color: #dc3545; color: white; border: none; border-radius: 5px; padding: 8px 12px;">Delete</button></td>
                `;
                scanHistoryTable.appendChild(row);
            });
        }

        updateCharts(spamDetected, nonSpamDetected);
    }

    // Event listeners
    timeFilterEl.addEventListener('change', loadScanHistory);

    // Load initial scan history
    loadScanHistory();
});
