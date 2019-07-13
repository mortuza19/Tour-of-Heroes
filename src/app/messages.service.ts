import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  messages: string;
  constructor() { }

  add(message: string) : void {
    this.messages = message;
  }
  clear()  {
    this.messages = '';
  }
}
