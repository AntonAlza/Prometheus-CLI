import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ControlBasesFlatsCM } from 'src/app/models/Fisico/Consumo Masivo/ControlBasesFlatsCM';


@Component({
  selector: 'app-detalle-bases',
  templateUrl: './detalle-bases.component.html',
  styleUrls: ['./detalle-bases.component.scss']
})
export class DetalleBasesComponent implements OnInit {

  @Output () closelistaDetalleBase: EventEmitter<boolean>= new EventEmitter();

  @Input() listaDetalleBenchmark: ControlBasesFlatsCM[] = [];

  listaDetalleBenchmarkDS: MatTableDataSource<ControlBasesFlatsCM>

  @ViewChild('paginadoBenchmark', { static: true }) paginadoBenchmark!: MatPaginator;
  @ViewChild('sortBenchmark') sortBenchmark!: MatSort;

  columnsObsBenchmark: string[] = [
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

  closeCierreModal(){
    this.closelistaDetalleBase.emit(false); 
  }

  ngOnInit(): void {
    this.listaDetalleBenchmarkDS = new MatTableDataSource(this.listaDetalleBenchmark);
    this.listaDetalleBenchmarkDS.paginator = this.paginadoBenchmark;
    this.listaDetalleBenchmarkDS.sort = this.sortBenchmark;
  }

}
