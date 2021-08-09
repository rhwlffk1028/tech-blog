async function createComment(event) {
    event.preventDefault();

    const comment = document.querySelector('textarea[name="user-comment"]').value.trim();
    const post_id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];
    
    const response = await fetch('/api/comments', {
        method: 'Post',
        body: JSON.stringify({
            comment, 
            post_id
        }),
        headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
        document.location.reload();
    } else {
        alert(response.statusText);
    }
}

document.querySelector('.comment-form').addEventListener('submit', createComment);