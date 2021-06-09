function getAllStudents(){
    fetch('http://localhost:3000/students'
        , {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },

            method: "GET",
        }
    ).then(res => res.json()).then(data => {
        console.log(data);
    })
}