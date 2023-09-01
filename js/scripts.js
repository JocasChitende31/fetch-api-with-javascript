
const url = "https://jsonplaceholder.typicode.com/posts";

const loadingElement = document.querySelector("#loading");
const postsContainerElement = document.querySelector("#posts-container");

const postPage = document.querySelector("#post");
const postContainer = document.querySelector("#post-container");
const commentsContainer = document.querySelector("#comments-container");

const commentForm = document.querySelector("#comment-form");
const inputEmail = document.querySelector("#email");
const inputBody = document.querySelector("#body");

//get id from url
const urlSearchParams = new URLSearchParams(window.location.search);

//get id
const postId = urlSearchParams.get("id");



//Get all posts
async function getAllPosts() {

    const response = await fetch(url);


    console.log(response);

    const data = await response.json();

    console.log(data)

    loadingElement.classList.add("hide");

    data.map((post) => {
        const div = document.createElement("div");
        const title = document.createElement("h2");
        const body = document.createElement("p");
        const link = document.createElement("a");

        title.innerText = post.title;
        body.innerText = post.body;
        link.innerText = "ler";
        link.setAttribute("href", `/post.html?id=${post.id}`);

        div.appendChild(title);
        div.appendChild(body);
        div.appendChild(link);

        postsContainerElement.appendChild(div);
    })
}

//Get individual posts 
async function getPost(id) {

    const [responsePost, responseComment] = await Promise.all([

        fetch(`${url}/${id}`),
        fetch(`${url}/${id}/comments`)
    ])

    const dataPost = await responsePost.json();
    const dataComment = await responseComment.json();

    loadingElement.classList.add('hide');
    postPage.classList.remove('hide');

    const title = document.createElement("h1");
    const body = document.createElement("p");

    title.innerText = dataPost.title;
    body.innerText = dataPost.body;

    postContainer.appendChild(title);
    postContainer.appendChild(body);

    console.log(dataComment);

    dataComment.map((comment)=>{
        createComment(comment);
    })
}

//Create the fucntion to add the comment at html page
function createComment(comment) {

    const div = document.createElement("div");
    const email = document.createElement("h3");
    const commentBody = document.createElement("p");

    email.innerText = comment.email;
    commentBody.innerText = comment.body;

    div.appendChild(email);
    div.appendChild(commentBody);

    commentsContainer.appendChild(div);
}

//pOST A COMMENT
async function postComment(comment){

    const response = await fetch(`${url}/${postId}/comments`, {
        method: 'POST',
        body: comment,
        headers: {
            "content-type": "application/json"
        }
    })

    const data = await response.json();

    createComment(data);
}

if (!postId) {

    //call the get function
    getAllPosts();
} else {

    getPost(postId);

    //Add event listeners to comment form

    commentForm.addEventListener('submit', (e)=>{

        e.preventDefault();

        let comment = {
            email: inputEmail.value,
            body: inputBody.value
        }

        comment = JSON.stringify(comment);
        console.log(comment);

        postComment(comment)
    })
}
