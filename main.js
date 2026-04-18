const API_URL = '/api';

// Set Auth State in UI
function checkAuthState() {
    const navLinks = document.getElementById('nav-links');
    // We check via API if session exists
    fetch(`${API_URL}/auth/profile`)
    .then(res => {
        if(res.ok) {
            navLinks.innerHTML = `
                <li><a href="index.html">Home</a></li>
                <li><a href="profile.html">Profile</a></li>
                <li><a href="#" onclick="logout()">Logout</a></li>
            `;
        } else {
            navLinks.innerHTML = `
                <li><a href="index.html">Home</a></li>
                <li><a href="login.html">Login</a></li>
                <li><a href="register.html">Register</a></li>
                <li><a href="about.html">About</a></li>
            `;
        }
    }).catch(err => console.log(err));
}

async function logout() {
    try {
        await fetch(`${API_URL}/auth/logout`, { method: 'POST' });
        window.location.href = 'index.html';
    } catch (err) {
        console.error(err);
    }
}

// Sidebar toggle
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
    } else {
        sidebar.classList.add('active');
    }
}

// Run on load if nav exists
if(document.getElementById('nav-links')) {
    checkAuthState();
}
