import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { HistoricoModificacion } from 'src/app/models/Tesoreria/historicoModificacion';
import { Moneda } from 'src/app/models/Tesoreria/moneda';
import { Pais } from 'src/app/models/Tesoreria/pais';
import { Subsidiaria } from 'src/app/models/Tesoreria/subsidiaria';
import { TesoreriaService } from 'src/app/models/Tesoreria/tesoreria.service';
import { TokenService } from 'src/app/shared/services/token.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mantenedor-subsidiaria',
  templateUrl: './mantenedor-subsidiaria.component.html',
  styleUrls: ['./mantenedor-subsidiaria.component.scss']
})
export class MantenedorSubsidiariaComponent implements OnInit {
  public tituloTabla: string="Mantenedor de Subsidiarias";
  public listSubsidiariasPorCompletar: Subsidiaria[] = [];
  public listSubsidiariasOriginales: Subsidiaria[] = [];
  public listMonedas: Moneda[] = [];
  public listPaises: Pais[] = [];
  public flgFiltroPorCompletar: boolean = true;
  listModificationHistory: HistoricoModificacion[] = [];
  dsSubsidiarias: MatTableDataSource<Subsidiaria>;
  displayedColumnsSubsidiarias: string[] = [
    't453DescriptionTreasury',
    't453Country',
    't453Currency',
    't453Status',
    't453StatusBlackList'
  ];

  constructor(private tesoreriaService: TesoreriaService, private tokenService: TokenService) { }

  ngOnInit(): void {
    this.obtenerSubsidiarias();
    
    this.tesoreriaService.getListaMonedas().subscribe(
      (response: Moneda[]) => {
        this.listMonedas = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );

    this.tesoreriaService.getListaPaises().subscribe(
      (response: Pais[]) => {
        this.listPaises = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  guardarSubsidiaria(){
    this.listModificationHistory = [];
    let listSubsidiariasAGuardar: Subsidiaria[] = this.obtenerSubsidiariasAGuardar();
    if (listSubsidiariasAGuardar.length > 0){
      let ultIDSubsidiaria: number = this.listSubsidiariasOriginales.reduce((max, obj) => obj.t453Id > max ? obj.t453Id : max, this.listSubsidiariasOriginales[0].t453Id);
      for(let objSubsidiaria of listSubsidiariasAGuardar){
        if (objSubsidiaria.t453Id == null){
          ultIDSubsidiaria = ultIDSubsidiaria + 1;
          objSubsidiaria.t453Id = ultIDSubsidiaria;
        }
      }
      this.tesoreriaService.postGuardarSubsidiaria(listSubsidiariasAGuardar).subscribe(
        (response: any) => {
          this.tesoreriaService.postGuardarControlCambios(this.listModificationHistory).subscribe(
            (response: any) => {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Las subsidiarias se guardaron satisfactoriamente.',
                confirmButtonText: "Aceptar",
                confirmButtonColor: '#4b822d'
              });
              this.obtenerSubsidiarias();
            },
            (error: HttpErrorResponse) => {
              alert(error.message);
            }
          );
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    }
    else{
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'No se guardó ningún cambio',
        html: 'Por favor verifique que no existan registros duplicados o campos vacíos',
        confirmButtonText: "Aceptar",
        confirmButtonColor: '#4b822d'
      });
    }
  }

  obtenerSubsidiariasAGuardar(): Subsidiaria[]{
    let listSubsidiariaDif: Subsidiaria[] = [];
    this.listSubsidiariasPorCompletar.forEach(objSubsidiariaModificada => {
      let objSubsidiariaOriginal = this.listSubsidiariasOriginales.find(obj => obj.t453Id == objSubsidiariaModificada.t453Id);
      if((!objSubsidiariaOriginal || !this.compararSubsidiarias(objSubsidiariaOriginal, objSubsidiariaModificada)) && objSubsidiariaModificada.t453DescriptionTreasury != ''){
        listSubsidiariaDif.push(objSubsidiariaModificada);
      }
    });
    return listSubsidiariaDif;
  }

  compararSubsidiarias<T extends Record<string, any>>(obj1: T, obj2: T): boolean {
    const keys1 = Object.keys(obj1) as (keyof T)[];
    const keys2 = Object.keys(obj2) as (keyof T)[];
    if (keys1.length !== keys2.length) {
      return false;
    }
    for (let key of keys2){
      if (obj1[key] != obj2[key]){
        let objMoficationHistory = new HistoricoModificacion();
        objMoficationHistory.t486_id_process = 7;
        objMoficationHistory.t486_table_name = 't453_subsidiary';
        objMoficationHistory.t486_table_register_id = obj1.t453Id;
        objMoficationHistory.t486_column_name = key.toString();
        objMoficationHistory.t486_previous_value = obj1[key].toString();
        objMoficationHistory.t486_new_value = obj2[key].toString();
        objMoficationHistory.t486_registered_by = this.tokenService.getUserName();
        this.listModificationHistory.push(objMoficationHistory);
      }
    }
    return keys1.every(key => obj1[key] === obj2[key]);
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dsSubsidiarias.filter = filterValue.trim().toLowerCase();
  }

  obtenerSubsidiarias(){
    this.tesoreriaService.getListaSubsidiarias().subscribe(
      (response: Subsidiaria[]) => {
        this.listSubsidiariasPorCompletar = response;
        this.dsSubsidiarias = new MatTableDataSource(this.listSubsidiariasPorCompletar);
        this.filtrarSubsidiarias();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
    this.tesoreriaService.getListaSubsidiarias().subscribe(
      (response: Subsidiaria[]) => {
        this.listSubsidiariasOriginales = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  filtrarSubsidiarias(){
    this.dsSubsidiarias.filterPredicate = (subsidiaria : Subsidiaria, filter) => {
      return (this.flgFiltroPorCompletar ? (subsidiaria.t453Country === "-" || subsidiaria.t453Currency === "-") 
                                          : (subsidiaria.t453Country !== "-" && subsidiaria.t453Currency !== "-"));
    };
    this.dsSubsidiarias.filter = "filtro";
  }

  agregarFila(){
    let nuevaFila: Subsidiaria = new Subsidiaria();
    nuevaFila.t453DescriptionTreasury = "";
    nuevaFila.t453Country = "-";
    nuevaFila.t453Currency = "XXX";
    nuevaFila.t453Status = false;
    nuevaFila.t453StatusBlackList = false;
    nuevaFila.t453Description = "";
    this.listSubsidiariasPorCompletar.unshift(nuevaFila);
    this.dsSubsidiarias = new MatTableDataSource(this.listSubsidiariasPorCompletar);
    this.flgFiltroPorCompletar = true;
    this.filtrarSubsidiarias();
  }

  existeDescripcion(element: Subsidiaria): boolean{
    return this.listSubsidiariasOriginales.some(e => e.t453DescriptionTreasury.toLowerCase() == element.t453DescriptionTreasury.toLowerCase())
    && this.listSubsidiariasPorCompletar.indexOf(element) < (this.listSubsidiariasPorCompletar.length - this.listSubsidiariasOriginales.length);
  }

}
