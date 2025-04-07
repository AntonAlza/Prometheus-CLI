import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Item } from 'angular2-multiselect-dropdown';
import { Cobertura } from 'src/app/models/Tesoreria/cobertura';
import { CoberturaVigente } from 'src/app/models/Tesoreria/coberturaVigente';
import { FacturaAPagar } from 'src/app/models/Tesoreria/facturaAPagar';
import { TesoreriaService } from 'src/app/models/Tesoreria/tesoreria.service';
import { UsuarioPorRol } from 'src/app/models/Tesoreria/usuarioPorRol';
import { EstructuraCorreo } from 'src/app/models/Tesoreria/estructuraCorreo';
import Swal from 'sweetalert2';
import { TokenService } from 'src/app/shared/services/token.service';
import { Subsidiaria } from 'src/app/models/Tesoreria/subsidiaria';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-pago-facturas',
  templateUrl: './pago-facturas.component.html',
  styleUrls: ['./pago-facturas.component.scss']
})
export class PagoFacturasComponent implements OnInit {
  public tituloTabla: string="Pago de Facturas";
  dataSource: MatTableDataSource<FacturaAPagar>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild('dsSort') dsSort!: MatSort;

  public listFacturas: FacturaAPagar[] = [];
  public facturasSeleccionadas: FacturaAPagar[] = [];
  public flgSeleccionarTodo: boolean = false;
  public strFecPago: string = "";
  public fec_pago = {day: new Date().getDate(),month: new Date().getMonth() + 1,year: new Date().getFullYear()};
  public listCoberturasVigentes: CoberturaVigente[] = [];
  public listCoberturasPorFactura: CoberturaVigente[] = [];
  public flgFiltrarPagados: boolean = false;
  public nFacturas: number = 0;
  public totalPago: number = 0;

  public listSubsidiarias: string[] = [];

  public flgMostrarFiltros: boolean = false;
  public filtroSubsidiaria;
  public filtroMontoPagarDesde;
  public filtroMontoPagarHasta;
  public filtroMontoCubiertoDesde;
  public filtroMontoCubiertoHasta;
  public flgFiltrarSeleccionados: boolean = false;
  public globalFilterValue: string = '';

  flgCargando: boolean = false;

  @ViewChild('divFijo') divPanelFijo: ElementRef;
  @ViewChild('divTabla') divTabla: ElementRef;

  public estructuraCorreo: EstructuraCorreo = new EstructuraCorreo();

  contextMenuPosition = { x: '0px', y: '0px' };
  @ViewChild(MatMenuTrigger)
  contextMenu!: MatMenuTrigger;
  onContextMenu(event: MouseEvent, item: any) {
    if (((item.nominal - item.montoCoberturado) <= 0) || ((item.nominal - item.montoCoberturado) > 0 && (item.nominal - item.montoCoberturado) < item.nominal)){
      this.listCoberturasPorFactura = this.listCoberturasVigentes.filter(e => e.id_co == item.codigo_factura);
      event.preventDefault();
      this.contextMenuPosition.x = event.clientX + 'px';
      this.contextMenuPosition.y = event.clientY + 'px';
      this.contextMenu.menuData = { 'item': item };
      this.contextMenu.menu.focusFirstItem('mouse');
      this.contextMenu.openMenu();
    }
  }

  displayedColumns: string[] = [
    'seleccionarFactura',
    'codigo_factura',
    'subsidiaria',
    'proveedor',
    'fecha_registro',
    'fecha_comprobante',
    'fecha_vencimiento',
    'moneda',
    'nominal',
    'montoCoberturado',
    'monto_pagado',
    'saldoPagar'
  ];

  constructor(private modalService: NgbModal, private tesoreriaService: TesoreriaService, private tokenService: TokenService) { }

  ngOnInit(): void {
    this.inicializarValores();
  }

  inicializarValores(){
    this.fec_pago = {day: new Date().getDate(),month: new Date().getMonth() + 1,year: new Date().getFullYear()};
    this.facturasSeleccionadas = [];
    this.flgFiltrarPagados = false;
    this.flgSeleccionarTodo = false;

    this.strFecPago = this.dateToString(this.fec_pago);

    this.obtenerFacturas();
  }

  obtenerFacturas(){
    this.flgCargando = true;
    this.tesoreriaService.getListaFacturasAPagar(Number(this.strFecPago.replace(/-/g, ''))).subscribe(
      (response: FacturaAPagar[]) => {
        this.facturasSeleccionadas = [];
        this.flgSeleccionarTodo = false;
        this.listFacturas = response;
        this.listFacturas.map(e => e.usuario_pago = this.tokenService.getUserName());
        this.dataSource = new MatTableDataSource(this.listFacturas.filter(e => this.flgFiltrarPagados ? e.monto_pagado > 0 : e.monto_pagado < e.nominal));
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.dsSort;
        this.nFacturas = this.dataSource.data.length;
        this.totalPago = this.dataSource.data.filter(e => e.flgFacturaSeleccionada).reduce((suma, item) => suma + (this.flgFiltrarPagados ? Number(item.monto_pagado) : Number(item.saldoPagar)), 0);
        this.listSubsidiarias = this.dataSource.data.map(e => e.subsidiaria).filter((value, index, self) => self.indexOf(value) === index);

        this.tesoreriaService.getListaCoberturasVigentes(Number(this.strFecPago.replace(/-/g, ''))).subscribe(
          (response: CoberturaVigente[]) => {
            this.listCoberturasVigentes = response;
            this.flgCargando = false;
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
            this.flgCargando = false;
          }
        );

      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        this.flgCargando = false;
      }
    );
  }

  obtenerTablaPagosFactura(): {subsidiariasPago: string, montosPago: string, strTablaDetallePago: string}{
    let strTablaDetallePago: string = "";
    let subsidiariasPago: string = "";
    let montosPago: string = "";

    const groupedData = this.facturasSeleccionadas.reduce((acc, item) => {
      const key = `${item.subsidiaria}-${item.moneda}`;
      if (!acc[key]) {
        acc[key] = { subsidiaria: item.subsidiaria, moneda: item.moneda, saldoPagar: Number(item.saldoPagar) };
      } else {
        acc[key].saldoPagar += Number(item.saldoPagar);
      }
      return acc;
    }, {});
    
    let listPagosAgrupados = Object.keys(groupedData).map((key) => groupedData[key]);

    strTablaDetallePago += '<table class="miTabla">';
    strTablaDetallePago += '<tr>';
    strTablaDetallePago += "<th>DESDE</th><th>HACIA</th><th>FECHA</th><th>MONEDA</th><th>MONTO</th>";
    strTablaDetallePago += "</tr>";
    for(let i of listPagosAgrupados){
      strTablaDetallePago += "<tr>";
      strTablaDetallePago += `<td>${i.subsidiaria}</td><td>Prometheus Uruguay</td><td>${this.strFecPago.split("-")[2]}/${this.strFecPago.split("-")[1]}/${this.strFecPago.split("-")[0]}</td><td>${i.moneda}</td><td>${i.saldoPagar.toLocaleString('en-US')}</td>`;
      strTablaDetallePago += "</tr>";

      subsidiariasPago += ((subsidiariasPago != "") ? " / " : "") + i.subsidiaria;
      montosPago += ((montosPago != "") ? " / " : "") + i.moneda + " " + i.saldoPagar.toLocaleString('en-US');
    }
    strTablaDetallePago += "</table>";

    return {subsidiariasPago, montosPago, strTablaDetallePago};
  }

  obtenerTablaDetalleFacturas(): string{
    let strTablaDetalleFacturas = "";
    strTablaDetalleFacturas += '<table class="miTabla">';
    strTablaDetalleFacturas += "<tr>";
    strTablaDetalleFacturas += "<th>FACTURA</th><th>SUBSIDIARIA</th><th>MONEDA</th><th>MONTO</th>";
    strTablaDetalleFacturas += "</tr>";
    for(let i of this.facturasSeleccionadas){
      strTablaDetalleFacturas += "<tr>";
      strTablaDetalleFacturas += `<td>${i.codigo_factura}</td><td>${i.subsidiaria}</td><td>${i.moneda}</td><td>${Number(i.saldoPagar).toLocaleString('en-US')}</td>`;
      strTablaDetalleFacturas += "</tr>";
    }
    strTablaDetalleFacturas += "</table>";

    return strTablaDetalleFacturas;
  }

  obtenerUsuariosProgramacionPago(usuarios: UsuarioPorRol[]): {usuarioProgramacionPago: string, usuarioRegistroPago: string, usuarioVBPago: string}{
    let usuarioProgramacionPago: string = "";
    let usuarioRegistroPago: string = "";
    let usuarioVBPago: string = "";
    for (let i of usuarios){
      let rolCorreo: string = i.rol.split(";").slice(-1)[0]
      switch(rolCorreo){
        case 'Programacion':
          usuarioProgramacionPago += ((usuarioProgramacionPago != "") ? '/' : '') + `<a href="mailto:${i.email}"><span style='text-decoration:none'>@${i.usuario}</span></a>`;
          break;
        case 'Registro':
          usuarioRegistroPago += ((usuarioRegistroPago != "") ? '/' : '') + `<a href="mailto:${i.email}"><span style='text-decoration:none'>@${i.usuario}</span></a>`;
          break;
        case 'VB':
          usuarioVBPago += ((usuarioVBPago != "") ? '/' : '') + `<a href="mailto:${i.email}"><span style='text-decoration:none'>@${i.usuario}</span></a>`;
          break;
      }
    }
    return {usuarioProgramacionPago, usuarioRegistroPago, usuarioVBPago};
  }

  accionPago(){
    this.flgFiltrarPagados ? this.anularPago() : this.pagarFactura();
  }

  anularPago(){
    Swal.fire({
      icon: 'question',
      title: 'Anular Pago',
      html: '¿Desea anular el pago de las facturas seleccionadas?',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Continuar',
      reverseButtons: true,
      confirmButtonColor: '#4b822d'
    }).then((result) => {
      if (result.isConfirmed){
        this.tesoreriaService.postAnularPagoFactura(this.facturasSeleccionadas).subscribe(
          (response: any) =>{
            console.log(response);
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'El pago de la(s) factura(s) ha sido anulado con éxito.',
              confirmButtonText: "Aceptar",
              confirmButtonColor: '#4b822d'
            });
            this.inicializarValores();
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          }
        );
      }
    }
    );
  }

  pagarFactura(){    
    this.facturasSeleccionadas = this.facturasSeleccionadas.filter(e => e.saldoPagar > 0);
    console.log("Facturas a pagar: ", this.facturasSeleccionadas);
    this.totalPago = this.dataSource.data.filter(e => e.flgFacturaSeleccionada).reduce((suma, item) => suma + (this.flgFiltrarPagados ? Number(item.monto_pagado) : Number(item.saldoPagar)), 0);
    Swal.fire({
      icon: 'question',
      title: 'Pagar Factura',
      html: `¿Desea realizar el pago de las facturas seleccionadas?<br><br><b>Monto total a pagar: ${this.totalPago.toLocaleString('en-US')}</b>`,
      input: 'textarea',
      inputPlaceholder: 'Nota (opcional)',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Continuar',
      reverseButtons: true,
      confirmButtonColor: '#4b822d'
    }).then((result) => {
      if (result.isConfirmed){
        this.tesoreriaService.postPagarFactura(this.facturasSeleccionadas).subscribe(
          (response: UsuarioPorRol[]) => {
            console.log("Response Pago: ", response);
            let usuariosPorRol = this.obtenerUsuariosProgramacionPago(response);
            let usuariosPeru: boolean = response.some(item => item.rol.toLowerCase().includes("peru"));
            let usuariosInbalnor: boolean = response.some(item => item.rol.toLowerCase().includes("inbalnor"));
            
            let rolesCopia: string = (usuariosPeru ? "PagoFacturas;Peru;Copia" : "");
            rolesCopia += (usuariosPeru && usuariosInbalnor ? "//" : "") + (usuariosInbalnor ? "PagoFacturas;Inbalnor;Copia" : "");

            let rolesDestinatario: string = (usuariosPeru ? "PagoFacturas;Peru;Programacion//PagoFacturas;Peru;Registro//PagoFacturas;Peru;VB" : "");
            rolesDestinatario += (usuariosPeru && usuariosInbalnor ? "//" : "") + (usuariosInbalnor ? "PagoFacturas;Inbalnor;Programacion//PagoFacturas;Inbalnor;Registro//PagoFacturas;Inbalnor;VB" : "");

            let pagosAgrupadosPorSubsidiaria = this.obtenerTablaPagosFactura();
            
            let subsidiariasPago: string = pagosAgrupadosPorSubsidiaria.subsidiariasPago;
            let strTablaDetallePago: string = pagosAgrupadosPorSubsidiaria.strTablaDetallePago;
            let montosPago: string = pagosAgrupadosPorSubsidiaria.montosPago;
            let usuarioProgramacionPago: string = usuariosPorRol.usuarioProgramacionPago;
            let usuarioRegistroPago: string = usuariosPorRol.usuarioRegistroPago;
            let usuarioVBPago: string = usuariosPorRol.usuarioVBPago;
            let strTablaDetalleFacturas: string = this.obtenerTablaDetalleFacturas();
    
            let estilos = '<style type="text/css">';
            estilos += ' .miTabla {border-collapse:collapse; border-color:white;}';
            estilos += ' .miTabla th {background:#369A5A; color:white;}';
            estilos += ' .miTabla td {color:black; background:#DBDBDB;}';
            estilos += ' .miTabla td, .miTabla th {padding:1.5px 20px; border:1.5px solid white; text-align:center}';
            estilos += ' </style>';
    
            this.estructuraCorreo.asunto = "[" + this.strFecPago.split("-")[2] + "/" + this.strFecPago.split("-")[1] + "] Pago de facturas " + subsidiariasPago + " a Prometheus " + montosPago;
            this.estructuraCorreo.copiar = rolesCopia;
            this.estructuraCorreo.destinatarios = rolesDestinatario;
            this.estructuraCorreo.cuerpo = `${estilos}<p>Hola ${usuarioProgramacionPago},<br><br>Por favor tu apoyo con la programación de la transferencia siguiendo el detalle:<br><br>${strTablaDetallePago}${usuarioRegistroPago}, su amable apoyo para el registro, considerar los siguientes números de documento de la(s) factura(s):<br><br>${strTablaDetalleFacturas}${usuarioVBPago}, por favor tu apoyo con tu VB para proceder con la transferencia.${result.value != '' ? ('<br><br>Nota: ' + result.value) : ''}<br><br>Saludos.<br>Equipo de Riesgos de Tesorería.</p>`;
            this.estructuraCorreo.importante = false;
            this.estructuraCorreo.adjuntos = [];
    
            console.log("Estructura Correo: ", this.estructuraCorreo);
    
            this.tesoreriaService.postEnvioCorreoJava(this.estructuraCorreo).subscribe(
              (response: any) => {
                console.log("envio correo: ", response);
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: 'Las facturas han sido pagadas con éxito.',
                  confirmButtonText: "Aceptar",
                  confirmButtonColor: '#4b822d'
                });
                this.inicializarValores();
              },(error: HttpErrorResponse) => {
                alert(error.message);
              }
            );
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          }
        );
      }
    }
    );
  }

  seleccionarTodo(){
    for (const factura of this.dataSource.data){
      factura.flgFacturaSeleccionada = this.flgSeleccionarTodo;
    }
    this.flgSeleccionarTodo ? this.facturasSeleccionadas = this.dataSource.data : this.facturasSeleccionadas = [];

    this.totalPago = this.dataSource.data.filter(e => e.flgFacturaSeleccionada).reduce((suma, item) => suma + (this.flgFiltrarPagados ? Number(item.monto_pagado) : Number(item.saldoPagar)), 0);
  }

  facturaSeleccionada(element: any){
    if(element.flgFacturaSeleccionada){
      this.facturasSeleccionadas.push(element);
    }
    else{
      this.facturasSeleccionadas.forEach((value, index) => {
        if(value == element) this.facturasSeleccionadas.splice(index,1);
      });
    }
    this.flgSeleccionarTodo = (this.facturasSeleccionadas.filter(e => e.flgFacturaSeleccionada).length > 0);

    this.totalPago = this.dataSource.data.filter(e => e.flgFacturaSeleccionada).reduce((suma, item) => suma + (this.flgFiltrarPagados ? Number(item.monto_pagado) : Number(item.saldoPagar)), 0);
  }

  public dateToString = ((date) => {
    if(date.day<10 && date.month<10){
      return `${date.year}-0${date.month}-0${date.day}`.toString();
    }else if (date.day<10 ){
      return `${date.year}-${date.month}-0${date.day}`.toString();
    }else if (date.month<10){
      return `${date.year}-0${date.month}-${date.day}`.toString();
    }else{
      return `${date.year}-${date.month}-${date.day}`.toString();
    }
  });

  setFechaPago(date){
    let posicion=date.indexOf("/",1)
    let posicion2=date.indexOf( "/",posicion+1)

    let pMes=date.substring(0,posicion)
    let pDia=date.substring(posicion+1, posicion2)
    let pAnho=date.substring(posicion2+1)

    this.fec_pago = {day: pDia, month: pMes, year: pAnho};
    this.strFecPago = this.dateToString(this.fec_pago);

    this.obtenerFacturas();
  }

  cambiarValorSaldo(element){
    if (element.saldoPagar < 0)
      element.saldoPagar = 0;
    else if (element.saldoPagar > element.saldoDisponible || !element.saldoPagar)
      element.saldoPagar = element.saldoDisponible;

    console.log("Saldo sin comas: ", element.saldoPagar);
    console.log("Saldo con comas: ", element.saldoPagar.toLocaleString('en-US'));
  }

  formatearValor(event: Event, element){
    const inputElement = event.target as HTMLInputElement;
    let newValue = inputElement.value;

    // Validar que solo se ingresen números, un punto decimal y números positivos
    newValue = newValue.replace(/[^0-9.]/g, '');

    // Validar que no se ingrese un número mayor al valor máximo
    const parsedValue = parseFloat(newValue);
    // if (isNaN(parsedValue) || parsedValue > element.saldoDisponible) {
    //   newValue = element.saldoDisponible.toString();
    // }

    if (parsedValue > element.saldoDisponible) {
      newValue = element.saldoDisponible.toString();
    }

    // Actualizar el valor del input y la variable
    inputElement.value = this.formatNumber(newValue);
    element.saldoPagar = newValue;
    this.totalPago = this.dataSource.data.filter(e => e.flgFacturaSeleccionada).reduce((suma, item) => suma + (this.flgFiltrarPagados ? Number(item.monto_pagado) : Number(item.saldoPagar)), 0);
  }

  formatNumber(value: string): string {
    if (/^[+-]?\d+(\.\d+)?[eE][+-]?\d+$/.test(value)){
      return Number(value).toFixed(12);
    }
    else{
      const parts = value.split('.');
      parts[0] = parts[0].replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return parts.join('.');
    }
  }

  definirColorFila(element) : string{
    if ((element.nominal - element.montoCoberturado) <= 0)
      return 'resaltarFilaCoberturaTotal';
    else if ((element.nominal - element.montoCoberturado) > 0 && (element.nominal - element.montoCoberturado) < element.nominal)
      return 'resaltarFilaCoberturaParcial';
    else
      return '';
  }

  definirToolTipFila(element): string{
    let nCoberturas = this.listCoberturasVigentes.filter(e => e.id_co == element.codigo_factura).length;
    if ((element.nominal - element.montoCoberturado) <= 0)
      return 'El total de la factura está coberturando a ' + nCoberturas + ' instrumento(s)';
    else if ((element.nominal - element.montoCoberturado) > 0 && (element.nominal - element.montoCoberturado) < element.nominal)
      return element.montoCoberturado + ' ' + element.moneda +  ' de esta factura están coberturando a ' + nCoberturas + ' instrumento(s)';
    else
      return '';
  }

  modalCoberturaFacturas(modal: any){
    const modalRef =this.modalService.open(modal,{windowClass : "my-classModal",backdrop: 'static', keyboard: false});
  }

  cerrarModal(e){
    this.inicializarValores();
  }

  filtrarFacturasPagadas(){
    this.facturasSeleccionadas = [];
    this.flgSeleccionarTodo = false;
    for (const factura of this.dataSource.data){
      factura.flgFacturaSeleccionada = false;
    }
    this.dataSource = new MatTableDataSource(this.listFacturas.filter(e => this.flgFiltrarPagados ? e.monto_pagado > 0 : e.monto_pagado < e.nominal));
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.dsSort;

    this.nFacturas = this.dataSource.data.length;
  }

  onSelectSubsidiaria(subsidiaria){
    this.filtroSubsidiaria = subsidiaria;
    this.aplicarFiltros();
  }

  // Filtro global: este método se ejecuta cuando el usuario escribe en el input global
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.globalFilterValue = filterValue.trim().toLowerCase();  // Actualizamos el valor global
    this.aplicarFiltros();  // Llamamos a aplicarFiltros después de que se cambió el filtro global
  }

  // Aplica todos los filtros (global y específicos)
  aplicarFiltros() {
    this.dataSource.filterPredicate = (data: FacturaAPagar, filter: string) => {
      // Filtra globalmente si hay un valor en globalFilterValue
      const globalMatch = this.globalFilterValue ? Object.values(data).some(value => 
        value != null && value.toString().toLowerCase().includes(this.globalFilterValue)
      ) : true;

      // Aplica los filtros específicos (subsidiaria, montos, etc.)
      const specificFiltersMatch = 
        ((this.filtroSubsidiaria && this.filtroSubsidiaria.length > 0) ? this.filtroSubsidiaria.includes(data.subsidiaria.toString()) : true)
        && ((this.filtroMontoPagarDesde != null) ? data.saldoPagar > this.filtroMontoPagarDesde : true)
        && ((this.filtroMontoPagarHasta != null) ? data.saldoPagar <= this.filtroMontoPagarHasta : true)
        && ((this.filtroMontoCubiertoDesde != null) ? data.montoCoberturado > this.filtroMontoCubiertoDesde : true)
        && ((this.filtroMontoCubiertoHasta != null) ? data.montoCoberturado <= this.filtroMontoCubiertoHasta : true)
        && (this.flgFiltrarSeleccionados ? data.flgFacturaSeleccionada == true : true);

      // Devuelve true si ambos filtros (global y específicos) coinciden
      return globalMatch && specificFiltersMatch;
    };

    // Aplica el filtro de manera que los filtros específicos se apliquen siempre
    // Si no hay filtro global, pasamos una cadena vacía, pero los filtros específicos se seguirán aplicando
    this.dataSource.filter = this.globalFilterValue || " ";  // Usamos un espacio en vez de cadena vacía
  }
  


  toggleFilter(){
    this.flgMostrarFiltros = !this.flgMostrarFiltros;
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event){
    const rectTabla = this.divTabla.nativeElement.getBoundingClientRect();
    this.divPanelFijo.nativeElement.style.top = `${((rectTabla.top - 106.64) < 137 ? 137 : (rectTabla.top - 106.64))}px`;
    this.divPanelFijo.nativeElement.style.position = `${((rectTabla.top - 106.64) < 137 ? 'fixed' : '')}`;
  }
}
