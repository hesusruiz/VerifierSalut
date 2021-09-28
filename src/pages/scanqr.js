//import { gotoPage } from "../router";
var gotoPage = window.gotoPage
import { html } from 'lit-html';
import {log} from '../log'
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { AbstractPage } from './abstractpage'


export class ScanQrPage extends AbstractPage {

    constructor(id) {
        console.log("SCANQR: Inside constructor")
        super(id);

        // Initialize the QR library
        this.codeReader = new BrowserMultiFormatReader()

        // Create the 'video' element and attach the event handler
        this.videoElem = document.createElement("video")
        this.videoElem.style.display = "none"
        this.videoElem.oncanplay = this.canPlay

    }


    async enter() {

        // Prepare the screen, waiting for the video
        this.render(this.videoElem)

        let videoInputDevices = await this.codeReader.listVideoInputDevices()
        let cameraID = videoInputDevices[-1]


        // Call the QR decoder using the video element just created
        // The decoder will choose the appropriate camera
        this.codeReader.decodeFromVideoDevice(null, this.videoElem, (result, err) => {
            if (result) {
                // Successful decode
                console.log("RESULT", result)
                // Reset the decoder to stop the video
                this.codeReader.reset()
                // And process the scanned QR code
                processQRpiece(result)

            }
            if (err && !(err instanceof NotFoundException)) {
                console.error(err)
            }
        })

    }

    canPlay(e){
        // The video stream is ready, show the 'video' element
        e.target.style.display = "block"
    }
    
    async exit() {
        // Reset the decoder just in case the camera was still working
        this.codeReader.reset()
        this.videoElem.style.display = "none"
    }

}


const QR_UNKNOWN = 0
const QR_URL = 1
const QR_MULTI = 2
const QR_HC1 = 3

async function processQRpiece(readerResult) {
    let qrData = readerResult.text

    let qrType = detectQRtype(qrData)

    // Display data of a normal QR
    if (qrType === QR_UNKNOWN || qrType === QR_URL) {
        gotoPage("displayNormalQR", qrData)
        return;
    }

    // Handle HCERT data
    if (qrType === QR_HC1) {
        gotoPage("displayhcert", qrData)
        return;
    }

}



function detectQRtype(qrData) {
    // Try to detect the type of data received
  
    console.log("detectQRtype:", qrData);
    if (!qrData.startsWith) {
        log.myerror("detectQRtype: data is not string")
    }
  
    if (qrData.startsWith("https")) {
      // We require secure connections
      // Normal QR: we receive a URL where the real data is located
      return QR_URL;
    } else if (qrData.startsWith("multi|w3cvc|")) {
      // A multi-piece JWT
      return QR_MULTI;
    } else if (qrData.startsWith("HC1:")) {
      return QR_HC1;
    } else {
        return QR_UNKNOWN
    }
}

