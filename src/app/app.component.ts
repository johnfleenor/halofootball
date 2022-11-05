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
  public timer = new Clock(0,0);

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


export class Clock {
  private time  = new Date();  
  minutes:number;
  seconds:number;

  constructor(minutes:number, seconds:number) {

      this.minutes = minutes;
      this.seconds = seconds;

  }

  print() {
      var clockStr = this.minutes + ' : ' + this.seconds;
  }
  public start() {
    this.reset();
    setInterval(() =>  this.timeGenerate(), 1000);    
  }

  public stop(){

  }

  public reset(){
    this.time = new Date();
    this.time.setMinutes(0);
    this.time.setSeconds(0);
  }

  public  timeGenerate() {       
    this.time.setSeconds(this.time.getSeconds() +1);
    this.minutes = this.time.getMinutes();
    this.seconds = this.time.getSeconds();
  
  }
}





