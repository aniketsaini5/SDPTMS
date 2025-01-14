document.getElementById('login-btn').addEventListener('click', function () {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Send the credentials to the server for validation using axios
    axios.post('https://server-1-1qn3.onrender.com/login', {
        username: username,
        password: password
    })
    .then(response => {
        if (response.data.success) {
            window.location.href = 'home.html';  // Redirect to home page
        } else {
            alert('Login failed. Please check your login credentials.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    });
});
