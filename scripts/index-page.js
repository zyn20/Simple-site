document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('comment-form');
    const commentsList = document.getElementById('comments-list');
    const apiKey = '43c2968e-a9ef-4b40-ad03-146f3c453b26'; // Your API key

    const defaultComments = [
        {
            name: "John Doe",
            timestamp: new Date('2021-01-01').getTime(),
            comment: "This is a great band!",
            likes: 0,
            id: 'default1'
        },
        {
            name: "Jane Smith",
            timestamp: new Date('2021-01-02').getTime(),
            comment: "Absolutely love their music!",
            likes: 0,
            id: 'default2'
        },
        {
            name: "Alice Johnson",
            timestamp: new Date('2021-01-03').getTime(),
            comment: "Can't wait for their next concert!",
            likes: 0,
            id: 'default3'
        }
    ];

    async function fetchComments() {
        try {
            const response = await axios.get(`https://project-1-api.herokuapp.com/comments?api_key=${apiKey}`);
            const comments = response.data;
            displayComments(comments);
        } catch (error) {
            console.error('Error fetching comments:', error);
            displayComments(defaultComments); // Display default comments on error
        }
    }

    function displayComments(comments) {
        // Sort comments by timestamp in descending order (newest first)
        comments.sort((a, b) => b.timestamp - a.timestamp);
    
        commentsList.innerHTML = '';
        comments.forEach(comment => {
            const commentEl = createCommentElement(comment);
            commentsList.appendChild(commentEl);
        });
    }
    

    function createCommentElement(comment) {
        const commentEl = document.createElement('div');
        commentEl.classList.add('comment');
        commentEl.setAttribute('data-id', comment.id);

        const nameEl = document.createElement('strong');
        nameEl.textContent = comment.name;
        commentEl.appendChild(nameEl);

        const dateEl = document.createElement('small');
        dateEl.textContent = ` - ${new Date(comment.timestamp).toLocaleString()}`;
        commentEl.appendChild(dateEl);

        const textEl = document.createElement('p');
        textEl.textContent = comment.comment;
        commentEl.appendChild(textEl);

        if (!comment.id.startsWith('default')) {
            const likesCountEl = document.createElement('span');
            likesCountEl.classList.add('likes-count');
            likesCountEl.textContent = `Likes: ${comment.likes}`;
            commentEl.appendChild(likesCountEl);

            const likeButton = document.createElement('button');
            likeButton.classList.add('like-button');
            likeButton.textContent = 'Like';
            commentEl.appendChild(likeButton);

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-button');
            deleteButton.textContent = 'Delete';
            commentEl.appendChild(deleteButton);
        }

        return commentEl;
    }

    async function likeComment(id) {
        try {
            await axios.put(`https://project-1-api.herokuapp.com/comments/${id}/like?api_key=${apiKey}`);
            fetchComments();
        } catch (error) {
            console.error('Error liking comment:', error);
        }
    }

    function confirmDeleteComment(id) {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this comment!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteComment(id);
            }
        });
    }

    async function deleteComment(id) {
        try {
            await axios.delete(`https://project-1-api.herokuapp.com/comments/${id}?api_key=${apiKey}`);
            fetchComments();
            Swal.fire('Deleted!', 'Your comment has been deleted.', 'success');
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    }

    async function postComment(name, text) {
        try {
            await axios.post(`https://project-1-api.herokuapp.com/comments?api_key=${apiKey}`, {
                name,
                comment: text,
            });
            fetchComments();
        } catch (error) {
            console.error('Error posting comment:', error);
        }
    }

    commentsList.addEventListener('click', (event) => {
        if (event.target.classList.contains('like-button')) {
            const commentId = event.target.closest('.comment').dataset.id;
            likeComment(commentId);
        } else if (event.target.classList.contains('delete-button')) {
            const commentId = event.target.closest('.comment').dataset.id;
            confirmDeleteComment(commentId);
        }
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = document.getElementById('name').value.trim();
        const text = document.getElementById('comment').value.trim();
        if (name && text) {
            postComment(name, text);
            form.reset();
        } else {
            alert('Please fill in both fields.');
        }
    });

    fetchComments();
});
