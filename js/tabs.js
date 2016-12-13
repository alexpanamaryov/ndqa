function openTab(evt, tabName) {
    "use strict";

    var tabcontent = document.getElementsByClassName("tabcontent");

    var tablinks = document.getElementsByClassName("tablinks");

    var tabs = document.getElementsByClassName("tab");



    /* tab inactivation */

    for(var i=0; i<tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
        tabs[i].className = tabs[i].className.replace(" active-tab", "");
        tablinks[i].className = tablinks[i].className.replace(" active-tab-link", "");
    }

    /* tab activation */

    document.getElementById(tabName).style.display = "block";
    /*evt.currentTarget.className += " active";*/

    evt.target.parentNode.className += " active-tab";
    evt.currentTarget.className += " active-tab-link";
}
