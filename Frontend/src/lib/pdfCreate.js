const html2canvas = require('html2canvas');
const jsPDF = require('jspdf');
module.exports = {
    generatePDF,
    generateTournamentPDF
}

function generatePDF(input){
    html2canvas(input).then((canvas) => {
        console.log(canvas)
        const imgData = canvas.toDataURL();
        console.log(imgData);
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'PNG', 0, 0);
        pdf.save("download.pdf");  
        input.style.display="none";
    });
};

function generateTournamentPDF(tournament){
    const ul = document.createElement('ul');
    tournament.matches.filter(match => match.round === tournament.state).forEach(match => {
        const li = document.createElement('p');
        li.innerHTML = "Mesa:"+match.table+" Blancas|"+match.home.id+" VS "+match.away.id+"|NEGRAS";
        ul.appendChild(li);
    });
    document.querySelector('#print').appendChild(ul);
    document.querySelector('#print').style.display="block"
    generatePDF(document.querySelector('#print'));
}