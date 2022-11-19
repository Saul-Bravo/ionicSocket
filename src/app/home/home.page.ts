import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  messages:Array<any> = [{msg: "message", user: "saul"}, {msg: "message2", user:"otheruser"}];
  currentUser:any;
  textArea:any = "";

  constructor(private socket:Socket, private toast:ToastController) {}

  ngOnInit(): void {
    this.socket.connect();
    let name = `user-${new Date().getTime()}`;
    this.currentUser = name;
    this.socket.emit("set-name", name);
    this.socket.fromEvent("user-change").subscribe((msg:any) => {
      let user = msg["user"];
      if (msg["event"] === "left") {
        this.ShowToast("User "+ user +" left");
      }
      else {
        this.ShowToast("User " + user + " joined")
      }
    });
    this.socket.fromEvent("send-message").subscribe((msg:any) => {
      this.messages.push({msg: msg["message"], user:this.currentUser});
    });
  }

  async ShowToast(message:any) {
    let toast = await this.toast.create({
      message: message,
      position: 'top',
      duration: 2000
    });
    toast.present();
  }

  SendMessage(message:any){
    this.socket.emit("message", message);
  }

}
