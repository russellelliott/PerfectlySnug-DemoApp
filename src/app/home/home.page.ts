import { Component } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { Platform } from '@ionic/angular';

//import { WifiWizard2 } from '@ionic-native/wifi-wizard-2/ngx';

import { AlertController } from '@ionic/angular';

//Introducing wifi management dependencies
//declare var WifiWizard2: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  scanSub: any;
  qrText: string;

  //WifiWizard2: any;

  constructor(
    public alertCtrl: AlertController,
    //private wifiWizard2: WifiWizard2,
    public platform: Platform,
    private qrScanner: QRScanner
  ) {
    this.platform.backButton.subscribeWithPriority(0, () => {
      document.getElementsByTagName('body')[0].style.opacity = '1';
      this.scanSub.unsubscribe();
    });
  }

  startScanning() {
    // Optionally request the permission early
    this.qrScanner.prepare().
      then((status: QRScannerStatus) => {
        if (status.authorized) {
          this.qrScanner.show();
          this.scanSub = document.getElementsByTagName('body')[0].style.opacity = '0';
          debugger
          this.scanSub = this.qrScanner.scan()
            .subscribe((textFound: string) => {
              document.getElementsByTagName('body')[0].style.opacity = '1';
              this.qrScanner.hide();
              this.scanSub.unsubscribe();

              this.qrText = textFound;

              this.SSID = this.qrText.substring(13, 21);
              this.password = this.qrText.substring(24,32);

              
            }, (err) => {
              alert(JSON.stringify(err));
            });

        } else if (status.denied) {
        } else {

        }
      })
      .catch((e: any) => console.log('Error is', e));
  }

  SSID: string = "";
  password: string = "";

    connectToWiFi(){
      console.log(this.SSID);
      console.log(this.password);
      //this.lableText = this.inputValue;
      //console.log(this.wifiWizard2.getConnectedSSID());
      this.showAlert();
    }

    async showAlert() { 
      const alert = await this.alertCtrl.create({ 
      header: 'Test Alert', 
      subHeader: 'This alert is here to test if the SSID and password have been properly extracted from the QR code on the Smart Topper.', 
      message: 'The SSID is: ' + this.SSID + " and the password is: " + this.password, 
      buttons: ['OK'] 
      }); 
      await alert.present(); 
      const result = await alert.onDidDismiss();  
      console.log(result); 
      } 

}