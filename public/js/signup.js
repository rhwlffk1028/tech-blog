async function signupHandler(event) {
    event.preventDefault();

    const email = document.querySelector("#signupEmail").value.trim();
    const username = document.querySelector("#signupUsername").value.trim();
    const password = document.querySelector("#signupPassword").value.trim();

    if (email && password && username) {
        const response = await fetch('api/users', {
            method: 'Post',
            body: JSON.stringify({
                email, 
                password, 
                username
            }),
            headers: {'Content-Type': 'application/json'}
        });

        if (response.ok) {
            console.log('Success');
            document.location.replace('/login');
        } else {
            console.log('Failed');
            alert(response.statusText);
        }
    }
}

document.querySelector('#signupForm').addEventListener('submit', signupHandler);