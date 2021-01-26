import { LightningElement } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import { getBarcodeScanner } from "lightning/mobileCapabilities";
import { ShowToastEvent } from "lightning/platformShowToastEvent";


export default class ScanRecordIdBarcode extends NavigationMixin(LightningElement)  {
	scanner;
	scannedBarcode;

	connectedCallback() {
		this.scanner = getBarcodeScanner();
	}

	handleBeginScanClick(event) {
		if (this.scanner.isAvailable()) {
			this.scanner
				.beginCapture({
					barcodeTypes: [
						this.scanner.barcodeTypes.CODE_128,
						this.scanner.barcodeTypes.CODE_39,
						this.scanner.barcodeTypes.CODE_93,
						this.scanner.barcodeTypes.DATA_MATRIX,
						this.scanner.barcodeTypes.EAN_13,
						this.scanner.barcodeTypes.EAN_8,
						this.scanner.barcodeTypes.ITF,
						this.scanner.barcodeTypes.PDF_417,
						this.scanner.barcodeTypes.QR,
						this.scanner.barcodeTypes.UPC_E
					]
				})
				.then((result) => {
					// Do something with the result of the scan
					console.log(result);
                    this.scannedBarcode = result.value;
                    
                    if (this.scannedBarcode.startsWith("salesforce1:"))
                    {
                        var params = this.scannedBarcode.split('/');
                        if (params.length >= 4)
                        {
                            this.scannedBarcode = params[3];
                        }
                    }


                                    			// View a custom object record.
                                                this[NavigationMixin.Navigate]({
                                                    type: "standard__recordPage",
                                                    attributes: {
                                                        recordId: this.scannedBarcode,
                                                        actionName: "view"
                                                    }
                                                });
				})
				.catch((error) => {
					// Handle cancellation and scanning errors here
					this.handleError(error);
				})
				.finally(() => {
					this.scanner.endCapture();
                });
                



		} else {
			this.handleError("Barcode scanner is not available on this platform!");
		}
	}

	handleError(err) {
		console.log("error=" + err);
		console.log("type=" + typeof err);

		this.showSpinner = false;

		const event = new ShowToastEvent({
			title: err.statusText,
			message: err,
			variant: "error",
			mode: "pester"
		});
		this.dispatchEvent(event);
	}
}