import { Component, OnInit } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-carga-inventario',
  templateUrl: './carga-inventario.component.html',
  styleUrls: ['./carga-inventario.component.scss']
})
export class CargaInventarioComponent implements OnInit {

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
  constructor() { }

  ngOnInit(): void {  this.fecha=this.getformattedDate().toString().substring(6,8)+'/'+this.getformattedDate().toString().substring(4,6)
  +'/'+this.getformattedDate().toString().substring(0,4);
  }

}

