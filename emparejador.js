const participantes = ["Raul","Ruben","Jhony","Adrian","Carlos","Brian","Jorge","Luciano"];
const restricciones = [["Raul","Ruben"],["Raul","Adrian"],["Raul","Brian"],["Raul","Luciano"],["Raul","Carlos"],["Raul","Jorge"]]
//restricciones = [];
console.log(emparejar(participantes,restricciones));



function shuffle(array) {
    console.log("Barajo");
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

function emparejar(array, restricciones){
    const newArray = shuffle(array).concat();
    let emparejamientos = [];
    console.log(newArray);
    while(newArray.length>1){
        const [emparejamiento,numero] = emparejamientoCorrecto(newArray,restricciones, 1);
        if(emparejamiento){
            emparejamientos.push(emparejamiento);
            newArray.splice(numero,1);
            newArray.splice(0,1);
        }
        else return emparejar(array, restricciones);
    }
    return emparejamientos;
}

function emparejamientoCorrecto(array, restricciones, numero){
    if(numero>=array.length) return [false,false];
    for(let i = 0; i<restricciones.length; i++){
        const restriccion = restricciones[i];
        if((array[0]==restriccion[0] || array[0] == restriccion[1]) && (array[numero]==restriccion[0] || array[numero] == restriccion[1])){
            console.log("Emparejamiento erroneo "+[array[0],array[numero]])
            return emparejamientoCorrecto(array,restricciones,numero+1);
        }
    }
    return [[array[0],array[numero]],numero]
}