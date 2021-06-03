
function lmao(id){
    alert("lmao" + id);
}

function getTopics(){
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

function removeSpinner(id){
    document.getElementById(id).style.display = "none";
}

function replaceSidebar(data){
    console.log(data);
    console.log(data[1]);
    var sidebar = document.getElementById("sidebar")
    for(i=0; i<data.length; i++){
        sidebar.innerHTML += `
        <a onclick="lmao(${data[i].id})" ` + `id="articleid` + data[i].id + `" ` + `>
          <div class="smth shadow">
            <p class="subjectname text-truncate">` + data[i].title +`</p>
          </div>
        </a>
        `
    }
}