
import { Component, OnInit,ViewChild, Input, Output} from '@angular/core';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';


import * as _moment from 'moment';

@Component({
  selector: 'app-bases-trigo',
  templateUrl: './bases-trigo.component.html',
  styleUrls: ['./bases-trigo.component.scss']
})
export class BasesTrigoComponent implements OnInit {
 
  public date:NgbDateStruct;
  public fecha:string;
  
 getformattedDate():number{
    this.date = {day: new Date().getDate(),month: new Date().getMonth() + 1,year: new Date().getFullYear()};
    return Number(this.dateToString(this.date));}

  public dateToString = ((date) => {
      if(date.day<10 && date.month<10){
        return `${date.year}0${date.month}0${date.day}`.toString();
      }else if (date.day<10 ){
        return `${date.year}${date.month}0${date.day}`.toString();
      }else if (date.month<10){
        return `${date.year}0${date.month}${date.day}`.toString();
      }else{
        return `${date.year}${date.month}${date.day}`.toString();
      }
    })
   
 ngOnInit(): void {
  this.fecha=this.getformattedDate().toString().substring(6,8)+'/'+this.getformattedDate().toString().substring(4,6)
  +'/'+this.getformattedDate().toString().substring(0,4);
  
    } 
    
} 