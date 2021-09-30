import { AbstractPage } from '../pages/abstractpage'
import { html } from 'lit-html';

export class SelectCamera extends AbstractPage {

    constructor(domElem) {
        super(domElem)
    }

    async enter() {
        console.log("Select camera")

        await window.getVideoDevices()

        let theHtml = html`
        <ul>
          ${window.videoDevices.map((camera) =>
            html`<li>${camera.label}</li>`
          )}
        </ul>
      `;

        this.render(theHtml)
    }

    async selectLang(l) {
        console.log("Selecting language", l)
        window.preferredLanguage = l
        localStorage.setItem("preferredLanguage", l)
        window.history.back()
        window.initialHeader();
    }
}

