async function createPost(event) {
    event.preventDefault();

    const title = document.querySelector('input[name="post-title"]').value.trim();
    const post_content = document.querySelector('textarea[name="post-content"]').value.trim();

    const response = await fetch('/api/posts', {
        method: 'Post',
        body: JSON.stringify({
            title, 
            post_content
        }),
        headers: { 'Content-Type': 'application/json'}
    });

    if (response.ok) {
        console.log('Success');
        document.location.replace('/dashboard');
    } else {
        console.log('Failed');
        alert(response.statusText);
    }
}

document.querySelector('.new-post-form').addEventListener('submit', createPost);