

function getHistory(){
    userid = window.localStorage.getItem('id');
    if(userid == null) {
        userid = window.sessionStorage.getItem('id');
    }
    console.log(userid);

    fetch('http://localhost:3000/user/profile/history'
        , {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            
        method: "POST",
        body: JSON.stringify({userid: userid})
        }
    ).then(res => res.json()).then(data => {
        console.log(data);
    })


}