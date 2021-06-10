var qnType;
var selectedAns; //catch all variable for the answer picked/typed/whatever.
var correctAns;
var correctTally = 0;
var currQn;
var qnJson;
var questionsAnsweredTrack = new Array;


function getData() {
    fetch('http://localhost:3000/questions'
        , {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }
    )
        .then(res => res.json()).then(data => {
            // console.log(data);
            qnJson = data["Questions"];
            currQn = 0;
            loadQuestionTracks();
            loadQuestion(qnJson[currQn]);
            removeSpinner("quizSpinner");
        })
        .then(res => {
            // console.log(res.body);
            // qnJson = res["Questions"];
            // currQn = 0;
            // loadQuestion(qnJson[currQn]);
        })
        .catch(error => { alert(error) });
}

function loadNext() {
    console.log("loading next qn...");
    currQn++
    loadQuestion(qnJson[currQn])
}

function loadQuestionTracks() {
    for (i = 0; i < qnJson.length; i++) {
        questionsAnsweredTrack.push("- ")
    }
    console.log("ok");
}


function removeSpinner(id) {
    document.getElementById(id).style.display = "none";
}

function updateQuestionTrack() {
    document.getElementById("qnNumbers").innerHTML = `Question ${currQn+1} / ${qnJson.length}`
    document.getElementById("checkmark").innerHTML = questionsAnsweredTrack.join("");

}

function loadQuestion(data) {

    //empty out the question body div to allow the next question to be loaded in.

    if (currQn == qnJson.length) { //all questions done
        submitResults();
    } else {
        updateQuestionTrack();

        $("#qnBody").empty(); //we should probably convert this page to use jquery tbh

        switch (data.question.QnsType) { //TODO: add the other question types here
            case "1":
                loadQnType1(data);
                break;

            case "2":
                loadQnType2(data);
                break;

            default:
                break;

        }

    }

}

function loadQnType1(data) {


    correctAns = data.question.Correct; //store the correct answer


    qnType = "1";

    var qnType1;

    qnType1 = `<h2 id="qnText">${data.question.Question}</h2>
    <div>`

    qnType1 += `<div class="row bodyRow">
    <div class="col-6">
        <img src="${data.question.QnImage}"
            class="qnMedia">
    </div>
    <div class="buttons col-6 align-items-center my-auto">
    <div class="buttongrp shadow-none" id="multipleChoiceBtns">
    `

    for (i = 0; i < data.question.Answers.length; i++) {
        qnType1 += `<button onclick="select(${i+1})" class="answer btn">${data.question.Answers[i]}</button>`
    }
    qnType1 += `</div>
    </div>
    </div>`;



    document.getElementById("qnBody").innerHTML += qnType1;
    console.log("appending type 1 qn");
}


function loadQnType2(data) {
    qnType = "2";
    correctAns = data.question.AcceptedAns; //store the correct answer
    console.log(correctAns);
    console.log("loading qn type 2")

    var qnType2 = `<h3 id="qnText" class="text-center">${data.question.Question}</h3>`

    qnType2 += `<div class="qnMedia mx-auto">`
    if(data.question.QnImage){
        qnType2 += `    <img src="${data.question.QnImage}"
        class="qnMedia">`
    };

    qnType2 += `</div>`

    qnType2 += `
    <div>
      <input class="form-control mx-auto" type="text" id="selectedAns" name="answerField"><br>
    </div>`


    document.getElementById("qnBody").innerHTML += qnType2;

}


function select(number) {
    var btnContainer = document.getElementById("multipleChoiceBtns");
    var btns = btnContainer.getElementsByClassName("answer");

    if (document.getElementsByClassName("selected").length !== 0) {
        console.log("replacing old selection");
        var current = document.getElementsByClassName("selected");
        console.log(current[0]);
        current[0].classList.remove("selected");
    }

    for (i = 0; i < btns.length; i++) {
        if (i + 1 == number) {
            console.log("selected button is " + (i + 1));
            btns[i].className += " selected";
        };
    }

    selectedAns = number;
}


function lockQuestion() {
    console.log(selectedAns + correctAns);
    //read the current question type, then pass judgement.

    switch (qnType) {
        case "1":
            verifyQnType1();
            break;
        case "2":
            selectedAns = document.getElementById("selectedAns").value;
            console.log(selectedAns);
            verifyQnType2();
            break;
        default:
            alert("something went wrong");

    }

}

function verifyQnType1() {
    if (selectedAns == correctAns) {
        alert("right");
        questionsAnsweredTrack[currQn] = "✔️ "
        correctTally++;
    } else {
        alert("wrong");
        questionsAnsweredTrack[currQn] = "❌ "
    }
    currQn++;
    loadQuestion(qnJson[currQn]);
}

function verifyQnType2() {
    if (selectedAns == "") {
        alert("nothing here")
        return;
    }

    var isCorrect = false;

    for (i = 0; i < correctAns.length; i++) {
        if (correctAns[i] == selectedAns) {
            isCorrect = true;
        }
    }

    // isCorrect ? alert("right") : alert("wrong")
    if (isCorrect) {
        alert("right");
        questionsAnsweredTrack[currQn] = "✔️ "
        correctTally++;
    } else {
        alert("wrong");
        questionsAnsweredTrack[currQn] = "❌ "
    }
    currQn++;
    loadQuestion(qnJson[currQn]);
}

function submitResults() {

    userid = window.localStorage.getItem("id")??window.sessionStorage.getItem("id");

    console.log(correctTally);

    fetch('http://localhost:3000/quiz/submit'
        , {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({ userid: userid, totalQuestions: qnJson.length, correctQuestions: correctTally })
        }
    )
        .then(res => {
            console.log(res);
            console.log("done submitting!");
            window.location.replace("profile.html");
        })
        .catch(error => { alert(error) });
}