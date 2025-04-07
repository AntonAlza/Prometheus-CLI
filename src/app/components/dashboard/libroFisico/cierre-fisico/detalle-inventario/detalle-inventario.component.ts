import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { listaValidacionBaseConsumoInventario } from 'src/app/models/Fisico/Consumo Masivo/listaValidacionBaseConsumoInventario';

@Component({
  selector: 'app-detalle-inventario',
  templateUrl: './detalle-inventario.component.html',
  styleUrls: ['./detalle-inventario.component.scss']
})
export class DetalleInventarioComponent implements OnInit {

  @Output () closelistaDetalleInventario: EventEmitter<boolean>= new EventEmitter();

  @Input() listaDetalleInventario: listaValidacionBaseConsumoInventario[]
  listaDetalleInventarioDS: MatTableDataSource<listaValidacionBaseConsumoInventario> 

  @ViewChild('paginadoInventario', { static: true }) paginadoInventario!: MatPaginator;
  @ViewChild('sortInventario') sortInventario!: MatSort;

  columnsObsInventario: string[] = [
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

  constructor() { }

  ngOnInit(): void {
    this.listaDetalleInventarioDS = new MatTableDataSource(this.listaDetalleInventario);
    this.listaDetalleInventarioDS.paginator = this.paginadoInventario;
    this.listaDetalleInventarioDS.sort = this.sortInventario;
  }

  closeCierreModal(){
    this.closelistaDetalleInventario.emit(false); 
  }

  applyFilterInventario(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.listaDetalleInventarioDS.filter = filterValue.trim().toLowerCase();
  }

}
