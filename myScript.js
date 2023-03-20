
const url = 'https://striveschool-api.herokuapp.com/api/deezer/search?';
let dataArray;

//funzione associato al task di ricerca
async function search() {
    let searchField = document.getElementById('searchField');
    let param = searchField.value;
    if (param !== '') {
       deleteGrid();
       await getData(url, param);
       displayCards();
       searchField.value = '';
    }
}

//funzione che preleva i dati dal link
async function getData(mainUrl, param) {
    let arr = param.toLowerCase().split(' ');
    param = arr.join('%20');
    const link = mainUrl + "q=" + param;
    await fetch(link).then((response) => response.json()).then((data) => {
            dataArray = data.data;
    }).catch((err) => { alert("Si è verificato il seguente errore: " + err); });
}

//funzione che visualizza le cards
function displayCards() {
    let cards = getAllCards(dataArray);
    let grid = getGrid(cards);
    let main = document.getElementById('main');
    main.append(grid, getDivButtons());
    setModalBody(dataArray);
}

//funzione che recupera le cards
function getAllCards(data) {
    let result = [];
    for(let elem of data) {
        result.push(getCard(elem));
    }
    return result;
}

//funzione che crea e restituisce una card
function getCard(data) {
    let mainDiv = document.createElement('div');
    mainDiv.classList.add('card');
    mainDiv.style.width = '18rem';
    let img = document.createElement('img');
    img.classList.add('card-img-top');
    img.setAttribute('src', data.album.cover_small);
    mainDiv.appendChild(img);
    let div = document.createElement('div');
    div.classList.add('card-body');
    let h5 = document.createElement('h5');
    h5.classList.add('card-title');
    h5.innerText = data.album.title;
    let p = document.createElement('p');
    p.classList.add('card-text');
    p.innerText = data.artist.name;
    let a = document.createElement('a');
    a.classList.add('btn', 'btn-primary');
    a.setAttribute('href', data.artist.link);
    a.innerText = 'Go to deezer';
    div.append(h5, p, a);
    mainDiv.appendChild(div);
    return mainDiv;
}

//funzione che crea la griglia con le card
function getGrid(cards) {
    let mainDiv = document.createElement('div');
    mainDiv.classList.add('container', 'my-4');
    mainDiv.setAttribute('id', 'grid');
    let rows = Math.ceil(cards.length / 5);
    let cols = 5;
    for(let i = 0; i < rows; i++) {
        let row = document.createElement('div');
        row.classList.add('row', 'gx-5', 'gy-5');
        for(let j = 0; j < cols; j++) {
            let col = document.createElement('div');
            col.classList.add('col', 'col-6', 'col-md-4', 'col-lg-2');
            col.appendChild(cards[(i * cols) + j]);
            row.appendChild(col);
            if ((i * cols) + j === cards.length - 1) {
                break;
            }
        }
        mainDiv.appendChild(row);
    }
    return mainDiv;
}

//funzione che elimina la griglia, i pulsanti in fondo e il corpo del modal
function deleteGrid() {
    let grid = document.getElementById('grid');
    let buttonDiv = document.getElementById('buttonDiv');
    let modalBody = document.getElementById('modalBody');
    if (grid !== null && buttonDiv !== null) {
        grid.remove();
        buttonDiv.remove();
        while(modalBody.hasChildNodes()) {
            modalBody.removeChild(modalBody.firstChild);
        }
    }
}

//funzione che crea il div dei pulsanti e il modal
function getDivButtons() {
    let div = document.createElement('div');
    div.classList.add('my-3', 'p-2', 'text-center');
    div.setAttribute('id', 'buttonDiv')
    let button1 = document.createElement('button');
    button1.setAttribute('type', 'button');
    button1.classList.add('btn', 'btn-primary', 'mx-2', 'mb-4');
    button1.setAttribute('data-bs-toggle', 'modal');
    button1.setAttribute('data-bs-target', '#myModal');
    button1.innerText = 'Tutti gli album';
    let button2 = document.createElement('button');
    button2.classList.add('btn', 'btn-info', 'mb-4');
    button2.setAttribute('type', 'button');
    button2.setAttribute('id', 'countButton');
    button2.innerText = 'Conta unici';
    button2.addEventListener('click', showUniqueAlbum);
    div.append(button1, button2);
    return div;
}

//funzione che imposta il corpo del modal
function setModalBody(values) {
    let modalBody = document.getElementById('modalBody');
    for(let value of values) {
        let p = document.createElement('p');
        p.innerText = value.album.title;
        modalBody.appendChild(p);
    }
}

//funzione che mostra in console gli album unici
function showUniqueAlbum() {
    let result = [];
    for(let elem of dataArray) {
        let title = elem.album.title;
        if (!result.includes(title)) {
            result.push(title);
        }
    }
    console.log("Numero di album unici: " + result.length);
}

//al caricamento dei dati, visualizzo le card di tutte le API
window.addEventListener("load", async () => {
    let result = [];
    await getData(url, 'pinguini tattici nucleari');
    for(let elem of dataArray) {
        result.push(elem);
    }
    await getData(url, 'maneskin');
    for(let elem of dataArray) {
        result.push(elem);
    }
    await getData(url, 'mahmood');
    for(let elem of dataArray) {
        result.push(elem);
    }
    dataArray = result;
    displayCards();
});
