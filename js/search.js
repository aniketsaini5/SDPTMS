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
        const session = document.getElementById('Session').value;  // Update this to the correct ID for session
        const codeNo = document.getElementById('code_no').value;
        const transportStatus = document.getElementById('transport_status').value;
        const priceValue = document.getElementById('price_value').value;
        const weightValue = document.getElementById('weight_value').value;

        let priceComparison = '';
        let weightComparison = '';

        priceCheckboxes.forEach(cb => {
            if (cb.checked) {
                priceComparison = cb.value === 'greater' ? '>=' : '<=';
            }
        });

        weightCheckboxes.forEach(cb => {
            if (cb.checked) {
                weightComparison = cb.value === 'greater' ? '>=' : '<=';
            }
        });

        return {
            session,
            codeNo,
            transportStatus,
            price: {
                value: priceValue,
                comparison: priceComparison
            },
            weight: {
                value: weightValue,
                comparison: weightComparison
            }
        };
    }

    function validateSearch(data) {
        if (!data.session || !data.codeNo) {
            alert('Please enter session and code number');
            return false;
        }
        return true;
    }

    function performSearch(searchData) {
        console.log('Search Data:', searchData); // Log the search data
        // Use Axios to send the search request to the backend
        axios.post('https://server-1-1qn3.onrender.com/search', searchData)
            .then(function(response) {
                // Show results container
                resultsContainer.classList.remove('hidden');
                // Display results
                displayResults(response.data);
            })
            .catch(function(error) {
                console.error('There was an error!', error);
                alert('Failed to fetch data');
            });
    }

    function displayResults(results) {
        const tbody = document.getElementById('results-body');
        tbody.innerHTML = '';
    
        if (results.length === 0) {
            // Show "No results found" message
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center">No results found</td>
                </tr>
            `;
            return;
        }
    
        results.forEach(result => {
            const row = document.createElement('tr');
            // Format date to be more readable
            const formattedDate = new Date(result.date).toLocaleDateString();
            
            row.innerHTML = `
                <td>${result.purchy_no}</td>
                <td>${formattedDate}</td>
                <td>${result.farmer_name}</td>
                <td>${result.code_no}</td>
                <td>${result.weight}</td>
                <td>${result.price}</td>
                <td>${result.transport_status}</td>
            `;
            tbody.appendChild(row);
        });
    }
    
    function validateSearch(data) {
        // Only require session for search
        if (!data.session) {
            alert('Please select a session');
            return false;
        }
        return true;
    }
    
    function getSearchData() {
        const session = document.getElementById('Session').value;
        const codeNo = document.getElementById('code_no').value;
        const transportStatus = document.getElementById('transport_status').value;
        const priceValue = document.getElementById('price_value').value;
        const weightValue = document.getElementById('weight_value').value;
    
        let priceComparison = null;
        let weightComparison = null;
    
        // Get selected price comparison
        document.getElementsByName('price_range').forEach(cb => {
            if (cb.checked) {
                priceComparison = cb.value;
            }
        });
    
        // Get selected weight comparison
        document.getElementsByName('weight_range').forEach(cb => {
            if (cb.checked) {
                weightComparison = cb.value;
            }
        });
    
        return {
            session,
            codeNo: codeNo.trim(), // Remove any whitespace
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
        
});
