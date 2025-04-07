import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Item } from 'angular2-multiselect-dropdown';
import { Subscription } from 'rxjs';
import { InstrumentoPorCoberturar } from 'src/app/models/Tesoreria/instrumentoPorCoberturar';
import { TesoreriaService } from 'src/app/models/Tesoreria/tesoreria.service';
import { EstructuraCorreo } from 'src/app/models/Tesoreria/estructuraCorreo';
import { TokenService } from 'src/app/shared/services/token.service';
import Swal from 'sweetalert2';
import { Subsidiaria } from 'src/app/models/Tesoreria/subsidiaria';

@Component({
  selector: 'app-registro-operaciones-rtd',
  templateUrl: './registro-operaciones-rtd.component.html',
  styleUrls: ['./registro-operaciones-rtd.component.scss']
})
export class RegistroOperacionesRTDComponent implements OnInit {
  public tituloTabla: string="Registro de Operaciones";
  public nInstrumentosNuevos: number = 0;
  // public nFacturasNuevas: number = 8;
  public nInstrumentosNoCubiertos: number = 0;
  public flgFiltrarCoberturados: boolean = false;
  public flgSeleccionarTodo: boolean = false;

  public instrumentosFiltrados: InstrumentoPorCoberturar[] = [];
  public listSubsidiarias: string[] = [];
  public filtroSubsidiaria;

  public nInstrumentos: number = 0;
  public opcionesReversion = [{id: 1, texto: 'Tipo'}, {id: 2, texto: 'Cambio de estrategia'}, {id: 3, texto: 'Otro'}];
  public estructuraCorreo: EstructuraCorreo = new EstructuraCorreo();

  private messageSubscription: Subscription;

  dataSource: MatTableDataSource<InstrumentoPorCoberturar>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild('dsSort') dsSort!: MatSort;
  public listInstrumentos: InstrumentoPorCoberturar[] = [];
  displayedColumns: string[] = [
    'seleccionarInstrumento',
    't463_id',
    't463_code_bbg',
    'desc_subsidiary',
    'desc_counterpart',
    'desc_typeOperation',
    't463_start_date',
    't463_end_date',
    't463_settlement_date',
    't463_nominal_rec',
    't463_strike',
    't463_record_type',
    't463_external_reference',
    't463_trader_name',

    // 't463_registered_by',
    // 't463_registration_date',
    // 't459_deal_code',
    // 'desc_counterpart_type',
    // 't463_id_subsidiary',
    // 't463_id_modality',
    // 't463_counterparty_trader_name',
    // 'par_moneda',
    // 't463_currency_liqu',
    // 't463_spot',
    // 'desc_quotation',
    
  ];

  constructor(private modalService: NgbModal,
    private tesoreriaService: TesoreriaService,
    private tokenService: TokenService) { }

  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel="Registros por Página";
    this.obtenerInstrumentos();

    setInterval(() => {
      this.obtenerInstrumentos();
    }, 10000);

    // this.messageSubscription = this.tesoreriaService.messages$.subscribe(
    //   (msg: any) => {
    //     console.log("Mensaje recibido: " + msg.message)
    //     if (msg.message == 'NuevoFWD'){
    //       setTimeout(() => {
    //         this.obtenerInstrumentos();
    //       }, 5000);
    //     }
    //   },
    //   (err) => console.error(err),
    //   () => console.log('Conexión WebSocket cerrada')
    // );
  }

  contextMenuPosition = { x: '0px', y: '0px' };
  @ViewChild(MatMenuTrigger)
  contextMenu!: MatMenuTrigger;
  onContextMenu(event: MouseEvent, item: Item) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { 'item': item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  abrirModal(modal: any){
    const modalRef =this.modalService.open(modal,{windowClass : "my-classModal",backdrop: 'static', keyboard: false});
  }

  cerrarModal(e){
    this.instrumentosFiltrados = [];
    this.flgSeleccionarTodo = false;
    this.flgFiltrarCoberturados = false;
    this.obtenerInstrumentos(null, true);
    this.seleccionarTodo();
  }


  mostrarMensajeSuperior(mensaje: string){
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 5000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    });

    Toast.fire({
      icon: 'success',
      title: mensaje
    });
  }

  sonListasDistintas(listInstrumentos1: InstrumentoPorCoberturar[], listInstrumentos2: InstrumentoPorCoberturar[]): boolean{
    let lista1 = listInstrumentos1.map(objeto => {
      const { ["flgInstrumentoSeleccionado"]: columnaEliminar1, ["montoCubierto"]: columnaEiliminar2, ["usuario"]: columnaEliminar3, ...restoDeColumnas } = objeto;
      return restoDeColumnas;
    });

    let lista2 = listInstrumentos2.map(objeto => {
      const { ["flgInstrumentoSeleccionado"]: columnaEliminar1, ["montoCubierto"]: columnaEiliminar2, ["usuario"]: columnaEliminar3, ...restoDeColumnas } = objeto;
      return restoDeColumnas;
    });

    if (lista1.length !== lista2.length) {
      let nFilasLista1 = lista1.length;
      let nFilasLista2 = lista2.length;
      let diferencia = nFilasLista2 - nFilasLista1;
      if (nFilasLista1 > 0 && nFilasLista2 > 0){
        diferencia > 0 ? 
          this.mostrarMensajeSuperior(`Se añadieron ${diferencia} instrumentos`)
          : this.mostrarMensajeSuperior(`Se eliminaron ${diferencia * -1} instrumentos`)
      }
      return true;
    }

    for (let i = 0; i < lista1.length; i++) {
      const fila1 = lista1[i];
      const fila2 = lista2[i];

      for (let columna in fila1) {
        if (fila1[columna] !== fila2[columna]) {
          this.mostrarMensajeSuperior(`Se modificaron instrumentos`);
          return true;
        }
      }
    }
    return false;
  }

  obtenerInstrumentos(modal?: any, flgActualizar?: boolean){
    this.tesoreriaService.getListaInstrumentosPorCoberturar().subscribe(
      (response: InstrumentoPorCoberturar[]) => {
        if (this.sonListasDistintas(this.listInstrumentos, response) || flgActualizar){
          this.listInstrumentos = response;
          this.listInstrumentos.map(e => e.usuario = this.tokenService.getUserName());
          console.log("instrumentos: ", this.listInstrumentos);
          this.dataSource = new MatTableDataSource(this.listInstrumentos.filter(e => this.flgFiltrarCoberturados ? e.montoCubierto > 0 : e.montoCubierto == 0));
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.dsSort;
          this.nInstrumentos = this.dataSource.data.length;

          this.listSubsidiarias = this.dataSource.data.map(e=>e.desc_subsidiary).filter((value, index, self) => self.indexOf(value) === index);
  
          if(this.flgFiltrarCoberturados){
            this.instrumentosFiltrados = this.listInstrumentos.filter(e => this.instrumentosFiltrados.map(e => e.t463_id).includes(e.t463_id));
            if(modal){
              this.abrirModal(modal);
            }
          }
        }
        
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  instrumentoSeleccionado(element: any){
    if(element.flgInstrumentoSeleccionado){
      this.instrumentosFiltrados.push(element);
    }
    else{
      this.instrumentosFiltrados.forEach((value, index) => {
        if(value == element) this.instrumentosFiltrados.splice(index,1);
      });
    }
    this.flgSeleccionarTodo = (this.instrumentosFiltrados.filter(e => e.flgInstrumentoSeleccionado).length > 0);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  filtrarInstrumentosCoberturados(){
    this.dataSource = new MatTableDataSource(this.listInstrumentos.filter(e => this.flgFiltrarCoberturados ? e.montoCubierto > 0 : e.montoCubierto == 0));
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.dsSort;
    this.nInstrumentos = this.dataSource.data.length;
    this.flgSeleccionarTodo = false;
    this.seleccionarTodo();
  }

  accionCobertura(modal: any){
    this.flgFiltrarCoberturados ? this.deshacerCobertura(modal) : this.abrirModal(modal);
  }

  deshacerCobertura(modal: any){
    Swal.fire({
      icon: 'question',
      title: 'Deshacer Cobertura',
      html: '¿Desea deshacer las coberturas seleccionadas?',
      input: 'select',
      inputOptions: this.opcionesReversion.reduce((obj, option) => {
        obj[option.id] = option.texto;
        return obj;
      }, {}),
      customClass:{
        container: 'custom-select',
        input: 'ng-select'
      },
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Continuar',
      reverseButtons: true,
      confirmButtonColor: '#4b822d'
    }).then((result) => {
      if (result.isConfirmed){
        const opcionIDSeleccionada = result.value;
        const opcionSeleccionada = this.opcionesReversion.find((x) => x.id == opcionIDSeleccionada);
        this.tesoreriaService.postDeshacerCobertura(this.instrumentosFiltrados).subscribe(
          (response: any) => {
            this.enviarCorreo(opcionSeleccionada? opcionSeleccionada.texto : '', modal);
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          }
        );
      }
    }
    );
  }

  fechaIntAString(fecha): string{
    return (fecha.toString().slice(6,8) + '/' + fecha.toString().slice(4,6) + '/' + fecha.toString().slice(0,4));
  }

  enviarCorreo(motivo: string, modal: any){
    let listInstrumentosCorreo: string = '';
    let paisesCorreo: string[] = [];
    for(const i of this.instrumentosFiltrados){
      if (!paisesCorreo.includes(i.subsidiary_country)){
        paisesCorreo.push(i.subsidiary_country);
      }
      listInstrumentosCorreo += `<br>● ${i.t463_type_ci}-${i.t463_id} (Fec Inicio: ${this.fechaIntAString(i.t463_start_date)})`
    }
    this.estructuraCorreo.asunto = "[ Balance ] - Se deshizo la cobertura del siguiente grupo de forwards";
    this.estructuraCorreo.copiar = "";
    this.estructuraCorreo.destinatarios = "RDT_Coberturas_Correo_Default";

    for(const paisSubsidiaria of paisesCorreo){
      switch (paisSubsidiaria){
        case 'PE':{
          this.estructuraCorreo.destinatarios += "//RDT_Coberturas_Correo_Peru";
          break;
        }
        case 'UY':{
          this.estructuraCorreo.destinatarios += "//RDT_Coberturas_Correo_Uruguay";
          break;
        }
        case 'CO':{
          this.estructuraCorreo.destinatarios += "//RDT_Coberturas_Correo_Colombia";
          break;
        }
        case 'ES':{
          this.estructuraCorreo.destinatarios += "//RDT_Coberturas_Correo_Espana";
          break;
        }
      }
    }

    this.estructuraCorreo.cuerpo = `<p>Hola,<br><br>Se confirma que se acaba de deshacer la cobertura de un grupo de forwards. A continuación, el detalle:<br><br> <b>Motivo</b>: ${motivo}<br><b>Instrumentos:</b>${listInstrumentosCorreo}<br><b>Usuario: </b>${this.tokenService.getUserName()} <br><br>Saludos. <br>Equipo de Riesgos de Tesorería.</p>`;
    this.estructuraCorreo.importante = false;
    this.estructuraCorreo.adjuntos = [];
    console.log("estructura correo: ", this.estructuraCorreo);
    this.tesoreriaService.postEnvioCorreoJava(this.estructuraCorreo).subscribe(
      (response: any) => {
        console.log("envio correo: ", response);
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Las coberturas se deshicieron satisfactoriamente. Es necesario cubrir nuevamente los instrumentos.',
          confirmButtonText: "Aceptar",
          confirmButtonColor: '#4b822d'
        });
        // this.instrumentosFiltrados = [];
        // this.obtenerInstrumentos();
        this.obtenerInstrumentos(modal, true);
      },(error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  seleccionarTodo(){
    for (const instrumento of this.dataSource.data){
      instrumento.flgInstrumentoSeleccionado = this.flgSeleccionarTodo;
    }
    this.flgSeleccionarTodo ? this.instrumentosFiltrados = this.dataSource.data : this.instrumentosFiltrados = [];
  }

  onSelectSubsidiaria(){
    this.aplicarFiltros();
  }

  aplicarFiltros(){
      this.dataSource.filterPredicate = (data: InstrumentoPorCoberturar, filter) => {
        return ((this.filtroSubsidiaria && this.filtroSubsidiaria.length > 0) ? this.filtroSubsidiaria.includes(data.desc_subsidiary.toString()) : true)
      }
      this.dataSource.filter = "filtro";
    }


  ngOnDestroy() {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }

}
