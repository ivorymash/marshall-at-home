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


function updateQuestionTrack() {

    document.getElementById("checkmark").innerHTML = questionsAnsweredTrack;

}

function loadQuestion(data) {

    //empty out the question body div to allow the next question to be loaded in.

    if (currQn == qnJson.length) { //all questions done
        submitResults();
    }else{
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

    var qnType1 = `<h3 id="qnText">${data.question.Question}</h3>
    <div>`

    //check if there is an image appended.
    if (data.question.QnImage) {
        console.log("image found. retrieving image");
        qnType1 += `<img src="${data.question.QnImage}">`
    }

    for (i = 0; i < data.question.Answers.length; i++) {
        qnType1 += `<button onclick="select('${i + 1}')" class="answer">${data.question.Answers[i]}</button>`
    }
    qnType1 += `</div> <h2 id="selectedAns">bruh</h2>`;

    document.getElementById("qnBody").innerHTML += qnType1;
    console.log("appending type 1 qn");
}


function loadQnType2(data) {
    qnType = "2";
    correctAns = data.question.AcceptedAns; //store the correct answer
    console.log(correctAns);
    console.log("loading qn type 2")

    var qnType2 = `<h3 id="qnText">${data.question.Question}</h3>
    <div>`

    if (data.question.QnImage) {
        console.log("image found. retrieving image");
        qnType2 += `<img src="${data.question.QnImage}">`;
    }

    qnType2 += `<input type="text" id="selectedAns" name="answerField"><br>
  </form></div>`


    document.getElementById("qnBody").innerHTML += qnType2;

}


function select(number) {
    console.log(number + " selected")
    selectedAns = number;
    document.getElementById("selectedAns").innerHTML = number;
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
        questionsAnsweredTrack[currQn] = "O "
        correctTally++;
    } else {
        alert("wrong");
        questionsAnsweredTrack[currQn] = "X "
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
        questionsAnsweredTrack[currQn] = "O "
        correctTally++;
    }else {
        alert("wrong");
        questionsAnsweredTrack[currQn] = "X "
    }
    currQn++;
    loadQuestion(qnJson[currQn]);
}

function submitResults(){

    userid = window.localStorage.getItem("id");
    if(userid == null) {
        userid = window.sessionStorage.getItem("id");
    }

    console.log(correctTally);

    fetch('http://localhost:3000/quiz/submit'
        , {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({ userid: userid, totalQuestions : qnJson.length, correctQuestions : correctTally})
        }
    )
        .then(res => {
            console.log(res);
            console.log("done submitting!");
            window.location.replace("profile.html");
        })
        .catch(error => { alert(error) });
}
