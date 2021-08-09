async function loginHandler(event) {
    event.preventDefault();

    const username = document.querySelector("#loginUsername").value.trim();
    const password = document.querySelector("loginPassword").value.trim();

    if (username && password) {
        const response = await fetch('/api/users/login', {
            method: 'Post',
            body: JSON.stringify({username, password}),
            headers: {'Content-Type': 'application/json'}
        });

        if (response.ok) {
            document.location.replace('/dashboard');
        } else {
            alert(response.statusText);
        }
    }
}

document.querySelector('.login-form').addEventListener('submit', loginHandler);