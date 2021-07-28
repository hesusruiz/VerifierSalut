import { html, render } from 'lit-html';
import { goHome as routerGoHome, gotoPage } from "../router";

var domElem = undefined
var x = undefined

export function HeaderBar() {

    function toggleMenu(e) {
        x = e.target.parentNode.nextElementSibling
        x.classList.toggle("w3-show")
    }
    function goHome(e) {
        x = e.target.parentNode.nextElementSibling
        x.classList.remove("w3-show")
        routerGoHome()
    }

    if (!domElem) {
        console.log("HEADERBAR: Creating DOM element")
        domElem = document.createElement("div")
        domElem.id = "headerbar"
        document.body.append(domElem)
    }

    if (x) { x.classList.remove("w3-show") }

    let theHtml = html`
    <div class="w3-bar w3-xlarge color-primary">
        <div class="w3-bar-item" @click=${goHome}>
            <img src="mevasalut.svg" height="35px" style="vertical-align:inherit" alt="Logo" />
            <span style="padding-left: 10px;">EU Certificates</span>
        </div>
        <a @click=${()=>gotoPage("spinner")} href="javascript:void(0)" class="w3-bar-item w3-button w3-hide-small">Update public keys</a>
        <a href="#" class="w3-bar-item w3-button w3-hide-small">Privacy policy</a>
        <a href="javascript:void(0)" class="w3-bar-item w3-button hover-color-primary w3-right w3-hide-large w3-hide-medium" @click=${toggleMenu}>&#9776;</a>
    </div>
    
    <div class="w3-bar-block color-primary w3-hide w3-hide-large w3-hide-medium">
        <a @click=${()=>gotoPage("spinner")} href="javascript:void(0)" class="w3-bar-item w3-button hover-color-primary">Update public keys</a>
        <a href="#" class="w3-bar-item w3-button hover-color-primary">Privacy policy</a>
    </div>
    `
    render(theHtml, domElem)
}