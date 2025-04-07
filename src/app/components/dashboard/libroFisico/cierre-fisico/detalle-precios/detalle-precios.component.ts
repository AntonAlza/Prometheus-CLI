import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ControlBasesFlatsCM } from 'src/app/models/Fisico/Consumo Masivo/ControlBasesFlatsCM';

@Component({
  selector: 'app-detalle-precios',
  templateUrl: './detalle-precios.component.html',
  styleUrls: ['./detalle-precios.component.scss']
})
export class DetallePreciosComponent implements OnInit {

  @Output () closelistaDetallePrecio: EventEmitter<boolean>= new EventEmitter();

  @Input() listaDetallePrecios: ControlBasesFlatsCM[] = [];

  listaDetallePreciosDS: MatTableDataSource<ControlBasesFlatsCM>

  @ViewChild(MatPaginator, { static: true }) paginatorLista!: MatPaginator;
  @ViewChild(MatSort) sortLista!: MatSort;  

  columnsObsPrecio: string[] = [
    's266_Codigo'
    ,'s266_Estadio'
    ,'s266_valor'
  ];

  constructor() { }

  ngOnInit(): void {
    this.listaDetallePreciosDS = new MatTableDataSource(this.listaDetallePrecios);
    this.listaDetallePreciosDS.paginator = this.paginatorLista;
    this.listaDetallePreciosDS.sort = this.sortLista;
  }

  closeCierreModal(){
    this.closelistaDetallePrecio.emit(false); 
  }

}
