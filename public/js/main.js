document.addEventListener('DOMContentLoaded', () => {
    const addPurchyForm = document.getElementById('addPurchyForm');
    const searchForm = document.getElementById('searchForm');
    const updateStatusForm = document.getElementById('updateStatusForm');

    if (addPurchyForm) {
        addPurchyForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(addPurchyForm);
            const purchy = Object.fromEntries(formData);

            try {
                const response = await fetch('/api/add-purchy', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(purchy),
                });

                if (response.ok) {
                    alert('Purchy added successfully');
                    addPurchyForm.reset();
                } else {
                    alert('Failed to add purchy');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while adding the purchy');
            }
        });
    }

    if (searchForm) {
        searchForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const searchTerm = document.getElementById('searchTerm').value;

            try {
                const response = await fetch(`/api/search?searchTerm=${encodeURIComponent(searchTerm)}`);
                const data = await response.json();

                const resultsDiv = document.getElementById('searchResults');
                if (data.length > 0) {
                    const table = createTable(data);
                    resultsDiv.innerHTML = '';
                    resultsDiv.appendChild(table);
                } else {
                    resultsDiv.innerHTML = '<p>No results found.</p>';
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while searching');
            }
        });
    }

    if (updateStatusForm) {
        updateStatusForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const code_no = document.getElementById('code_no').value;
            const new_status = document.getElementById('new_status').value;

            try {
                const response = await fetch('/api/update-status', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ code_no, new_status }),
                });

                if (response.ok) {
                    alert('Transport status updated successfully');
                    updateStatusForm.reset();
                } else {
                    const errorData = await response.json();
                    alert(errorData.error || 'Failed to update transport status');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while updating the transport status');
            }
        });
    }

    function createTable(data) {
        const table = document.createElement('table');
        const headers = ['Farmer Name', 'Code No', 'Purchy No', 'Date', 'Weight', 'Price', 'Transport Status', 'Transporter'];
        
        const headerRow = document.createElement('tr');
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        data.forEach(item => {
            const row = document.createElement('tr');
            headers.forEach(header => {
                const td = document.createElement('td');
                td.textContent = item[header.toLowerCase().replace(' ', '_')] || '';
                row.appendChild(td);
            });
            table.appendChild(row);
        });

        return table;
    }
});

