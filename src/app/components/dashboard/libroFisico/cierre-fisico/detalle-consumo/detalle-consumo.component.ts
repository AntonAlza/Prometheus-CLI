import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { listaValidacionBaseConsumoInventario } from 'src/app/models/Fisico/Consumo Masivo/listaValidacionBaseConsumoInventario';

@Component({
  selector: 'app-detalle-consumo',
  templateUrl: './detalle-consumo.component.html',
  styleUrls: ['./detalle-consumo.component.scss']
})
export class DetalleConsumoComponent implements OnInit {

  @Output () closelistaDetalleConsumo: EventEmitter<boolean>= new EventEmitter();

  @Input() listaDetalleConsumo: listaValidacionBaseConsumoInventario[]
  listaDetalleConsumoDS: MatTableDataSource<listaValidacionBaseConsumoInventario> 

  columnsObsConsumo: string[] = [
    'COD_FISICO'
    ,'ESTADIO'
    ,'VALOR_BASE'
    ,'FECHA_BASE'
    ,'ANTIGUEDAD_BASE'
    ,'VALOR_FLAT'
    ,'FECHA_FLAT'
    ,'ANTIGUEDAD_FLAT'
    ,'TIPO_PRECIO'
  ];

  @ViewChild('paginadoConsumo', { static: true }) paginadoConsumo!: MatPaginator;
  @ViewChild('sortConsumo') sortConsumo!: MatSort;

  constructor() { }

  ngOnInit(): void {
    this.listaDetalleConsumoDS = new MatTableDataSource(this.listaDetalleConsumo);
    this.listaDetalleConsumoDS.paginator = this.paginadoConsumo;
    this.listaDetalleConsumoDS.sort = this.sortConsumo;
  }

  closeCierreModal(){
    this.closelistaDetalleConsumo.emit(false); 
  }

  applyFilterConsumo(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.listaDetalleConsumoDS.filter = filterValue.trim().toLowerCase();
  }

}
