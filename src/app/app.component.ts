import { Time } from '@angular/common';
import { Component } from '@angular/core';
import { timer } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Football Ticker';
  public quarters = [
    { name: "1st", value: 1}, 
    { name: "2nd", value: 1},
    { name: "3rd", value: 1},
    { name: "4th", value: 1}];
 
  public teama:Team = new Team("Broncos");
  public teamb:Team = new Team("Giants");
  public quarter:string = this.quarters[0].name;
  public clock:string = "15:00";
  public down:number = 1;
  public downDistance:number = 10;
  public timer = new Clock(15,0);

  public teamaurl: string ="https://www.bing.com/th?id=OSB.AA2d2KG.png&w=34&h=34&o=6&pid=SANGAM";
  public teamburl: string ="https://www.bing.com/th?id=OSB.BB3RN1U.png&w=50&h=50&o=6&pid=SANGAM";

  public Start(){
    this.timer.start();
  }

  public Stop(){
    this.timer.stop();
  }

  public Reset(){
    this.timer.reset();
  }

  public IsClose(): boolean{
    return (this.timer.minutes == 0 && this.timer.seconds < 10)
  }

}

export class Team{
  /**
   *
   */
  constructor(name:string) {
    this.name = name;
    
  }
  public name:string = "";
  public score:number  = 0;

  public color:string ="#00000";
  public namecolor:string ="blue";  

  public Touchdown(){
    this.score += 6;    
  }
  public ExtraPoint(){
    this.score += 1;
  }
  public FieldGoal(){
    this.score += 3;
  }
  public Safety() {
    this.score +=2;
  }
}





interface TickEvent {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownEvents {
  tick(values: TickEvent): void;
  expired(): void;
  stop(): void;
}

// Unfortunately we can't use T[K][] without getting messy.
type EventMap<T> = { [K in keyof T]: Function[] };

export class Countdown {
  private listeners: EventMap<CountdownEvents> = { tick: [], expired: [], stop: [] };
  private timer?: any;

  private active = false;

  public minutesOnClock: number =0;
  public secondsOnClock: number =0;

  on<K extends keyof CountdownEvents>(eventName: K, listener: CountdownEvents[K]): void {
      this.listeners[eventName].push(listener);
  }

  off<K extends keyof CountdownEvents>(eventName: K, listener: CountdownEvents[K]): void {
      const listeners = this.listeners[eventName];
      const index = listeners.indexOf(listener);
      if (index !== -1) {
          listeners.splice(index, 1);
      }
  }

  start() {
      let date = new Date();
      date.setMinutes(date.getMinutes() + this.minutesOnClock)
      date.setSeconds(date.getSeconds() + this.secondsOnClock)
      const end = Math.floor(date.getTime() / 1000);
      this.active = true;
      const tick = () => {
          const now = Date.now();
          const nowSec = Math.floor(now / 1000);
          const time = end - nowSec;

          if (time <= 0 ) {
              delete this.timer;
              this.listeners.expired.forEach(listener => listener());
              return;
          }

          const minute = 60;
          const hour = minute * 60;
          const day = hour * 24;

          const days = Math.floor(time / day);
          const hours = Math.floor(time % day / hour);
          const minutes = Math.floor(time % hour / minute);
          const seconds = time % minute;
          if(this.active){
          this.listeners.tick.forEach(listener => listener({ days, hours, minutes, seconds }));

          const timeToNextSecond = (nowSec + 1) * 1000 - now;
          this.timer = setTimeout(tick, timeToNextSecond);
          }
      }

      tick();
  }
  pause(){
    this.active = false;    
  }

  stop() {
      if (this.timer) {
          clearTimeout(this.timer);
          delete this.timer;
          this.listeners.stop.forEach(listener => listener());
      }
  }
}


export class Clock {

  public active = false;
  private time  = new Date();  
  public minutes:number;
  public seconds:number;
  public  countdown = new Countdown();
  private date= new Date();
  constructor(minutes:number, seconds:number) {

      this.minutes = minutes;
      this.seconds = seconds;
      this.countdown.on("tick", event => {this.minutes =  event.minutes ; this.seconds = event.seconds });
      this.countdown.on("expired", () => {this.minutes =0; this.seconds =0});
      this.countdown.on("stop", () => {});

      this.reset();      

  }

  print() {
      var clockStr = this.minutes + ' : ' + this.seconds;
  }
  public start() {
    this.active = true; 
    this.countdown.minutesOnClock = this.minutes;
    this.countdown.secondsOnClock = this.seconds;   
    this.countdown.start();        
  }

  public stop(){
    this.active = false;
    this.countdown.minutesOnClock = this.minutes;
    this.countdown.secondsOnClock = this.seconds;
    this.countdown.pause();
  }

  public reset(){
    this.stop();
    this.minutes =15;
    this.seconds =0;
    this.countdown.minutesOnClock = this.minutes;
    this.countdown.secondsOnClock = this.seconds;
    
    
  }
  
}







