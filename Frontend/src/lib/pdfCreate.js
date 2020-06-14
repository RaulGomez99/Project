const html2canvas = require('html2canvas');
const jsPDF = require('jspdf');
module.exports = {
    generatePDF,
    generateTournamentPDF
}

function generatePDF(input){
    html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL();
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'PNG', 0, 0, 0);
        pdf.save("download.pdf");  
        input.style.display="none";
    });
};

function generateTournamentPDF(tournament){
    document.querySelector('#imprimir').innerHTML="";
    const div = document.createElement('div');
    div.style.width= "50%";
    const div2 = document.createElement('div');
    div2.style.textAlign = "center";
    const h1  = document.createElement('h1');
    h1.style.marginLeft = "12px"
    const  blancas = require('./blancas.png')
    const  negras = require('./negras.png')
    const defaultImg = require('./default.png');
    h1.innerText = tournament.name;
    h1.style.display="inline";
    const imgTitle = document.createElement('img');
    imgTitle.src = tournament.logo || defaultImg;
    imgTitle.style.width = "72px";  
    imgTitle.style.display = "inline";  
    imgTitle.style.marginLeft = "24px"; 
    const h1_2  = document.createElement('h1');
    h1_2.innerText=tournament.state>0 ? "Ronda: "+tournament.state : "Finalizado";
    h1_2.style.marginLeft = "24px"; 
    h1_2.style.display = "inline";  

    div2.appendChild(h1);
    div2.appendChild(imgTitle);
    div2.appendChild(h1_2);
    div.appendChild(div2);
    div.appendChild(document.createElement('hr'));
    if(tournament.state>0){
        tournament.participants.sort((a,b)=>{
            if(a.id.toLowerCase()>b.id.toLowerCase()) return 1;
            else return -1;
        }).forEach(participant => {
            const h4 = document.createElement('h4');
            const match = tournament.matches.filter(match => match.round===tournament.state && (match.home.id == participant.id || match.away.id === participant.id))[0];
    
            h4.innerText=participant.id.toUpperCase()+" Mesa "+match.table+" ";
            const img = document.createElement('img');
            img.src= (match.home.id == participant.id) ? blancas : negras;
            img.style.width = "12px";
            h4.style.marginLeft = "12px"
            h4.appendChild(img);
            div.appendChild(h4);
        })
        document.querySelector('#imprimir').appendChild(div);
        document.querySelector('#imprimir').style.display="block"
        generatePDF(document.querySelector('#imprimir'));
    }else{
        const table = document.createElement('table');
        table.style.marginLeft = "12px";
        const firstTr = document.createElement('tr');
        const firstTd = document.createElement('th');
        firstTd.innerText="Nombre"
        firstTr.appendChild(firstTd);
        for (let i = 1; i <= Math.ceil(Math.log2(tournament.participants.length)); i++) {
            const th = document.createElement('th');
            th.innerText="Ronda "+i;
            firstTr.appendChild(th);
        }
        table.appendChild(firstTr);
        tournament.participants.sort((a,b)=>{
            if(a.id.toLowerCase()>b.id.toLowerCase()) return 1;
            else return -1;
        }).forEach(participant => {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.innerText = participant.id.toUpperCase();
            tr.appendChild(td);
            for (let i = 1; i <= Math.ceil(Math.log2(tournament.participants.length)); i++) {
                const tdIntenr = document.createElement('td');
                const match = tournament.matches.filter(match => match.round==i && (match.home.id === participant.id || match.away.id === participant.id))[0];
                if(match.home.id === participant.id) tdIntenr.innerText = match.home.points;
                else tdIntenr.innerText = match.away.points;
                tr.appendChild(tdIntenr);
            }
            table.appendChild(tr);
        })
        div.appendChild(table);
        console.log(div);
        document.querySelector('#imprimir').appendChild(div);
        generatePDF(document.querySelector('#imprimir'));
    }
}