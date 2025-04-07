import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { HistoricoModificacion } from 'src/app/models/Tesoreria/historicoModificacion';
import { Moneda } from 'src/app/models/Tesoreria/moneda';
import { TesoreriaService } from 'src/app/models/Tesoreria/tesoreria.service';
import { TokenService } from 'src/app/shared/services/token.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mantenedor-moneda',
  templateUrl: './mantenedor-moneda.component.html',
  styleUrls: ['./mantenedor-moneda.component.scss']
})
export class MantenedorMonedaComponent implements OnInit {
  public tituloTabla: string="Mantenedor de Monedas";
  public dsMonedas: MatTableDataSource<Moneda>;
  public listMonedas: Moneda[] = [];
  public flgFiltrarHabilitadas: boolean = true;
  public listMonedaModificada: Moneda[] = [];
  public listMonedasOriginales: Moneda[] = [];
  listModificationHistory: HistoricoModificacion[] = [];

  displayedColumnsMonedas: string[] = [
    't064Id',
    't064Description',
    't064Status'
  ];

  constructor(private tesoreriaService: TesoreriaService, private tokenService: TokenService) { }

  ngOnInit(): void {
    this.obtenerMonedas();
  }

  obtenerMonedas(){
    this.tesoreriaService.getListaMonedas().subscribe(
      (response: Moneda[]) => {
        this.listMonedaModificada = response;
        this.dsMonedas = new MatTableDataSource(this.listMonedaModificada);
        this.dsMonedas.filter = String(this.flgFiltrarHabilitadas);
      }
    );
    this.tesoreriaService.getListaMonedas().subscribe(
      (response: Moneda[]) => {
        this.listMonedasOriginales = response;
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dsMonedas.filter = filterValue.trim().toLowerCase();
  }

  filtrarMonedasHabilitadas(){
    this.dsMonedas.filter = String(this.flgFiltrarHabilitadas);
  }

  onChangeEstado(element: any){
    if(!this.esNuevaFila(element)){
      Swal.fire({
        icon: 'question',
        title: (element.t064Status ? 'Habilitar' : 'Deshabilitar') + ' moneda',
        html: '¿Desea ' + (element.t064Status ? 'habilitar' : 'deshabilitar') + ' esta moneda?',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Continuar',
        reverseButtons: true,
        confirmButtonColor: '#4b822d'
      }).then((result) => {
        if (result.isConfirmed){
          if (element.t064Description != ''){
            let listMonedaModif: Moneda[] = [];
            listMonedaModif.push(element);
  
            this.listModificationHistory = [];
  
            let objMoficationHistory = new HistoricoModificacion();
            objMoficationHistory.t486_id_process = 8;
            objMoficationHistory.t486_table_name = 't064_currency';
            objMoficationHistory.t486_table_register_id = element.t064Id;
            objMoficationHistory.t486_column_name = 't453_status';
            objMoficationHistory.t486_previous_value = (!element.t064Status).toString();
            objMoficationHistory.t486_new_value = element.t064Status.toString();
            objMoficationHistory.t486_registered_by = this.tokenService.getUserName();
            this.listModificationHistory.push(objMoficationHistory);
            
            this.tesoreriaService.postGuardarMoneda(listMonedaModif).subscribe(
              (response: any) => {
                this.tesoreriaService.postGuardarControlCambios(this.listModificationHistory).subscribe(
                  (response: any) => {
                    Swal.fire({
                      position: 'center',
                      icon: 'success',
                      title: 'La moneda fue ' + (element.t064Status ? 'habilitada' : 'deshabilitada') + '.',
                      confirmButtonText: "Aceptar",
                      confirmButtonColor: '#4b822d'
                    });
                    this.obtenerMonedas();
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
            element.t064Status = !element.t064Status;
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: 'La descripción no puede estar vacía.',
              confirmButtonText: "Aceptar",
              confirmButtonColor: '#4b822d'
            });
          }
          
        }
        else{
          element.t064Status = !element.t064Status;
          this.dsMonedas.filter = String(this.flgFiltrarHabilitadas);
        }
      });
    }
  }

  obtenerMonedasAGuardar(listMonedasAInsertar: Moneda[]){
    listMonedasAInsertar.forEach(objMonedaModificada => {
      let objMonedaOriginal = this.listMonedasOriginales.find(obj => obj.t064Id == objMonedaModificada.t064Id);
      if(objMonedaOriginal){
        this.compararMonedas(objMonedaOriginal, objMonedaModificada);
      }
    });
  }

  compararMonedas<T extends Record<string, any>>(obj1: T, obj2: T) {
    const keys1 = Object.keys(obj1) as (keyof T)[];
    const keys2 = Object.keys(obj2) as (keyof T)[];
    if (keys1.length !== keys2.length) {
      return;
    }
    for (let key of keys2){
      if (obj1[key] != obj2[key]){
        let objMoficationHistory = new HistoricoModificacion();
        objMoficationHistory.t486_id_process = 8;
        objMoficationHistory.t486_table_name = 't064_currency';
        objMoficationHistory.t486_table_register_id = obj1.t064Id;
        objMoficationHistory.t486_column_name = key.toString();
        objMoficationHistory.t486_previous_value = obj1[key].toString();
        objMoficationHistory.t486_new_value = obj2[key].toString();
        objMoficationHistory.t486_registered_by = this.tokenService.getUserName();
        this.listModificationHistory.push(objMoficationHistory);
      }
    }
  }

  guardarMoneda(){
    let listMonedasAInsertar: Moneda[] = [];
    this.listModificationHistory = [];
    
    for(const [key, item] of this.listMonedaModificada.entries()){
      if(item.t064Id != "" && item.t064Description != "" && item.t064Id.length == 3
        && (this.listMonedasOriginales.some(e => e.t064Id.toUpperCase() == item.t064Id.toUpperCase()) ? (key >= (this.listMonedaModificada.length - this.listMonedasOriginales.length) ? (this.listMonedasOriginales[key - (this.listMonedaModificada.length - this.listMonedasOriginales.length)].t064Description != item.t064Description) : false) : true)){
        item.t064Id = item.t064Id.toUpperCase();
        listMonedasAInsertar.push(item);
      }
    }

    if(listMonedasAInsertar.length > 0){
      this.obtenerMonedasAGuardar(listMonedasAInsertar);
      this.tesoreriaService.postGuardarMoneda(listMonedasAInsertar).subscribe(
        (response: any) => {
          this.tesoreriaService.postGuardarControlCambios(this.listModificationHistory).subscribe(
            (response: any) => {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Se guardaron los cambios.',
                confirmButtonText: "Aceptar",
                confirmButtonColor: '#4b822d'
              });
              this.obtenerMonedas();
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

  agregarFila(){
    let nuevaFila: Moneda = new Moneda();
    nuevaFila.t064Id = "";
    nuevaFila.t064Description = "";
    nuevaFila.t064Status = true;
    this.listMonedaModificada.unshift(nuevaFila);
    this.dsMonedas = new MatTableDataSource(this.listMonedaModificada);
  }

  esNuevaFila(element: Moneda): boolean{
      return !(this.listMonedaModificada.indexOf(element) >= (this.listMonedaModificada.length - this.listMonedasOriginales.length));
  }

  existeCodigo(element: Moneda): boolean{
    return this.listMonedasOriginales.some(e => e.t064Id.toUpperCase() == element.t064Id.toUpperCase())
      && this.listMonedaModificada.indexOf(element) < (this.listMonedaModificada.length - this.listMonedasOriginales.length);
  }

  existeDescripcion(element: Moneda): boolean{
    return this.listMonedasOriginales.some(e => e.t064Description.toUpperCase() == element.t064Description.toUpperCase())
      && this.listMonedaModificada.indexOf(element) < (this.listMonedaModificada.length - this.listMonedasOriginales.length);;
  }

}
