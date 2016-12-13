function openTab(evt, tabName) {
    "use strict";

    var tabPanels = document.getElementsByClassName("tab-panel");

    var tablinks = document.getElementsByClassName("tablinks");

    var tabs = document.getElementsByClassName("tab");



    /* tab inactivation */

    for(var i=0; i<tabPanels.length; i++) {
        tabPanels[i].style.display = "none";
        tabs[i].className = tabs[i].className.replace(" active-tab", "");
        tablinks[i].className = tablinks[i].className.replace(" active-tab-link", "");
    }

    /* tab activation */

    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active-tab-link";
    /*evt.target.parentNode.className += " active-tab";*/
    evt.currentTarget.parentNode.className += " active-tab";
}
