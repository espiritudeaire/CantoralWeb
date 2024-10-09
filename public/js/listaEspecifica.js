/**
 * Referencia al contenedor principal de la tabla de canciones.
 * @type {HTMLElement}
 */
let container_table_songs_list = document.getElementsByClassName('container_table_songs_list')[0];

/**
 * Input de búsqueda para agregar opciones.
 * @type {HTMLElement}
 */
let input_busqueda_opciones_agregar = document.getElementById('input_busqueda_opciones_agregar');

/**
 * Contenedor para los resultados de la búsqueda de opciones a agregar.
 * @type {HTMLElement}
 */
let container_busqueda_opciones_agregar = document.getElementById('container_busqueda_opciones_agregar');

/**
 * Tabla que muestra las opciones de canciones a agregar.
 * @type {HTMLElement}
 */
let tabla_busqueda_opciones_agregar = document.getElementById('tabla_busqueda_opciones_agregar');

/**
 * Cuerpo de la tabla donde se listan las canciones agregadas.
 * @type {HTMLElement}
 */
let tbody_songs_list = document.getElementById('tbody_songs_list');

/**
 * ID de la lista actual obtenida de un atributo de data del DOM.
 * @type {string}
 */
let idLista = document.getElementById('id_lista').getAttribute('data-id-lista');

container_busqueda_opciones_agregar.style.display = 'none';

/**
 * Escucha el evento de entrada en el campo de búsqueda para filtrar y mostrar canciones que se pueden agregar a la lista.
 * 
 * @param {Event} e - Evento de entrada en el input.
 */
input_busqueda_opciones_agregar.addEventListener('input', async e => {
    tabla_busqueda_opciones_agregar.innerHTML = '';
    let busqueda = e.srcElement.value;
    let display = 'none';
    console.log("BÚSQUEDA: ", busqueda);
    
    if (!isEmpty(busqueda)) {
        display = 'block';
        let res = await fetch(`/api/busqueda_para_lista?busqueda=${busqueda}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let respuesta = await res.json();
        let songs = respuesta.songs;
        tabla_busqueda_opciones_agregar.innerHTML = '';
        
        songs.forEach(song => {
            let tr = crearElemento('tr', 'tr_Song_Add_to_List', 'tr_Song' + song._id);
            let tdSong = crearElemento('td', 'td_Song', 'td_Song_' + song._id, song.name);
            let tdAdd = crearElemento('td', 'td_Add', 'td_Add_' + song._id, '', getNameIcon(song._id));
            tr.appendChild(tdSong);
            tr.appendChild(tdAdd);
            
            tr.addEventListener('click', e => {
                let spanIcon = tr.getElementsByTagName('span')[0];
                let isChecked = spanIcon.classList.contains('checked');
                if (isChecked) {
                    spanIcon.innerText = 'check_box_outline_blank';
                    removeSongFromList(song._id);
                } else {
                    spanIcon.innerText = 'check_box';
                    addSongToList(song._id, song.name);
                }
                spanIcon.classList.toggle('checked');
            });
            
            tabla_busqueda_opciones_agregar.appendChild(tr);
        });
    } else {
        tabla_busqueda_opciones_agregar.innerHTML = '';
    }
    
    container_busqueda_opciones_agregar.style.display = display;
});

/**
 * Agrega una canción a la lista y actualiza el DOM para reflejar el cambio.
 * 
 * @param {string} _id - ID de la canción a agregar.
 * @param {string} name - Nombre de la canción.
 */
async function addSongToList(_id, name) {
    let tr = crearElemento('tr', 'tr_songs_on_list', _id);
    let tdSong = crearElemento('td', 'td_songs_on_list');
    let tdRemove = crearElemento('td');

    let aSong = crearElemento('a', '', '', name);
    aSong.href = `/api/getSong?id=${_id}&lista=true&idLista=${idLista}`;

    let aRemove = crearElemento('a', '', '', '', 'remove');
    aRemove.addEventListener('click', e => {
        removeSongFromList(_id);
    });

    tdSong.appendChild(aSong);
    tdRemove.appendChild(aRemove);
    tr.appendChild(tdSong);
    tr.appendChild(tdRemove);

    tbody_songs_list.appendChild(tr);

    let res = await fetch('/api/saveSongToList', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            idSong: _id,
            idLista
        })
    });
    let resultado = await res.json();
    console.log("RESULTADO: ---", resultado);
}

/**
 * Elimina una canción de la lista y actualiza el DOM para reflejar el cambio.
 * 
 * @param {string} idSong - ID de la canción a eliminar.
 */
async function removeSongFromList(idSong) {
    let fila = document.getElementById(`${idSong}`);
    fila.remove();

    let res = await fetch('/api/removeSongFromList', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            idSong,
            idLista
        })
    });
    let resultado = await res.json();
    console.log("REMOVIENDO: ---", resultado);
}

/**
 * Obtiene el ícono correspondiente (check box marcado o no marcado) según si la canción está presente en la lista.
 * 
 * @param {string} idSong - ID de la canción.
 * @returns {string} 'check_box' si la canción está en la lista, 'check_box_outline_blank' si no lo está.
 */
function getNameIcon(idSong) {
    console.log("getNameIcon: ", idSong);
    let arrayOfIds = getIdFromSongs();
    
    if (arrayOfIds.indexOf(idSong) > -1) {
        return 'check_box';
    }
    return 'check_box_outline_blank';
}

/**
 * Obtiene un array con los IDs de las canciones que están actualmente en la lista.
 * 
 * @returns {string[]} Array con los IDs de las canciones en la lista.
 */
function getIdFromSongs() {
    let trs = document.getElementsByClassName('tr_songs_on_list');
    let arrayOfIds = [];
    for (const e of trs) {
        arrayOfIds.push(e.id);
    }
    console.log("Array de Ids de la lista: ------", arrayOfIds);
    return arrayOfIds;
}

/**
 * Crea y retorna un nuevo elemento HTML con las clases, ID y contenido especificados.
 * 
 * @param {string} tipo - Tipo de elemento a crear (e.g., 'div', 'tr').
 * @param {string} [_class=''] - Clases CSS a asignar al elemento.
 * @param {string} [_id=''] - ID a asignar al elemento.
 * @param {string} [value=''] - Contenido HTML del elemento.
 * @param {string} [icon=null] - Icono opcional que se añade al elemento.
 * @returns {HTMLElement} El elemento HTML creado.
 */
function crearElemento(tipo, _class = '', _id = '', value = '', icon = null) {
    let elemento = document.createElement(tipo);
    elemento.className = _class;
    elemento.id = _id;
    elemento.innerHTML = value;

    if (icon) {
        let spanIcon = document.createElement('span');
        spanIcon.className = 'material-symbols-outlined add_to_list';
        spanIcon.innerText = icon;
        
        if (icon === 'check_box') {
            spanIcon.classList.add('checked');
        }
        
        elemento.appendChild(spanIcon);
    }
    return elemento;
}

/**
 * Verifica si un valor es vacío o no.
 * 
 * @param {string} value - El valor a verificar.
 * @returns {boolean} True si el valor es una cadena vacía, false en caso contrario.
 */
function isEmpty(value) {
    return value === "" ? true : false;
}
