async function logout() {
  const response = await fetch('/api/users/logout', {
    method: 'Post',
    headers: {'Content-Type': 'application/json'}
  });

  if (response.ok) {
    console.log('Success');
    document.location.replace('/');
  } else {
    console.log('Failed');
    alert(response.statusText);
  }
}

document.querySelector('#logoutBtn').addEventListener('click', logout);