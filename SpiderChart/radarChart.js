window.selectAllCompanies = function() {
    const checkboxes = document.querySelectorAll('input[type=checkbox]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = true;
    });
    plotSelectedCompanies();
}

window.deselectAllCompanies = function() {
    const checkboxes = document.querySelectorAll('input[type=checkbox]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    plotSelectedCompanies();
}

document.addEventListener('DOMContentLoaded', function() {

		const DEFAULT_COLORS = [
			'rgba(255, 99, 132, 0.2)',
			'rgba(54, 162, 235, 0.2)',
			'rgba(255, 206, 86, 0.2)',
			'rgba(75, 192, 192, 0.2)',
			'rgba(153, 102, 255, 0.2)',
			'rgba(255, 159, 64, 0.2)'
		];

		const BORDER_COLORS = [
			'rgba(255, 99, 132, 1)',
			'rgba(54, 162, 235, 1)',
			'rgba(255, 206, 86, 1)',
			'rgba(75, 192, 192, 1)',
			'rgba(153, 102, 255, 1)',
			'rgba(255, 159, 64, 1)'
		];

		let radarChart;
	
		fetch('radarChart.csv')
			.then(response => response.text())
			.then(data => {
				const companies = parseCSV(data);
				displayCompanyCheckboxes(companies);
				drawRadarChart(companies);
			})
			.catch(error => {
				console.error('Error fetching and parsing data:', error);
			});

		function parseCSV(data) {
				const rows = data.trim().split("\n");
				const headers = rows.shift().split(",");
				const companies = [];
				rows.forEach(row => {
					const rowData = row.split(",");
					const company = {};
					headers.forEach((header, index) => {
						company[header] = rowData[index];
					});
					companies.push(company);
				});
				return companies;
		}
	
		function displayCompanyCheckboxes(companies) {
			const container = document.getElementById('companySelection');
			companies.forEach((company, index) => {
				const checkbox = document.createElement('input');
				checkbox.type = 'checkbox';
				checkbox.id = 'company' + index;
				checkbox.checked = true;
	
				const label = document.createElement('label');
				label.htmlFor = 'company' + index;
				label.appendChild(document.createTextNode(company.shortName));
	
				container.appendChild(checkbox);
				container.appendChild(label);
				container.appendChild(document.createElement('br'));
	
				checkbox.addEventListener('change', () => {
					const selectedCompanies = [];
					companies.forEach((c, i) => {
						if (document.getElementById('company' + i).checked) {
							selectedCompanies.push(c);
						}
					});
					drawRadarChart(selectedCompanies);
				});
			});
		}

		// function selectAllCompanies() {
		// 	const checkboxes = document.querySelectorAll('input[type=checkbox]');
		// 	checkboxes.forEach(checkbox => {
		// 		checkbox.checked = true;
		// 	});
		// 	plotSelectedCompanies();
		// }
		
		// function deselectAllCompanies() {
		// 	const checkboxes = document.querySelectorAll('input[type=checkbox]');
		// 	checkboxes.forEach(checkbox => {
		// 		checkbox.checked = false;
		// 	});
		// 	plotSelectedCompanies();
		// }
	
		function drawRadarChart(selectedCompanies) {
			const ctx = document.getElementById('radarChart').getContext('2d');
			const labels = ['fullTimeEmployees','volume','currentRatio','bookValue','totalCashPerShare','currentPrice'];
	
			const datasets = selectedCompanies.map((company, index) => ({
				label: company.shortName,
				data: labels.map(label => parseFloat(company[label])),
				backgroundColor: DEFAULT_COLORS[index % DEFAULT_COLORS.length],
				borderColor: BORDER_COLORS[index % BORDER_COLORS.length],
				borderWidth: 1
			}));
	
			if (radarChart) {
				radarChart.destroy();  // Remove the previous chart to redraw
			}
	
			radarChart = new Chart(ctx, {
				type: 'radar',
				data: {
					labels: labels,
					datasets: datasets
				},
				options: {
					scales: {
						r: {
							beginAtZero: true
						}
					}
				}
			});
		}
	});
	

    