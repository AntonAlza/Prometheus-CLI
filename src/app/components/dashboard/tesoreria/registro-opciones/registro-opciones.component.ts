import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Moneda } from 'src/app/models/Tesoreria/moneda';
import { Opcion } from 'src/app/models/Tesoreria/opcion';
import { TesoreriaService } from 'src/app/models/Tesoreria/tesoreria.service';

@Component({
  selector: 'app-registro-opciones',
  templateUrl: './registro-opciones.component.html',
  styleUrls: ['./registro-opciones.component.scss']
})
export class RegistroOpcionesComponent implements OnInit {
  public tituloTabla: string="Consulta de Opciones";
  public opcionesFiltradas: Opcion[] = [];
  public nInstrumentos: number = 0;
  public flgSeleccionarTodo: boolean = true;
  public listOpciones: Opcion[] = [];
  public listMonedas: Moneda[] = [];
  public carpetaArchivos: string = "RDT/RegistroOpciones/";
  
  dataSource: MatTableDataSource<Opcion>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  displayedColumns: string[] = [
    't463_id',
    't463_code_bbg',
    'desc_subsidiary',
    'desc_counterpart',
    'desc_typeOperation',
    't463_id_modality',
    't463_start_date',
    't463_end_date',
    't463_settlement_date',
    'nominal',
    't463_option_premium',
    't463_strike',
    // 't463_record_type',
    't463_trader_name',
    't463_currency_rec',
    't463_currency_del',

    // 't463_currency_liqu'
  ];

  constructor(private tesoreriaService: TesoreriaService) { }

  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel="Registros por Página";
    this.obtenerOpciones();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  obtenerOpciones(){
    this.tesoreriaService.getListaOpciones().subscribe(
      (response: Opcion[]) => {
        this.listOpciones = response;
        this.dataSource = new MatTableDataSource(this.listOpciones);
        this.dataSource.paginator = this.paginator;
        this.nInstrumentos = this.dataSource.data.length;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

}
