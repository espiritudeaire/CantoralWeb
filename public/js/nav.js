function showMenuNav() {
    nav = document.getElementById('topnav');
    if (nav.className === 'topnav') {
        nav.className += ' responsive'
    } else {
        nav.className = 'topnav'
    }
}
