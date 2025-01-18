document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const toggleFiltersBtn = document.getElementById('toggle-filters');
    const advancedFilters = document.getElementById('advanced-filters');
    const filterIcon = document.getElementById('filter-icon');
    const searchBtn = document.getElementById('search-btn');
    const resultsContainer = document.querySelector('.results-container');
    const priceCheckboxes = document.getElementsByName('price_range');
    const weightCheckboxes = document.getElementsByName('weight_range');

    // Toggle advanced filters
    toggleFiltersBtn.addEventListener('click', function() {
        advancedFilters.classList.toggle('hidden');
        filterIcon.textContent = advancedFilters.classList.contains('hidden') ? '▼' : '▲';
    });

    // Handle checkbox logic for price
    priceCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                priceCheckboxes.forEach(cb => {
                    if (cb !== this) cb.checked = false;
                });
            }
        });
    });

    // Handle checkbox logic for weight
    weightCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                weightCheckboxes.forEach(cb => {
                    if (cb !== this) cb.checked = false;
                });
            }
        });
    });

    // Handle search
    searchBtn.addEventListener('click', function() {
        const searchData = getSearchData();
        if (validateSearch(searchData)) {
            performSearch(searchData);
        }
    });

    function getSearchData() {
        const session = document.getElementById('Session').value;
        const codeNo = document.getElementById('code_no').value;
        const transportStatus = document.getElementById('transport_status').value;
        const priceValue = document.getElementById('price_value').value;
        const weightValue = document.getElementById('weight_value').value;

        let priceComparison = null;
        let weightComparison = null;

        // Get selected price comparison
        priceCheckboxes.forEach(cb => {
            if (cb.checked) {
                priceComparison = cb.value === 'greater' ? '>=' : '<=';
            }
        });

        // Get selected weight comparison
        weightCheckboxes.forEach(cb => {
            if (cb.checked) {
                weightComparison = cb.value === 'greater' ? '>=' : '<=';
            }
        });

        return {
            session,
            codeNo: codeNo.trim(),
            transportStatus,
            price: priceValue ? {
                value: parseFloat(priceValue),
                comparison: priceComparison
            } : null,
            weight: weightValue ? {
                value: parseFloat(weightValue),
                comparison: weightComparison
            } : null
        };
    }

    function validateSearch(data) {
        if (!data.session) {
            alert('Please select a session');
            return false;
        }
        return true;
    }

    function performSearch(searchData) {
        console.log('Search Data:', searchData);
        axios.post('https://server-1-1qn3.onrender.com/search', searchData)
            .then(function(response) {
                resultsContainer.classList.remove('hidden');
                displayResults(response.data);
            })
            .catch(function(error) {
                console.error('There was an error!', error);
                alert('Failed to fetch data');
            });
    }

    function displayResults(results) {
        const tbody = document.getElementById('results-body');
        const totalPriceElement = document.getElementById('total-price-value');
        tbody.innerHTML = '';

        if (results.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center">No results found</td>
                </tr>
            `;
            totalPriceElement.textContent = '0';
            return;
        }

        // Calculate total price
        const totalPrice = results.reduce((sum, result) => sum + parseFloat(result.price), 0);
        totalPriceElement.textContent = totalPrice.toLocaleString();

        results.forEach(result => {
            const row = document.createElement('tr');
            const formattedDate = new Date(result.date).toLocaleDateString();
            
            row.innerHTML = `
                <td>${result.purchy_no}</td>
                <td>${formattedDate}</td>
                <td>${result.farmer_name}</td>
                <td>${result.code_no}</td>
                <td>${result.weight}</td>
                <td>${result.price}</td>
                <td class="transport-status-cell" data-purchy-no="${result.purchy_no}">
                    <select class="transport-status-select">
                        <option value="paid" ${result.transport_status === 'paid' ? 'selected' : ''}>Paid</option>
                        <option value="unpaid" ${result.transport_status === 'unpaid' ? 'selected' : ''}>Unpaid</option>
                    </select>
                </td>
            `;
            tbody.appendChild(row);

            // Add event listener to the select element
            const select = row.querySelector('.transport-status-select');
            select.addEventListener('change', function() {
                updateTransportStatus(result.purchy_no, this.value);
            });
        });
    }

    function updateTransportStatus(purchyNo, newStatus) {
        // Show loading state
        const select = document.querySelector(`[data-purchy-no="${purchyNo}"] select`);
        select.disabled = true;

        axios.post('https://server-1-1qn3.onrender.com/update-transport-status', {
            purchy_no: purchyNo,
            transport_status: newStatus
        })
        .then(function(response) {
            if (response.data.success) {
                // Show success indication
                select.style.borderColor = 'green';
                setTimeout(() => {
                    select.style.borderColor = '';
                }, 2000);
            } else {
                // Revert selection on failure
                select.value = newStatus === 'paid' ? 'unpaid' : 'paid';
                alert(response.data.message || 'Failed to update status');
            }
        })
        .catch(function(error) {
            // Revert selection on error
            select.value = newStatus === 'paid' ? 'unpaid' : 'paid';
            console.error('Error updating status:', error);
            alert('Failed to update transport status: ' + (error.response?.data?.message || error.message));
        })
        .finally(function() {
            // Re-enable select
            select.disabled = false;
        });
    }
});