var json = require('sampleQns.json');
var selectedAns = "";
var correctAns = "";

//IMPORTANT: next time there will be button generation through code, so the number hardcodede into the button functions will change. 

function stuff() {
    $.getJSON("sampleQns.json"), function (data) {
        console.log(data);
    }
}

function getData() {
    fetch('sampleQns.json'
        , {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }
    )
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            loadQuestion(myJson["Questions"][0])
        });
}
useEffect(() => {
    getData()
}, [])


function loadQuestion(data) {
    //TODO: add support for question types
    //TODO: spawn buttons based on how many answeres there are.
    text = data.Question;
    document.getElementById("qnText").innerHTML = data.Question
    buttons = document.getElementsByClassName("answer");
    correctAns = data.Correct;
    for (i = 0; i < data.Answers.length; i++) {
        document.getElementsByClassName("answer")[i].innerHTML = data.Answers[i];
    }
}


function select(number) {
    console.log(number + " selected")
    selectedAns = number;
}


function lockQuestion() {
    console.log(selectedAns + correctAns);

    if (selectedAns == correctAns) {

        alert("right");

    } else {

        alert("wrong");
    }
}