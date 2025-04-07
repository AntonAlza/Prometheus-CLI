import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Item } from 'angular2-multiselect-dropdown';
import { Observable } from 'rxjs';
import { LoadingService } from 'src/app/components/loading.service';
import { ClosingPrice } from 'src/app/models/Fisico/ClosingPrice';
import { CancellationFuture } from 'src/app/models/Fisico/Consumo Masivo/CancellationFuture';
import { LibroFisicoService } from 'src/app/models/Fisico/Consumo Masivo/libroFisico.service';
import { listarFuturos } from 'src/app/models/Fisico/Consumo Masivo/listarFuturos';
import { ObjEliminarFuturo } from 'src/app/models/Fisico/Consumo Masivo/ObjEliminarFuturo';
import { ObjModificarFuturo } from 'src/app/models/Fisico/Consumo Masivo/objModificarFuturo';
import { PortafolioIFDMoliendaService } from 'src/app/models/IFD/portafolioIFDMolienda.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listar-futuro',
  templateUrl: './listar-futuro.component.html',
  styleUrls: ['./listar-futuro.component.scss']
})
export class ListarFuturoComponent implements OnInit, OnDestroy {
  public loading$= this.loader.loading$
  public listaFuturosCMDS: MatTableDataSource<listarFuturos>;
  @Input() listaFuturos:listarFuturos[];
  @Output () cerrarListarFuturo: EventEmitter<boolean>= new EventEmitter();
  estadoPortafolio: boolean = true;
  estados$!: Observable<string[][]>
  estados: string[][];

  @ViewChild(MatMenuTrigger)
  contextmenu!: MatMenuTrigger;

  @ViewChild(MatPaginator, { static: true }) paginadoLista!: MatPaginator;
  @ViewChild(MatSort) sortLista!: MatSort;

  objetoInitModificarFuturo: ObjModificarFuturo;

  columnsFuturos: string[] = [
    'opciones',
    's022_CodigoFisico'
    ,'s022_CodigoFuturo'
    ,'s022_Futuro'
    ,'s022_CodigoPricing'
    ,'s022_Fecha'
    ,'s022_TipoOperacion'
    ,'s022_NumeroContratos'
    ,'s022_ToneladasMetricas'
    ,'s022_Precio'
    ,'s022_PrecioCosto'
    ,'s022_PANDL_Costo'
    ,'s022_Comment'
  ];

  constructor(private loader:LoadingService,
              private libroFisico: LibroFisicoService,
              private portafolioMoliendaIFDService: PortafolioIFDMoliendaService,
              private modalService: NgbModal) { 
    
  }
  ngOnDestroy(): void {
    this.cerrarListarFuturo.emit(false); 
  }

  onContextMenu(event: MouseEvent, item: Item) {
    event.preventDefault();
    this.contextmenu.menuData = { 'item': item };
    this.contextmenu.menu.focusFirstItem('mouse');
  }

  ngOnInit(): void {
    this.listaFuturosCMDS = new MatTableDataSource(this.listaFuturos);
    this.listaFuturosCMDS.paginator = this.paginadoLista;
    this.listaFuturosCMDS.sort = this.sortLista;
    this.obtenerEstadoPortafolio();
  }

  

  public obtenerEstadoPortafolio(): void {
    this.libroFisico.obtenerEstados().subscribe(
      (response: string[][]) => {
        if(response !== undefined){
          this.estados = response;
          for(var i = 0; i < response.length; i++){
            // if(Number(this.estados[i][0]) == this.sociedadSelected && Number(this.estados[i][1]) == this.productoSelected){
            if(Number(this.estados[i][0]) == this.libroFisico.sociedad && Number(this.estados[i][1]) == this.libroFisico.subyacente){
              this.estadoPortafolio = false;
              break;
            }else{
              this.estadoPortafolio = true;
            }
          }
          if(response.length == 0){
            this.estadoPortafolio = true;
          }
        }
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
  }

  applyFilterListaFuturo(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.listaFuturosCMDS.filter = filterValue.trim().toLowerCase();
  }

  eliminarFuturo(){

    if(!this.validarpermisos("Usted no cuenta con permisos para eliminar futuro")){
      return;
    }

    if(!this.validarEstadoPortafolio()){
      return;
    }

    if(this.listaFuturos.some(x => x.s022_CodigoPricing > this.contextmenu.menuData.item && x.s022_TipoOperacion == 'Venta')){
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'No se puede cancelar pricing de Compra/Venta anteriores a Ventas.',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      });
      return;
    }

    if(this.listaFuturos.some(x => x.s022_CodigoPricing == this.contextmenu.menuData.item && x.s022_TipoOperacion == 'Venta') && this.listaFuturos.some(x => x.s022_CodigoPricing > this.contextmenu.menuData.item)){
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'No se puede cancelar pricing de Venta.',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      });
      return;
    }
    
    let operacionTipo: string = this.listaFuturos.filter(x => x.s022_CodigoPricing == this.contextmenu.menuData.item)[0]["s022_TipoOperacion"];

    this.loader.show();
    this.libroFisico.validarliminacionPricing(this.contextmenu.menuData.item).subscribe(
      (response: boolean) => {
        if(response == false && operacionTipo == "Compra" ){
          this.loader.hide();
          Swal.fire({
            icon: 'warning',
            title: 'Aviso',
            text: 'No se puede Cancelar Pricing porque descuadraría el valor Asignado a Barcos.',
            confirmButtonColor: '#0162e8',
            customClass: {
              container: 'my-swal'
            }
          });
          return;
        }

        this.libroFisico.validarCrossCompany(this.libroFisico.fisicoID).subscribe(
          (response: Boolean) => {
            this.loader.hide();
            if(response){
              Swal.fire({
                icon: 'warning',
                title: 'Aviso',
                text: 'No es posible elimiar futuro a barco Intercompany.',
                confirmButtonColor: '#0162e8',
                customClass: {
                  container: 'my-swal'
                }
              });
              return;
            }
            let dependencia: number = this.listaFuturos.filter(x => x.s022_CodigoPricing == this.contextmenu.menuData.item)[0]["s022_Dependencia"];
            
            if(dependencia != null && dependencia != 0){
              this.loader.hide();
              Swal.fire({
                icon: 'warning',
                title: 'Aviso',
                text: 'La Operación '+this.contextmenu.menuData.item+' tiene enlazada la Operación de Venta '+dependencia+' por tal motivo no puede ser Cancelada, debe primero Cancelar la Operación de Venta.',
                confirmButtonColor: '#0162e8',
                customClass: {
                  container: 'my-swal'
                }
              });
              return;
            }
    
            Swal.fire({
              icon: 'question',
              title: 'Cancelar Futuro',
              html: '¿Está seguro que desea Cancelar la Operación ' + this.contextmenu.menuData.item + '?' ,
              showCancelButton: true,
              cancelButtonText: 'Cancelar',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Continuar',
              reverseButtons: true,
              confirmButtonColor: '#4b822d'
            }).then((result) => {
              if (result.isConfirmed) {
                (async () => {
                  const {} = await Swal.fire({
                  icon: 'question',
                  title: 'Cancelar Futuro',
                  html: 'Por favor indique el Motivo de la Cancelación del Embarque ' + this.contextmenu.menuData.item,
                  input: 'text',
                  inputPlaceholder: 'Sustento',
                  showCancelButton: true,
                  cancelButtonText: 'Cancelar',
                  confirmButtonColor: '#4b822d',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Continuar',
                  reverseButtons: true,
                  inputValidator: (value) => {
                    return new Promise((resolve) => {
                      if (value.length > 400 || value.length === 0) {
                        resolve("Número de caracteres '" + value.length + "', número de caracteres permitido 400.");
                      }else{
                        let CancellationBase: CancellationFuture = new CancellationFuture();
                        CancellationBase.t091_ClosingPrice = this.contextmenu.menuData.item;
                        CancellationBase.t091_RegisteredBy = this.portafolioMoliendaIFDService.usuario;
                        CancellationBase.t091_Reason = value;

                        let objEliminar: ObjEliminarFuturo = new ObjEliminarFuturo();
                        objEliminar.cancelacionPricing = CancellationBase;
                        objEliminar.underlyingID = this.libroFisico.subyacente;
                        objEliminar.fisicoID = this.libroFisico.fisicoID;
                        
                        this.libroFisico.eliminarPricing(objEliminar).subscribe(
                          data=>{
                              this.listarFuturoModal();
                              Swal.fire({
                                icon: 'success',
                                title: 'Cancelar Futuro',
                                text: 'Se Canceló el futuro ' + this.contextmenu.menuData.item ,
                                confirmButtonColor: '#0162e8'
                              });
                          },
                          (error: HttpErrorResponse) => {
                            if(error.error.message.includes('ConstraintViolationException')){
                              Swal.fire({
                                icon: 'warning',
                                title: 'Aviso',
                                text: 'Error de Concurrencia, por favor volver a guardar.',
                                confirmButtonColor: '#0162e8',
                                customClass: {
                                  container: 'my-swal'
                                }
                              });
                            }else{
                              alert(error.message);
                            }
                          });
                      }
                    })
                  }
                })   
              })()          
              }
            })
    
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          });       
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });

    
  }

  cerrarModalFuturo(modal: any){
    modal.close();
    this.listarFuturoModal();
  }

  validarEstadoPortafolio(): boolean{
    if(!this.estadoPortafolio){
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'El portafolio se encuentra cerrado',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      })
      return this.estadoPortafolio;
    }else{
      return this.estadoPortafolio;
    }
  }

  listarFuturoModal(){
    this.libroFisico.obtenerListaFuturosXFisico(this.libroFisico.fisicoID).subscribe(
      (response: listarFuturos[]) => {
        this.listaFuturos = response;
        this.listaFuturosCMDS = new MatTableDataSource(this.listaFuturos);
        this.listaFuturosCMDS.paginator = this.paginadoLista;
        this.listaFuturosCMDS.sort = this.sortLista;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
  }

  modificarFuturo(modificarFuturoForm: any){

    if(!this.validarpermisos("Usted no cuenta con permisos para modificar futuro")){
      return;
    }

    if(!this.validarEstadoPortafolio()){
      return;
    }

    if(this.listaFuturos.some(x => x.s022_CodigoPricing > this.contextmenu.menuData.item && x.s022_TipoOperacion == 'Venta')){
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'No se puede modificar pricing de Compra anteriores a Ventas.',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      });
      return;
    }

    if(this.listaFuturos.some(x => x.s022_CodigoPricing == this.contextmenu.menuData.item && x.s022_TipoOperacion == 'Venta')){
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'No se puede modificar pricing de Venta.',
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      });
      return;
    }

    this.loader.show();
    this.libroFisico.validarCrossCompany(this.libroFisico.fisicoID).subscribe(
      (response: boolean) => {
        if(response){
          Swal.fire({
            title: 'Modificar Futuro',
            html: 'No es posible modificar futuro de barco proveniente de Ventas Molienda',
            icon: 'warning',
            confirmButtonColor: '#4b822d'
          })
          this.loader.hide();
          return;
        }
        let fila: number  = this.listaFuturos.filter(x => x.s022_CodigoPricing == this.contextmenu.menuData.item)[0]["s022_CodigoFuturo"];
        this.libroFisico.obtenerDatosModificarFuturo(this.contextmenu.menuData.item, fila).subscribe(
          (response: ObjModificarFuturo) => {
            this.objetoInitModificarFuturo = response;
            this.modalService.open(modificarFuturoForm,{windowClass : "class-ModificarFuturosCM",centered: true});
            this.loader.hide();
          },
          (error: HttpErrorResponse) => {
            this.loader.hide();
            alert(error.message);
          });
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    });
  }

  validarpermisos(comentario: string): boolean{
    if(!this.libroFisico.usuarioRegistra){
      Swal.fire({
        icon: 'error',
        title: 'Permiso denegado',
        text: comentario,
        confirmButtonColor: '#0162e8',
        customClass: {
          container: 'my-swal'
        }
      })
      return false;
    }else{
      return true;
    }
  }

}
