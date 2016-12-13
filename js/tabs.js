function openTab(evt, tabName) {
    "use strict";

    var tabcontent = document.getElementsByClassName("tabcontent");

    var i=0;

    for(i; i<tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    var tablinks = document.getElementsByClassName("tablinks");

    for(i=0; i<tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";

}
