document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('addPurchyForm');
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Validate form
        if (!validateForm()) {
            return;
        }

        // Collect form data
        const formData = new FormData(form);
        const purchyData = Object.fromEntries(formData.entries());

        // Send data to server
        sendPurchyData(purchyData);
    });

    function validateForm() {
        let isValid = true;

        // Reset previous error messages
        document.querySelectorAll('.error-message').forEach(el => el.remove());

        // Validate each required field
        form.querySelectorAll('[required]').forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                showError(field, 'This field is required');
            }
        });

        // Validate numeric fields
        ['weight', 'price'].forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field.value && isNaN(parseFloat(field.value))) {
                isValid = false;
                showError(field, 'Please enter a valid number');
            }
        });

        return isValid;
    }

    function showError(field, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = 'red';
        errorDiv.style.fontSize = '12px';
        errorDiv.style.marginTop = '5px';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }

    function sendPurchyData(data) {
        // Use axios to send data to the backend
        axios.post('https://server-1-1qn3.onrender.com/add-purchy', data)
            .then(response => {
                // Assuming the server responds with a success message
                alert('Purchy added successfully!');
                form.reset();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while adding the purchy. Please try again.');
            });
    }
});
document.addEventListener("DOMContentLoaded", function () {
    const weightInput = document.getElementById("weight");
    const priceInput = document.getElementById("price");

    const pricePerQuintal = 370; // Price per quintal

    function updatePrice() {
        const weight = parseFloat(weightInput.value) || 0;
        priceInput.value = (weight * pricePerQuintal).toFixed(2);
    }

    // Update price when weight changes
    weightInput.addEventListener("input", updatePrice);

    // Initial calculation when page loads
    updatePrice();
});
