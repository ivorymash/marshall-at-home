//casual variables to store in memory
var currentArticle;

function createYoutubeEmbed(link, data){
    
    fetch(`https://www.youtube.com/oembed?url=${link}&format=json&maxwidth=800&maxheight=800`
        , {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            mode: 'cors'
        }
    )
        .then(res => res.json().then(data => {
            console.log(data.html);
            document.getElementById("embededvideo").innerHTML = data.html;
        }))

}

function getTopics() {
    fetch('http://localhost:3000/article/sidebar'
        , {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }
    )
        .then(res => res.json().then(data => {
            removeSpinner("loadingSidebar"); //remove the spinny spinny
            replaceSidebar(data);
        }))
}

function removeSpinner(id) {
    document.getElementById(id).style.display = "none";
}

function showSpinner(id) {
    document.getElementById(id).style.display = "inline";
}

function replaceSidebar(data) {
    console.log(data);
    console.log(data[1]);
    var sidebar = document.getElementById("sidebar")
    for (i = 0; i < data.length; i++) {
        sidebar.innerHTML += `
        <a onclick="getArticle(${data[i].id})" id="articleid${data[i].id}">
          <div class="smth shadow">
            <p class="subjectname text-truncate"> ${data[i].title}</p>
            <p class="isCompleted" id="isCompleted${data[i].id}">Completed ✓</p>
          </div>
        </a>
        `
    }
}

function getArticle(id) {
    if(currentArticle == id){
        return;
    }
    currentArticle = id;
    showSpinner("loadingArticle"); //show spinner

    fetch('http://localhost:3000/article'
        , {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({ id: id })
        }
    )
        .then(res => res.json().then(data => {
            putArticle(data); //put article into the page.
        }))
}

function putArticle(data) {
    console.log(data);
    document.getElementById("article").innerHTML = ""; //clear the page
    //this here is janky, sorry!
    document.getElementById("article").innerHTML = `<div class="spinner-border text-secondary" id="loadingArticle"></div>`
    removeSpinner("loadingArticle");

    // do some tampering with the content
    var content = data[0].content.replace(/\n/g, '<br />');

    document.getElementById("article").innerHTML += `
    <h1><b>${data[0].title}</b></h1>
    <p id="embededvideo"></p>
    <p>${content}</[p>
    `
    
    //convert the link to an embed link
    //this part calls the youtube api to get a html that we can slap into our website.

    createYoutubeEmbed(data[0].videolink) //gets the embed link and slaps it into the website

    //https://developers.google.com/youtube/player_parameters

    document.getElementById

}