// Obtención de elementos del DOM mediante sus clases
const button_menu_actions = document.getElementsByClassName('button_menu_actions')[0];
const button_back = document.getElementsByClassName('button_back')[0];
const button_menu_changes = document.getElementsByClassName('button_menu_changes')[0];
const botones_cambios_cancion = document.getElementsByClassName('botones_cambios_cancion')[0];
const button_add_to_list = document.getElementsByClassName('button_add_to_list')[0];
const button_menu_updates = document.getElementsByClassName('button_menu_updates')[0];
const actions_songs = document.getElementsByClassName('actions_songs')[0];

// Variables de control para el menú
let nivelMenu = 1; // Nivel actual del menú
let switchMenu = false; // Estado de activación del menú

/**
 * Alterna una clase específica en un elemento dado.
 * @param {HTMLElement} element - El elemento sobre el que se aplicará el toggle de la clase.
 * @param {string} className - Nombre de la clase a alternar.
 */
function setToggle(element, className) {
    element.classList.toggle(className);
}

/**
 * Activa la visualización de un elemento, permitiendo especificar el tipo de display.
 * @param {HTMLElement} element - El elemento al que se le activará la visualización.
 * @param {string} display - Tipo de display que se aplicará (por defecto es 'block').
 */
function activarDisplay(element, display = 'block') {
    element.style.display = display;
    if (display === 'flex') {
        element.style.flexDirection = 'row'; // Si el display es 'flex', se establece la dirección como 'row'
        element.style.gap = '10px'; // Espaciado entre elementos en un contenedor flex
    }
}

/**
 * Desactiva la visualización de un elemento ocultándolo.
 * @param {HTMLElement} element - El elemento que se ocultará.
 */
function desactivarDisplay(element) {
    element.style.display = 'none';
}

/**
 * Controla la apertura y cierre del menú principal.
 * Activa o desactiva las opciones del menú dependiendo del estado de 'switchMenu'.
 */
function openMenu() {
    if (!switchMenu) {
        activarDisplay(button_menu_changes);
        if (level == 1 || level == 2) { // Verifica si el usuario tiene un nivel de acceso adecuado
            activarDisplay(button_menu_updates);
            activarDisplay(button_add_to_list);
        }
        switchMenu = true;
    } else {
        switchMenu = false;
        desactivarDisplay(button_menu_changes);
        if (level == 1 || level == 2) {
            desactivarDisplay(button_add_to_list);
            desactivarDisplay(button_menu_updates);
        }
    }
}

/**
 * Controla la apertura del menú de cambios.
 * Oculta el menú de acciones y muestra los botones de cambios de canción.
 */
function openMenuChanges() {
    if (level == 1 || level == 2) {
        desactivarDisplay(button_menu_updates);
        desactivarDisplay(button_add_to_list);
    }
    desactivarDisplay(button_menu_actions);
    desactivarDisplay(button_menu_changes);
    activarDisplay(button_back);
    activarDisplay(botones_cambios_cancion, 'flex');
}

/**
 * Controla la apertura de las acciones relacionadas con la canción.
 * Muestra las acciones disponibles dependiendo del nivel del usuario.
 */
function openActionsSong() {
    if (level == 1 || level == 2) {
        desactivarDisplay(button_menu_updates);
        activarDisplay(actions_songs, 'flex');
    }
    desactivarDisplay(button_menu_actions);
    desactivarDisplay(button_menu_changes);
    activarDisplay(button_back);
}

/**
 * Controla la navegación de vuelta al menú principal.
 * Oculta los submenús y muestra las opciones del menú principal.
 */
function back() {
    desactivarDisplay(button_back);
    desactivarDisplay(botones_cambios_cancion);
    activarDisplay(button_menu_actions);
    activarDisplay(button_menu_changes);
    
    if (level == 1 || level == 2) {
        desactivarDisplay(actions_songs);
        activarDisplay(button_add_to_list);
        activarDisplay(button_menu_updates);
    }
}
