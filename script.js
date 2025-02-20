let answerOptions = document.querySelector(".quizz-options");
let questionStatus = document.querySelector(".question-status");
let nextBtn = document.querySelector(".next-btn");
let timeDuration = document.querySelector(".time-duration");
let quizzContainer = document.querySelector(".quizz-container");
let resultContainer = document.querySelector(".result-container");
let configContainer  = document.querySelector(".config-container");
let currentQuestion = null;
let questionIndexHistory = [];
let noOfQuestion = 5;
let questionCategory = "programming";
let correctAnswer = 0;
const quick_time_interval = 15;
let currTime = quick_time_interval;


//quizz result
let showQuizzResult = ()=>{
    quizzContainer.style.display = "none";
    resultContainer.style.display = "block";

    let result = `You answer <b>${correctAnswer}</b> out of <b>${noOfQuestion}</b> questions correctly.Great effort!`
    document.querySelector(".quizz-description").innerHTML = result;
}

//reset time
let resetTime  = ()=>{
    currTime = quick_time_interval;
    timeDuration.textContent = `${currTime}s`;
}


//timer function
let startTime = ()=>{
    timer = setInterval(()=>{
        currTime--;
        timeDuration.textContent = `${currTime}s`;

        if(currTime == 0){
            clearInterval(timer);
            HighlightCorrectAns();
            //stop select other options after selecting one
            document.querySelector(".next-btn").style.visibility = "visible";
            answerOptions.querySelectorAll(".quizz-option").forEach(option => option.style.pointerEvents = "none");
            return;
        }
    }, 1000);
}


//get random question

let getRandomQuestion = ()=>{
    let categoryQuestions = questions.find(rand=>
    rand.category.toLowerCase() === questionCategory.toLowerCase()
).questions || [];
    
    //question status
    if(questionIndexHistory.length >= Math.min(noOfQuestion, categoryQuestions.length)){
        return showQuizzResult();
    }
         
    //filter out already asked questions and choose random one
    const availableQuestion = categoryQuestions.filter((_,ind) => !questionIndexHistory.includes(ind));
    const randomQuestion = availableQuestion[Math.floor(Math.random()) * availableQuestion.length];

    questionIndexHistory.push(categoryQuestions.indexOf(randomQuestion));
    return randomQuestion;

};



//highlight the correct answer
const HighlightCorrectAns = ()=>{
    const correctOption = answerOptions.querySelectorAll(".quizz-option")[currentQuestion.correctAnswer];
    correctOption.classList.add("correct");
    let iconHtml = `<span class="material-symbols-outlined">
    check_circle
    </span>`;
    correctOption.insertAdjacentHTML("beforeend" ,iconHtml);
    document.querySelector(".quiz-time").style.background = "#C31402";
}

//handle answer either true or fales
let handleAns = (li, ind)=>{
    const isCorrect = currentQuestion.correctAnswer === ind;
    li.classList.add(isCorrect ? "correct" : "incorrect");
    console.log(answerOptions);
    clearInterval(timer);


    !isCorrect ? HighlightCorrectAns() : correctAnswer++;

    //add correct or false icon
    let iconHtml = `<span class="material-symbols-outlined">
    ${isCorrect ? "check_circle" : "cancel"}
    </span>`;
    li.insertAdjacentHTML("beforeend" ,iconHtml);

    //stop select other options after selecting one
    answerOptions.querySelectorAll(".quizz-option").forEach(option => option.style.pointerEvents = "none");

    document.querySelector(".next-btn").style.visibility = "visible";
}


//render question ans answer statment
const renderQuestions = ()=>{
    let queStatment = document.querySelector(".quizz-question");
    currentQuestion = getRandomQuestion();
    if(!currentQuestion) return;
    queStatment.innerText = currentQuestion.question;
    resetTime();
    startTime();

    answerOptions.innerHTML = " ";
    currentQuestion.options.forEach((op, ind)=>{
        let li = document.createElement("li");
        li.classList.add("quizz-option");
        li.innerText = op;
        answerOptions.append(li);
        document.querySelector(".next-btn").style.visibility = "hidden";
        document.querySelector(".quiz-time").style.background = "#32313C";
        //question status
        questionStatus.innerHTML = `<b>${questionIndexHistory.length}</b>
                 of
                <b>${noOfQuestion}</b>
                questions`

        li.addEventListener("click", ()=>handleAns(li, ind)); //function invoke when click
    })
}

//move to the quizz option

const startQuizz = ()=>{
    configContainer.style.display = "none";
    quizzContainer.style.display = "block";

    noOfQuestion = parseInt(configContainer.querySelector(".question-option.active").textContent);
    questionCategory = configContainer.querySelector(".category-option.active").textContent;

    renderQuestions();
}


//reset the quizz and move to the config page
const resetQuizz = ()=>{
    resetTime();
    correctAnswer = 0;
    questionIndexHistory.length = 0;
    resultContainer.style.display = "none";
    configContainer.style.display = "block";
}

//highlight the selected item and no. of question
document.querySelectorAll(".category-option, .question-option").forEach((option)=>{
    option.addEventListener("click", ()=>{
        option.parentNode.querySelector(".active").classList.remove("active");
        option.classList.add("active");
    })
})



//move to next question
nextBtn.addEventListener("click", renderQuestions);
document.querySelector(".again-btn").addEventListener("click", resetQuizz);
// document.querySelector(".start-quizz-button").addEventListener("click", startQuizz);
let btn = document.querySelector(".start-quizz-button");
btn.addEventListener("click", startQuizz);