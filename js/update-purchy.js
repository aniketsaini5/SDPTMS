document.addEventListener('DOMContentLoaded', function() {
    const searchPurchyForm = document.getElementById('searchPurchyForm');
    const updatePurchyForm = document.getElementById('updatePurchyForm');

    // Store the original purchy data
    let originalPurchyData = null;

    searchPurchyForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const code_no = document.getElementById('code_no').value.trim();
        const purchy_no = document.getElementById('purchy_no').value.trim();
        
        if (!code_no || !purchy_no) {
            alert('Please enter both Code No and Purchy No');
            return;
        }
        
        searchPurchy(code_no, purchy_no);
    });

    updatePurchyForm.addEventListener('submit', function(e) {
        e.preventDefault();
        updatePurchy();
    });

    async function searchPurchy(code_no, purchy_no) {
        try {
            const response = await axios.get('https://server-1-1qn3.onrender.com/search-purchy', {
                params: {
                    code_no: code_no,
                    purchy_no: purchy_no
                }
            });

            if (response.data.success) {
                originalPurchyData = response.data.purchy;
                populateUpdateForm(response.data.purchy);
                updatePurchyForm.style.display = 'flex';
            } else {
                alert(response.data.message || 'Purchy not found. Please check the Code No and Purchy No.');
            }
        } catch (error) {
            console.error('Search error:', error);
            alert(error.response?.data?.message || 'An error occurred while searching for the purchy. Please try again.');
        }
    }

    function populateUpdateForm(purchy) {
        // Store the original values
        originalPurchyData = purchy;

        // Populate form fields
        document.getElementById('Session').value = purchy.Session || '';
        document.getElementById('farmer_name').value = purchy.farmer_name || '';
        
        // Format date properly
        const date = purchy.date ? new Date(purchy.date).toISOString().split('T')[0] : '';
        document.getElementById('date').value = date;
        
        document.getElementById('weight').value = purchy.weight || '';
        document.getElementById('price').value = purchy.price || '';
        document.getElementById('transport_status').value = purchy.transport_status || '';
        document.getElementById('transporter_name').value = purchy.transporter_name || '';
    }

    async function updatePurchy() {
        try {
            const formData = new FormData(updatePurchyForm);
            const purchyData = Object.fromEntries(formData.entries());
            
            // Add the original code_no and purchy_no
            purchyData.code_no = document.getElementById('code_no').value;
            purchyData.purchy_no = document.getElementById('purchy_no').value;

            const response = await axios.put('https://server-1-1qn3.onrender.com/update-purchy', purchyData);

            if (response.data.success) {
                alert('Purchy updated successfully!');
                updatePurchyForm.style.display = 'none';
                searchPurchyForm.reset();
                updatePurchyForm.reset();
            } else {
                alert(response.data.message || 'Failed to update purchy');
            }
        } catch (error) {
            console.error('Update error:', error);
            alert(error.response?.data?.message || 'An error occurred while updating the purchy. Please try again.');
        }
    }
});

