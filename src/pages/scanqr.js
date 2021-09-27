var gotoPage = window.gotoPage
import {log} from '../log'
import { NotFoundException, DecodeHintType, BarcodeFormat } from '@zxing/library';
import { BrowserQRCodeReader } from "@zxing/browser";
import { AbstractPage } from './abstractpage'


export class ScanQrPage extends AbstractPage {

    constructor(id) {
        console.log("SCANQR: Inside constructor")
        super(id);

        // Initialize the QR library
        const formats = [BarcodeFormat.QR_CODE]
        const hints = new Map()
        hints.set(DecodeHintType.POSSIBLE_FORMATS, formats)
        this.codeReader = new BrowserQRCodeReader(hints)

        // Create the 'video' element and attach the event handler
        this.videoElem = document.createElement("video")
        this.videoElem.style.display = "none"
        this.videoElem.oncanplay = this.canPlay

    }


    async enter() {

        // Prepare the screen, waiting for the video
        this.render(this.videoElem)

        // Call the QR decoder using the video element just created
        // The decoder will choose the appropriate camera
        this.controls = await this.codeReader.decodeFromVideoDevice(null, this.videoElem, (result, err, controls) => {
            if (result) {
                // Successful decode
                console.log("RESULT", result)
                // Reset the decoder to stop the video
                controls.stop()
                // And process the scanned QR code
                processQRpiece(result)
            }
            if (err && !(err instanceof NotFoundException)) {
                console.error(err)
            }

        });

    }

    canPlay(e){
        // The video stream is ready, show the 'video' element
        e.target.style.display = "block"
    }
    
    async exit() {
        // Reset the decoder just in case the camera was still working
        if (this.controls !== undefined) {
            this.controls.stop()
        }
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

