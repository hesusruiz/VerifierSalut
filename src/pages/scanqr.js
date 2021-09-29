//import { gotoPage } from "../router";
var gotoPage = window.gotoPage
import { html } from 'lit-html';
import {log} from '../log'
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { AbstractPage } from './abstractpage'

const backCameraKeywords = [
    "rear",
    "back",
    "rück",
    "arrière",
    "trasera",
    "trás",
    "traseira",
    "posteriore",
    "后面",
    "後面",
    "背面",
    "后置",
    "後置",
    "背置",
    "задней",
    "الخلفية",
    "후",
    "arka",
    "achterzijde",
    "หลัง",
    "baksidan",
    "bagside",
    "sau",
    "bak",
    "tylny",
    "takakamera",
    "belakang",
    "אחורית",
    "πίσω",
    "spate",
    "hátsó",
    "zadní",
    "darrere",
    "zadná",
    "задня",
    "stražnja",
    "belakang",
    "बैक",
];

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

    isBackCameraLabel(label) {
        const lowercaseLabel = label.toLowerCase();
        return backCameraKeywords.some((keyword) => {
            return lowercaseLabel.includes(keyword);
        });
    }

    async getVideoDevices() {
        // Get the video devices

        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
            console.log("enumerateDevices() not supported.");
            return;
        }

        this.devices = await navigator.mediaDevices.enumerateDevices()
        this.devices = this.devices.filter((device) => {
            return device.kind === "videoinput";
        });

        let stream = undefined;
        // Check if they have labels. If they don't, it means we have to request permission from the user
        if (this.devices.length > 0) {
            let allLabelsEmpty = this.devices.every((device) => {return device.label === ""})
            if (allLabelsEmpty) {
                try {
                    stream = await navigator.mediaDevices.getUserMedia({
                        video: true,
                        audio: false,
                    });
                    // Try again to get the devices
                    this.devices = await navigator.mediaDevices.enumerateDevices()
                    this.devices = this.devices.filter((device) => {
                        return device.kind === "videoinput";
                    });
                }
                catch {
                    // Ignored
                }
                finally {
                    if (stream !== undefined) {
                        stream.getVideoTracks().forEach((track) => {
                            track.stop();
                        });
                    }
                }
    
    
            }
        }

        this.frontCameras = this.devices.filter((device) => {
            return !this.isBackCameraLabel(device.label)
        });
        this.backCameras = this.devices.filter((device) => {
            return this.isBackCameraLabel(device.label)
        });

    }

    async getPreferredVideoDevice() {
        await this.getVideoDevices()

        if (this.backCameras.length > 0) {
            return this.backCameras[this.backCameras.length - 1]
        } else if (this.frontCameras.length > 0) {
            return this.frontCameras[0]
        } else {
            return undefined
        }

    }

    async enter() {

        // Select the most appropriate camera for scanning a QR, using some heuristics
        this.cameraQR = await this.getPreferredVideoDevice()

        // let theHtml = html`
        //     ${this.videoElem}
        //     <ul>
        //     ${this.devices.map((device) =>
        //         html`<li>${device.kind}: ${device.label}</li>`
        //     )}
        //     </ul>
        // `;
        let theHtml = html`
            ${this.videoElem}
        `;

        // Prepare the screen, waiting for the video
        this.render(theHtml)

        // Call the QR decoder using the video element just created
        // The decoder will choose the appropriate camera
        this.codeReader.decodeFromVideoDevice(this.cameraQR.deviceId, this.videoElem, (result, err) => {
            if (result) {
                // Successful decode
                console.log("RESULT", result)
                let qrType = detectQRtype(result)

                if (qrType === QR_HC1) {
                    // Reset the decoder to stop the video
                    this.codeReader.reset()
                    // And process the scanned QR code
                    processQRpiece(result)
                }

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

    let qrType = detectQRtype(readerResult)
    if (qrType !== QR_HC1) {
        return false;
    }

    // Display data of a normal QR
    if (qrType === QR_UNKNOWN || qrType === QR_URL) {
        gotoPage("displayNormalQR", qrData)
        return true;
    }

    // Handle HCERT data
    if (qrType === QR_HC1) {
        gotoPage("displayhcert", qrData)
        return true;
    }

}



function detectQRtype(readerResult) {
    // Try to detect the type of data received
    let qrData = readerResult.text
  
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

