
console.log("end reached");

const quizResults = JSON.parse(sessionStorage.getItem("quizResults"));
if (quizResults) {
    const { totalScoresHistory } = quizResults;
    console.log("Total Scores History:", totalScoresHistory);

    document.getElementById('score').innerHTML = `
            ${totalScoresHistory} 
        `;

} else {
    console.log("Quiz results not found.");
}
