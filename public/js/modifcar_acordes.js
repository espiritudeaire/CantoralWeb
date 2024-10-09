
const chordsWidhtSharp = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const chordsWidthFlat = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
const chordsSimple = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
const alteration = ['#', 'b'];
const extensionsOfTheChord = [5, 6, 7, 9, 10, 11, 13];
const otherCharactersOfTheChord = ['m', '/', 'dim', 'maj'];

etiquetarAcordes();



function etiquetarAcordes() {
    let elementoCanto = document.getElementById('song_lyric_chords').getElementsByTagName('pre')[0];
    let canto_lyrics = elementoCanto.innerText;
    let lineas = canto_lyrics.split('\n');

    const regAcordes = /(?<!\w)([A-G])(#|b)?(maj|m|dim)?7?\(?((#|b)?(5|9|11|13)|maj)?\)?\(?(#|b)?(5|9|11|13)?\)?(\/[A-G](#|b)?)?(?!\w)/gm;
    const regAcordesEnTexto = /-(?<!\w)([A-G])(#|b)?(maj|m|dim)?7?\(?((#|b)?(5|9|11|13)|maj)?\)?\(?(#|b)?(5|9|11|13)?\)?(\/[A-G](#|b)?)?(?!\w)-/gm
    elementoCanto.innerHTML = canto_lyrics.replace(regAcordes, chord => {
        return `<span class='chord'>${chord}</span>`;
    });
}




function crearElemento(tipo, clase = null, id = null, text) {
    let elemento = document.createElement(tipo);
    if (clase) elemento.className(clase);
    elemento.innerText = text
    return elemento;
}

function getChords() {
    return document.getElementsByClassName('chord');
}

function transposeChords(move) {
    const regNomAcorde = /([A-G](#|b)?).*?/gm;
    let chords = getChords();
    for (const chord of chords) {
        let chordInnerText = chord.innerText;
        let simpleChord = chordInnerText.match(regNomAcorde);

        for (let index = 0; index < simpleChord.length; index++) {
            let updateElementChord = updateChord(bemolToSharp(simpleChord[index]), move);
            chordInnerText = chordInnerText.replace(simpleChord[index], updateElementChord);
        }
        chord.innerText = chordInnerText;
    }
}


function updateChord(chord, move) {
    let index = chordsWidhtSharp.indexOf(chord);
    switch (move) {
        case 1:
            if (chord === 'B') {
                index = 0;
                break;
            }
            index += move;
            break;
        case 2:
            if (chord === 'A#') {
                index = 0;
                break;
            }
            if (chord === 'B') {
                index = 1;
                break;
            }
            index += move;
            break;
        case -1:
            if (chord === 'C') {
                index = chordsWidhtSharp.length - 1;
                break;
            }
            index = index - 1;
            break;
        case -2:
            if (chord === 'C') {
                index = chordsWidhtSharp.length - 2;
                break;
            }
            if (chord === 'C#') {
                index = chordsWidhtSharp.length - 1;
                break;
            }
            index = index - 2;
            break;

    }
    chord = chordsWidhtSharp[index];
    return chord;
}

function changeAlterations() {
    const regNomAcorde = /([A-G](#|b)?).*?/gm;
    let chords = getChords();
    for (const chord of chords) {
        let chordInnerText = chord.innerText;
        let simpleChord = chordInnerText.match(regNomAcorde);
        for (let index = 0; index < simpleChord.length; index++) {
            let updateElementChord = bemolToSharp(simpleChord[index]);
            chordInnerText = chordInnerText.replace(simpleChord[index], updateElementChord);
        }
        chord.innerText = chordInnerText;
    }
}

function bemolToSharp(chord) {
    let verificacionNoFuncional = verificarAlteracionesNoFuncionales(chord);
    if (verificacionNoFuncional.b) {
        return verificacionNoFuncional.chord
    }
    if (chord.includes('b')) {
        return chordsWidhtSharp[chordsWidthFlat.indexOf(chord)];
    }
    return chord;
}

function verificarAlteracionesNoFuncionales(chord) {
    let b = false;
    if (chord.includes('Cb')) {
        chord = 'B';
        b = true;
    }
    if (chord.includes('Fb')) {
        chord = 'E';
        b = true;
    }
    if (chord.includes('E#')) {
        chord = 'F';
        b = true;
    }
    if (chord.includes('B#')) {
        chord = 'C';
        b = true;
    }
    return { b, chord }
}