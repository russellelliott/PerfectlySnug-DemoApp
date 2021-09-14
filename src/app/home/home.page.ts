import { Component } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx'; //This plugin scans QR code and extracts information from it.
import { Platform } from '@ionic/angular';

//import { WifiWizard2 } from '@ionic-native/wifi-wizard-2/ngx';

import { AlertController } from '@ionic/angular'; //Displays alerts

//Introducing wifi management dependencies
declare var WifiWizard2: any; //This plugin connects to Wifi given SSID and password.

import { InAppBrowser } from "@ionic-native/in-app-browser/ngx"; //This plugin opens the Topper's UI given the URL and intended destiantion (in the app, or in the phone's browser)

//declare var InAppBrowser: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  scanSub: any; //scanSub is in charge of turning on the camera and scanning the QR code.
  qrText: string; //Defines an empty string where the QR code's text will go.

  WifiWizard2: any; //WifiWizard2 is used to connect to the Topper's WIfi given the SSID and password extracted from the QR code.
  //InAppBrowser: any;

  //Options list for the displayed webpage. Left blank for now.
  options = {};
  constructor(
    public alertCtrl: AlertController,
    private iab: InAppBrowser,
    //private wifiWizard2: WifiWizard2,
    public platform: Platform,
    private qrScanner: QRScanner
  ) {
    this.platform.backButton.subscribeWithPriority(0, () => {
      document.getElementsByTagName('body')[0].style.opacity = '1';
      this.scanSub.unsubscribe();
    });
  }

SSID: string = ""; //Defines an empty string where the SSID will go. This information is extracted from the QR code and put into the SSID input field for the user to see.
password: string = ""; //Defines an empty string where the password will go. Like the SSID, this info is extracted from the QR code and put into the password input field.

//The startScanning() function turns on the camera and scans the QR code. When using the app for the first time, it requests the user's consent for the app to use the camera.
//The ability to use the camera in the app is given by the Camera Usage Permission given in the info.plist file.
//The message that displays when attempting to get this permission is the Camera Usage Description.
  startScanning() {
    // Optionally request the permission early
    this.qrScanner.prepare().
      then((status: QRScannerStatus) => {
        if (status.authorized) { //This code runs if the scan is authorized.
          this.qrScanner.show();
          this.scanSub = document.getElementsByTagName('body')[0].style.opacity = '0';
          debugger
          this.scanSub = this.qrScanner.scan()
            .subscribe((textFound: string) => {
              document.getElementsByTagName('body')[0].style.opacity = '1';
              this.qrScanner.hide();
              this.scanSub.unsubscribe();

              this.qrText = textFound; //Text from the QR Code

              this.SSID = this.qrText.substring(13, 21); //SSID extracted as a substring of the QR text.
              this.password = this.qrText.substring(24,32); //password extracted as a substring of the QR text.

              
            }, (err) => {
              alert(JSON.stringify(err));
            });

        } else if (status.denied) { //This code runs if the scan is denied.
          // The video preview will remain black, and scanning is disabled. We can
          // try to ask the user to change their mind, but we'll have to send them
          // to their device settings with `QRScanner.openSettings()`.
        } else {
          // we didn't get permission, but we didn't get permanently denied. (On
          // Android, a denial isn't permanent unless the user checks the "Don't
          // ask again" box.) We can ask again at the next relevant opportunity.

        }
      })
      .catch((e: any) => console.log('Error is', e));
  }
    connectToWiFi(){
      console.log(this.SSID);
      console.log(this.password);
      //this.lableText = this.inputValue;
      //console.log(this.wifiWizard2.getConnectedSSID());
      try{
        WifiWizard2.iOSConnectNetwork(this.SSID, this.password); //given the SSID and password, attempts the conenct to the Wifi.
        //The Android function may need to be included here as well
        //WifiWizard2.connect(ssid, bindAll, password, algorithm, isHiddenSSID)
        //I don't know for certain, as I don't have an Android device to test on.

        //this.successAlert(); //This function would display a success message. But, I commented it out because it didn't work as intended.
      }catch(e: any){
        this.errorAlert(e); //Displays error message if the conenction fails.
      }
      //this.showAlert();
    }

    //Ths function was intended to display a success message when the user successfully conencts to Wifi. However, this didn't work as intended, as this message displays even if the connection fails.
    async successAlert() { 
      const alert = await this.alertCtrl.create({ 
      header: 'Success', 
      subHeader: 'Connection to the network was successful.', 
      message: 'You successfuly conencted to the Topper Wifi Network ' + this.SSID + ". Sleep Well!", 
      buttons: ['OK'] 
      }); 
      await alert.present(); 
      const result = await alert.onDidDismiss();  
      console.log(result); 
      }
    
    //Displays error message.
    async errorAlert(e) { 
      const alert = await this.alertCtrl.create({ 
      header: 'Error', 
      subHeader: 'Something went wrong with connecting with the network.', 
      message: 'Error: ' + e, 
      buttons: ['OK'] 
      }); 
      await alert.present(); 
      const result = await alert.onDidDismiss();  
      console.log(result); 
      }

    //Alert for debug purposes. Displays the SSID and password from the QR code to make sure they were extracted correctly.
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

      /*launch(){
          let url = "http://10.201.93.2/index.html"
          let target = "_blank";
          this.iab.create(url,target,this.options);
      }*/
      launch() {
        let target = "_blank"; //The target is set to "_blank". This opens the given webpage in the App.
        const browser = this.iab.create('http://10.201.93.2/index.html', target); //Ignitiates a browser with the given URL and destination.
        browser.show(); //Opens the given page.
      }
      /*public openWithSystemBrowser(url : string){
        let target = "_system";
        this.iab.create(url,target,this.options);
      }
      public openWithInAppBrowser(url : string){
        let target = "_blank";
        this.iab.create(url,target,this.options);
      }
      public openWithCordovaBrowser(url : string){
        let target = "_self";
        this.iab.create(url,target,this.options);
      } */

}