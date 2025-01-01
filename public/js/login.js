document.getElementById('login-btn').addEventListener('click', function () {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === "Saini" && password === "Saini4so20") {
        // Redirect to home.html on successful login
        window.location.href = "/public/home.html";
    } else {
        alert("Invalid username or password!");
    }
});