import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Companias } from "./companias";
import { PortafolioMolienda } from "./portafolioMolienda";
import { Underlying } from "./underlying";
import {ClosingControl} from "./closingControl";
import { cargaCombo } from "./cargaCombo";
import { SalesContract } from "./SalesContract";
import { Physical } from "./Physical";
import { Society } from "./Society";
import { AnimalNutrition } from "./AnimalNutrition";
import { FlatForSale } from "./FlatForSale";
import { ContratoCross } from "./ContratoCross";
import { listaFlatMolienda } from "./listaFlatMolienda";
import { listaFuturoMolienda } from "./listaFuturoMolienda";
import { listaBaseMolienda } from "./listaBaseMolienda";
import { BaseForSale } from "./BaseForSale";
import { BaseProfitAndLoss } from "./BaseProfitAndLoss";
import { ClosingBasis } from "./ClosingBasis";
import { ClosingBasisBetweenCompany } from "./ClosingBasisBetweenCompany";
import { PriceForSale } from "./PriceForSale";
import { FutureBetweenCompany } from "./FutureBetweenCompany";
import { Future } from "./Future";
import { ClosingPrice } from "./ClosingPrice";
import { ClosingPriceBetweenCompany } from "./ClosingPriceBetweenCompany";
import { RelationshipBetweenShipAndFuture } from "./RelationshipBetweenShipAndFuture";
import { guardarBaseCross } from "./guardarBaseCross";
import { FormacionPrecios } from "./FormacionPrecios";
import { listaPlanificacionConsumo } from "./listaPlanificacionConsumo";
import { PriceFormationAssignment } from "./PriceFormationAssignment";
import { ExtraPremium } from "./ExtraPremium";
import { CustomsDeclaration } from "./CustomsDeclaration";
import { PartialContractDownload } from "./PartialContractDownload";
import { Unloading } from "./Unloading";
import { UnloadingBetweenCompany } from "./UnloadingBetweenCompany";
import { objVentaParcialIntercompany } from "./objVentaParcialIntercompany";
import { listaDescargasParciales } from "./listaDescargasParciales";
import { listaGrupoRT } from "./listaGrupoRT";
import { PriceMonth } from "./PriceMonth";
import { listaAvanceSAP } from "./listaAvanceSAP";
import { ControlCierresVentasMolienda } from "./ControlCierresVentasMolienda";
import { Meses } from "./Meses";
import { DatosCierreComercial } from "./DatosCierreComercial";
import { Shipment } from "./Shipment";
import { ConsumptionPlanning } from "./ConsumptionPlanning";
import { consultaHistorica } from "./consultaHistorica";
import { consultaHistoricaEspecifica } from "./consultaHistoricaEspecifica";
import { ConsultaDosificadas } from "./ConsultaDosificadas";
import { objInitDosificada } from "./objInitDosificada";
import { listaAvanceSAPDosed } from "./listaAvanceSAPDosed";
import { listaPedidosDosificada } from "./listaPedidosDosificada";
import { Order } from "./Order";
import { objInitIngresarFactura } from "./objInitIngresarFactura";
import { objIngresarFactura } from "./objIngresarFactura";
import { datosFacturas } from "./datosFacturas";
import { Dosed } from "./Dosed";
import { consultaHistoricaDosificada } from "./consultaHistoricaDosificada";
import { objInitConsultaHistoricaFactura } from "./objInitConsultaHistoricaFactura";
import { Truck } from "./Truck";
import { IngresaFactura } from "./IngresaFactura";
import { objComboSociedades } from "./objComboSociedades";
import { objAnimalNutrition_ConsumoH } from "./objAnimalNutrition_ConsumoH";
import { UnderlyingClasiall } from "./underlyingclasifiall";
import { tipoCliente } from "./Consumo Masivo/Cliente";
import { tipoSociedad } from "./Sociedad_plus";
import { tipoRelacion_Soc_Und } from "./Rel_Soc_Under_cost";
import { tap } from "rxjs/operators";
import { tipoRelacion_Soc_Puertoorigen } from "./Rel_Soc_Puerto";
import { tipoRelacion_Soc_PuertoDestino } from "./Rel_Soc_Puerto_Origen";

@Injectable({
    providedIn: 'root'
})

export class PortafolioMoliendaService{

    private apiServerUrl=environment.apiBaseUrl;
    // private headers;
    constructor(private http: HttpClient){
        // this.headers = new HttpHeaders();
        // this.headers = this.headers.set('Authorization', 'Bearer ' + sessionStorage.getItem('AuthToken'));
    }
    
    public codigoContrato: string;
    public producto: string;
    public compania: string;
    public tipo: string;
    public flgActualizar: boolean;
    public flgEstadoPortafolio: boolean;
    public codigoFactura: number;
    public flgIngresoFactura: boolean;
    public codSAP: string;
    public flgIntercompany: boolean = false;
    

    public getPortafolioMolienda(sociedad:number,subyacente:number): Observable<PortafolioMolienda[]>{
        return this.http.get<PortafolioMolienda[]>(`${this.apiServerUrl}/VentasMolienda/all?sociedad=${sociedad}&subyacente=${subyacente}&dato=1`); //,{headers: this.headers}
    }
    public getPortafolioMoliendaCierre(sociedad:number): Observable<PortafolioMolienda[]>{
        return this.http.get<PortafolioMolienda[]>(`${this.apiServerUrl}/VentasMolienda/allcierre?sociedad=${sociedad}&dato=2`);
    }
    public getCompanias(): Observable<Companias[]>{
        return this.http.get<Companias[]>(`${this.apiServerUrl}/VentasMolienda/companias`);
    }
    public obtenerTodosProductos(): Observable<Underlying[]>{
        return this.http.get<Underlying[]>(`${this.apiServerUrl}/VentasMolienda/productos`);
    }
    public getproductos(sociedad:number): Observable<Underlying[]>{
        return this.http.get<Underlying[]>(`${this.apiServerUrl}/VentasMolienda/productos?sociedad=${sociedad}`);
    }
    public getproductosMolienda(): Observable<Underlying[]>{
        return this.http.get<Underlying[]>(`${this.apiServerUrl}/VentasMolienda/productosMolienda`);
    }
    public getEstado(sociedad:number,subyacente:number): Observable<ClosingControl[]>{
        return this.http.get<ClosingControl[]>(`${this.apiServerUrl}/VentasMolienda/estadoPortafolio?sociedad=${sociedad}&subyacente=${subyacente}`);
    }
    public getEstadoCrossCompany(Underlying:number,Sociedad:number): Observable<ClosingControl[]>{
        return this.http.get<ClosingControl[]>(`${this.apiServerUrl}/VentasMolienda/obtenerEstadoPortafolioCrossCompany?Underlying=${Underlying}&Sociedad=${Sociedad}`);
    }
    public getCombo(opcion:string): Observable<cargaCombo[]>{
        return this.http.get<cargaCombo[]>(`${this.apiServerUrl}/VentasMolienda/comboXCodig?opcion=${opcion}`);
    }
    public getComboParam1(opcion:string,param1:string): Observable<cargaCombo[]>{
        return this.http.get<cargaCombo[]>(`${this.apiServerUrl}/VentasMolienda/comboXCodig1?opcion=${opcion}&param1=${param1}`);
    }
    public getComboParam2(opcion:string,param1:string,param2:string): Observable<cargaCombo[]>{
        return this.http.get<cargaCombo[]>(`${this.apiServerUrl}/VentasMolienda/comboXCodig2?opcion=${opcion}&param1=${param1}&param2=${param2}`);
    }
    public getComboParam3(opcion:string,param1:string,param2:string,param3:string): Observable<cargaCombo[]>{
        return this.http.get<cargaCombo[]>(`${this.apiServerUrl}/VentasMolienda/comboXCodig3?opcion=${opcion}&param1=${param1}&param2=${param2}&param3=${param3}`);
    }
    public getComboXTabla(tabla:string): Observable<cargaCombo[]>{
        return this.http.get<cargaCombo[]>(`${this.apiServerUrl}/VentasMolienda/cargarcombo?tabla=${tabla}`);
    }
    public getNuevoContrato(sociedad:string,mercado:string): Observable<cargaCombo[]>{
        return this.http.get<cargaCombo[]>(`${this.apiServerUrl}/VentasMolienda/nuevoContrato?sociedad=${sociedad}&mercado=${mercado}`);
    }
    public getNuevoCodigo(): Observable<string>{
        return this.http.get<string>(`${this.apiServerUrl}/VentasMolienda/nuevoCodigo`);
    }
    public getToneladasContratos(toneladas:string,contrato:string): Observable<string>{
        return this.http.get<string>(`${this.apiServerUrl}/VentasMolienda/toneladasaContratos?toneladas=${toneladas}&contrato=${contrato}`);
    }
    public getContratosTM(contratos:string,contrato:string): Observable<string>{
        return this.http.get<string>(`${this.apiServerUrl}/VentasMolienda/contratosaTM?contratos=${contratos}&contrato=${contrato}`);
    }
    public crearContrato(salesContract: SalesContract){
        return this.http.post<SalesContract>(`${this.apiServerUrl}/VentasMolienda/guardarContrato`,salesContract);
    }
    public guardarPlanificacion(planningList: ConsumptionPlanning[]){
        return this.http.post<ConsumptionPlanning[]>(`${this.apiServerUrl}/VentasMolienda/guardarPlanificacion`,planningList);
    }
    public buscarPlanificacion(CONTRATO:number): Observable<ConsumptionPlanning[]>{
        return this.http.get<ConsumptionPlanning[]>(`${this.apiServerUrl}/VentasMolienda/buscarPlanificacion?CONTRATO=${CONTRATO}`);
    }
    public listarComprasEntreCompanias(cliente:number): Observable<string>{
        return this.http.get<string>(`${this.apiServerUrl}/VentasMolienda/compraentrecompanias?cliente=${cliente}`);
    }
    public nuevoContratoBarco(sociedad:number,subyacente:number): Observable<string[]>{
        return this.http.get<string[]>(`${this.apiServerUrl}/VentasMolienda/nuevoContratoBarco?sociedad=${sociedad}&subyacente=${subyacente}`);
    }
    public guardarAnimalNutrition(animalNutrition: AnimalNutrition){
        return this.http.post<string>(`${this.apiServerUrl}/VentasMolienda/guardarAnimalNutrition`,animalNutrition);
    }
    public crearFisico(physical: Physical){
        return this.http.post<string>(`${this.apiServerUrl}/VentasMolienda/guardarFisico`,physical);
    }
    public getCompaniasBarcos(): Observable<objComboSociedades>{
        return this.http.get<objComboSociedades>(`${this.apiServerUrl}/VentasMolienda/companiasBarcos`);
    }
    public getContrato(id:number): Observable<SalesContract>{
        return this.http.get<SalesContract>(`${this.apiServerUrl}/VentasMolienda/obtenerContrato?id=${id}`);
    }
    public obtenerNuevoID(tabla:string,columna:string): Observable<string[]>{
        return this.http.get<string[]>(`${this.apiServerUrl}/VentasMolienda/nuevoID?tabla=${tabla}&columna=${columna}`);
    }
    public precioContratoVenta(CONTRATO_VENTA:number,DATO:number): Observable<string[]>{
        return this.http.get<string[]>(`${this.apiServerUrl}/VentasMolienda/precioContratoVenta?CONTRATO_VENTA=${CONTRATO_VENTA}&DATO=${DATO}`);
    }
    public precioOtrosXConcepto(CONTRATO_VENTA:number,CONCEPTO_PRECIO:number,DATO:number): Observable<string[]>{
        return this.http.get<string[]>(`${this.apiServerUrl}/VentasMolienda/precioOtrosXConcepto?CONTRATO_VENTA=${CONTRATO_VENTA}&CONCEPTO_PRECIO=${CONCEPTO_PRECIO}&DATO=${DATO}`);
    }
    public obtenerPhysicalSeller(T033_ID:number): Observable<string[]>{
        return this.http.get<string[]>(`${this.apiServerUrl}/VentasMolienda/obtenerPhysicalSeller?T033_ID=${T033_ID}`);
    }
    public obtenerUnderlyingClassification(Producto:number): Observable<string[]>{
        return this.http.get<string[]>(`${this.apiServerUrl}/VentasMolienda/obtenerUnderlyingClassification?Producto=${Producto}`);
    }

    public obtenerProteinLevel(Producto:number): Observable<string[]>{
        return this.http.get<string[]>(`${this.apiServerUrl}/VentasMolienda/obtenerProteinLevel?Producto=${Producto}`);
    }
    public obtenerPriceFormation(id:number): Observable<string[]>{
        return this.http.get<string[]>(`${this.apiServerUrl}/VentasMolienda/obtenerPriceFormation?id=${id}`);
    }
    public PrecioOtros(id:number): Observable<string[]>{
        return this.http.get<string[]>(`${this.apiServerUrl}/VentasMolienda/PrecioOtros?id=${id}`);
    }
    public crearFlat(flat: FlatForSale){
        return this.http.post<string>(`${this.apiServerUrl}/VentasMolienda/guardarFlat`,flat);
    }
    public modificarFlat(flat: FlatForSale){
        return this.http.post<string>(`${this.apiServerUrl}/VentasMolienda/modificarFlat`,flat);
    }
    public crearContratoCross(contratoCross: ContratoCross){
        return this.http.post<SalesContract>(`${this.apiServerUrl}/VentasMolienda/guardarContratoCross`,contratoCross);
    }
    public modificarContratoCross(contratoCross: ContratoCross){
        return this.http.post<string>(`${this.apiServerUrl}/VentasMolienda/modificarContratoCross`,contratoCross);
    }
    public ControlFisicoEnFret(BARCO:number,USUARIO:string): Observable<boolean>{
        return this.http.get<boolean>(`${this.apiServerUrl}/VentasMolienda/ControlFisicoEnFret?BARCO=${BARCO}&USUARIO=${USUARIO}`);
    }
    public getListaFlats(contrato:string): Observable<listaFlatMolienda[]>{
        return this.http.get<listaFlatMolienda[]>(`${this.apiServerUrl}/VentasMolienda/listarFlats?contrato=${contrato}`);
    }
    public getListaFuturos(contrato:string): Observable<listaFuturoMolienda[]>{
        return this.http.get<listaFuturoMolienda[]>(`${this.apiServerUrl}/VentasMolienda/listarFuturos?contrato=${contrato}`);
    }
    public listaBaseMolienda(contrato:string): Observable<listaBaseMolienda[]>{
        return this.http.get<listaBaseMolienda[]>(`${this.apiServerUrl}/VentasMolienda/listaBaseMolienda?contrato=${contrato}`);
    }
    public guardarBaseForSale(baseForSale: BaseForSale){
        return this.http.post<BaseForSale>(`${this.apiServerUrl}/VentasMolienda/guardarBaseForSale`,baseForSale);
    }
    public guardarBaseProfitAndLoss(baseProfitAndLoss: BaseProfitAndLoss){
        return this.http.post<string>(`${this.apiServerUrl}/VentasMolienda/guardarBaseProfitAndLoss`,baseProfitAndLoss);
    }
    public guardarClosingBasis(closingBasis: ClosingBasis){
        return this.http.post<string>(`${this.apiServerUrl}/VentasMolienda/guardarClosingBasis`,closingBasis);
    }
    public guardarClosingBasisBetweenCompany(closingBasisBetweenCompany: ClosingBasisBetweenCompany){
        return this.http.post<string>(`${this.apiServerUrl}/VentasMolienda/guardarClosingBasisBetweenCompany`,closingBasisBetweenCompany);
    }
    public guardarFuturo(priceForSale: PriceForSale){
        return this.http.post<string>(`${this.apiServerUrl}/VentasMolienda/guardarFuturo`,priceForSale);
    }
    public guardarmodificacionFuturo(priceForSale: PriceForSale){
        return this.http.post<string>(`${this.apiServerUrl}/VentasMolienda/guardarmodificacionFuturo`,priceForSale);
    }
    public CalculoWashOut(contrato:number,usuario:string): Observable<string[]>{
        return this.http.get<string[]>(`${this.apiServerUrl}/VentasMolienda/CalculoWashOut?contrato=${contrato}&usuario=${usuario}`);
    }
    public actualizarFlatPriceFisico(contrato:number): Observable<boolean>{
        return this.http.post<boolean>(`${this.apiServerUrl}/VentasMolienda/actualizarFlatPriceFisico`,contrato);
    }
    public factorMetricTonPrice(contrato:number): Observable<string[]>{
        return this.http.get<string[]>(`${this.apiServerUrl}/VentasMolienda/factorMetricTonPrice?contrato=${contrato}`);
    }
    public obtenerBarco(contrato:number): Observable<string[]>{
        return this.http.get<string[]>(`${this.apiServerUrl}/VentasMolienda/obtenerBarco?contrato=${contrato}`);
    }
    public obtenerTicker(contrato:number): Observable<string[]>{
        return this.http.get<string[]>(`${this.apiServerUrl}/VentasMolienda/obtenerTicker?contrato=${contrato}`);
    }
    public SaldoFuturo(contrato:number): Observable<string[]>{
        return this.http.get<string[]>(`${this.apiServerUrl}/VentasMolienda/SaldoFuturo?contrato=${contrato}`);
    }
    public obtenerFutureBetweenCompanyRepo(contrato:number): Observable<FutureBetweenCompany[]>{
        return this.http.get<FutureBetweenCompany[]>(`${this.apiServerUrl}/VentasMolienda/obtenerFutureBetweenCompanyRepo?contrato=${contrato}`);
    }
    public guardarFuture(future:Future): Observable<Future[]>{
        return this.http.post<Future[]>(`${this.apiServerUrl}/VentasMolienda/guardarFuture`,future);
    }
    public guardarFutureBetweenCompany(futureBetweenCompany:FutureBetweenCompany): Observable<FutureBetweenCompany[]>{
        return this.http.post<FutureBetweenCompany[]>(`${this.apiServerUrl}/VentasMolienda/guardarFutureBetweenCompany`,futureBetweenCompany);
    }
    public guardarClosingPrice(closingPrice:ClosingPrice): Observable<ClosingPrice[]>{
        return this.http.post<ClosingPrice[]>(`${this.apiServerUrl}/VentasMolienda/guardarClosingPrice`,closingPrice);
    }
    public guardarClosingPriceBetweenCompany(closingPriceBetweenCompany:ClosingPriceBetweenCompany): Observable<ClosingPriceBetweenCompany[]>{
        return this.http.post<ClosingPriceBetweenCompany[]>(`${this.apiServerUrl}/VentasMolienda/guardarClosingPriceBetweenCompany`,closingPriceBetweenCompany);
    }
    public guardarRelationshipBetweenShipAndFuture(relationshipBetweenShipAndFuture:RelationshipBetweenShipAndFuture): Observable<RelationshipBetweenShipAndFuture[]>{
        return this.http.post<RelationshipBetweenShipAndFuture[]>(`${this.apiServerUrl}/VentasMolienda/guardarRelationshipBetweenShipAndFuture`,relationshipBetweenShipAndFuture);
    }
    public buscarRelationshipBetweenShipAndFutureXFisicoyFuture(BARCO:number,FUTURO:number): Observable<RelationshipBetweenShipAndFuture[]>{
        return this.http.get<RelationshipBetweenShipAndFuture[]>(`${this.apiServerUrl}/VentasMolienda/buscarRelationshipBetweenShipAndFutureXFisicoyFuture?BARCO=${BARCO}&FUTURO=${FUTURO}`);
    }
    public updateRelationshipBetweenShipAndFuture(fecha: string,volumen: string,tm: string,usuario: string,barco: string,futuro: string): Observable<string>{
        return this.http.get<string>(`${this.apiServerUrl}/VentasMolienda/updateRelationshipBetweenShipAndFuture?fecha=${fecha}&volumen=${volumen.replace(".", "_")}&tm=${tm.replace(".", "_")}&usuario=${usuario}&barco=${barco.replace(".", "_")}&futuro=${futuro}`);
    }
    public crearBasesCross(baseCross: guardarBaseCross){
        return this.http.post<string>(`${this.apiServerUrl}/VentasMolienda/guardarBaseCross`,baseCross);
    }
    public obtenerFormacionPrecios(contrato:number): Observable<FormacionPrecios[]>{
        return this.http.get<FormacionPrecios[]>(`${this.apiServerUrl}/VentasMolienda/obtenerFormacionPrecios?contrato=${contrato}`);
    }
    public listarPreciosContrato(contrato:number): Observable<string[]>{
        return this.http.get<string[]>(`${this.apiServerUrl}/VentasMolienda/listarPreciosContrato?contrato=${contrato}`);
    }
    public listaPlanificacionConsumo(CONTRATO:string, FECINICIO:string, FECFIN:string, TM:string): Observable<listaPlanificacionConsumo[]>{
        return this.http.get<listaPlanificacionConsumo[]>(`${this.apiServerUrl}/VentasMolienda/listarPlanificacionConsumo?CONTRATO=${CONTRATO}&FECINICIO=${FECINICIO}&FECFIN=${FECFIN}&TM=${TM}`);
    }
    public nuevoPlanificacionConsumo(CODMES:number): Observable<listaPlanificacionConsumo>{
        return this.http.get<listaPlanificacionConsumo>(`${this.apiServerUrl}/VentasMolienda/nuevoPlanificacionConsumo?CODMES=${CODMES}`);
    }
    public guardarFormacionPrecios(precios: PriceFormationAssignment[]){
        return this.http.post<string>(`${this.apiServerUrl}/VentasMolienda/guardarFormacionPrecios`,precios);
    }
    public obtenerTickerXProducto(producto:string): Observable<string[]>{
        return this.http.get<string[]>(`${this.apiServerUrl}/VentasMolienda/obtenerTickerXProducto?producto=${producto}`);
    }
    public guardarDVA(dva: CustomsDeclaration[]){
        return this.http.post<string>(`${this.apiServerUrl}/VentasMolienda/guardarDVA`,dva);
    }
    public guardarExtraPrima(extraPrima: ExtraPremium[]){
        return this.http.post<string>(`${this.apiServerUrl}/VentasMolienda/guardarExtraPrima`,extraPrima);
    }
    public optionsForCalculation(SUBYACENTE:string,FORMACION:string): Observable<string[]>{
        return this.http.get<string[]>(`${this.apiServerUrl}/VentasMolienda/optionsForCalculation?SUBYACENTE=${SUBYACENTE}&FORMACION=${FORMACION}`);
    }
    public obtenerBenchmark(Fecha:string, Origen:string,Mes:string, Producto:string,Postura:string): Observable<string[]>{
        return this.http.get<string[]>(`${this.apiServerUrl}/VentasMolienda/obtenerBenchmark?Fecha=${Fecha}&Origen=${Origen}&Mes=${Mes}&Producto=${Producto}&Postura=${Postura}`);
    }
    public actualizarOtherCostsOrDiscountsCFR(contrato:number): Observable<boolean>{
        return this.http.post<boolean>(`${this.apiServerUrl}/VentasMolienda/actualizarOtherCostsOrDiscountsCFR`,contrato);
    }
    public actualizarFreightCFR(contrato:number): Observable<boolean>{
        return this.http.post<boolean>(`${this.apiServerUrl}/VentasMolienda/actualizarFreightCFR`,contrato);
    }
    public actualizarOtherCostsOrDiscounts(contrato:number): Observable<boolean>{
        return this.http.post<boolean>(`${this.apiServerUrl}/VentasMolienda/actualizarOtherCostsOrDiscounts`,contrato);
    }
    public obtenerValoresExtraPrima(Fecha:string, Contrato:string,Mes:string, Producto:string,Postura:string): Observable<string[]>{
        return this.http.get<string[]>(`${this.apiServerUrl}/VentasMolienda/obtenerValoresExtraPrima?Fecha=${Fecha}&Contrato=${Contrato}&Mes=${Mes}&Producto=${Producto}&Postura=${Postura}`);
    }
    public obtenerDescriptionXTabla(TABLA:string, CODIGO:string,CAMPO_OBTENER:string,CAMPO_ID:string): Observable<string[]>{
        return this.http.get<string[]>(`${this.apiServerUrl}/VentasMolienda/obtenerDescriptionXTabla?TABLA=${TABLA}&CODIGO=${CODIGO}&CAMPO_OBTENER=${CAMPO_OBTENER}&CAMPO_ID=${CAMPO_ID}`);
    }
    public eliminarFormacionPrecios(contrato:number): Observable<boolean>{
        return this.http.post<boolean>(`${this.apiServerUrl}/VentasMolienda/eliminarFormacionPrecios`,contrato);
    }
    public obtenerCodigoMes(MES:string): Observable<string[]>{
        return this.http.get<string[]>(`${this.apiServerUrl}/VentasMolienda/obtenerCodigoMes?MES=${MES}`);
    }
    public obtenerCodigoFecha(Fecha:string): Observable<string[]>{
        return this.http.get<string[]>(`${this.apiServerUrl}/VentasMolienda/obtenerCodigoFecha?Fecha=${Fecha}`);
    }
    public obtenerPrecioCompletoContratoVenta(CONTRATO:number): Observable<string[]>{
        return this.http.get<string[]>(`${this.apiServerUrl}/VentasMolienda/obtenerPrecioCompletoContratoVenta?CONTRATO=${CONTRATO}`);
    }
    public guardarPartialContractDownload(ventaParcial: PartialContractDownload){
        return this.http.post<PartialContractDownload>(`${this.apiServerUrl}/VentasMolienda/guardarPartialContractDownload`,ventaParcial);
    }
    public guardarVentaParcialIntercompany(objeto: objVentaParcialIntercompany){
        return this.http.post<string>(`${this.apiServerUrl}/VentasMolienda/guardarVentaParcialIntercompany`,objeto);
    }
    public guardarUnloading(unloading: Unloading){
        return this.http.post<string>(`${this.apiServerUrl}/VentasMolienda/guardarUnloading`,unloading);
    }
    public guardarUnloadingBetweenCompany(unloadingBetweenCompany: UnloadingBetweenCompany){
        return this.http.post<string>(`${this.apiServerUrl}/VentasMolienda/guardarUnloadingBetweenCompany`,unloadingBetweenCompany);
    }
    public actualizarEstado_PrecioFinal_VP(objeto:string[]): Observable<boolean>{
        return this.http.post<boolean>(`${this.apiServerUrl}/VentasMolienda/actualizarEstado_PrecioFinal_VP`,objeto);
    }
    public listarDescargasParciales(contrato:string): Observable<listaDescargasParciales[]>{
        return this.http.get<listaDescargasParciales[]>(`${this.apiServerUrl}/VentasMolienda/listarDescargasParciales?CONTRATO=${contrato}`);
    }
    public listarDescargasParciales_CM(contrato:string): Observable<listaDescargasParciales[]>{
        return this.http.get<listaDescargasParciales[]>(`${this.apiServerUrl}/VentasMolienda/listarDescargasParciales_CM?CONTRATO=${contrato}`);
    }
    public obtenerPriceMonth(contrato:string): Observable<PriceMonth>{
        return this.http.get<PriceMonth>(`${this.apiServerUrl}/VentasMolienda/obtenerPriceMonth?CONTRATO=${contrato}`);
    }
    public modificarContrato(salesContract: SalesContract){
        return this.http.post<string>(`${this.apiServerUrl}/VentasMolienda/modificarContrato`,salesContract);
    }
    public obtenerFisico(contrato:string): Observable<Physical>{
        return this.http.get<Physical>(`${this.apiServerUrl}/VentasMolienda/obtenerFisico?CONTRATO=${contrato}`);
    }
    public obtenerNutricionAnimal_CH(contrato:string): Observable<objAnimalNutrition_ConsumoH>{
        return this.http.get<objAnimalNutrition_ConsumoH>(`${this.apiServerUrl}/VentasMolienda/obtenerNutricionAnimal_CH?CONTRATO=${contrato}`);
    }
    public IntercompanyCerrado(contrato:string): Observable<string>{
        return this.http.get<string>(`${this.apiServerUrl}/VentasMolienda/IntercompanyCerrado?CONTRATO=${contrato}`);
    }
    public listarHijos(contrato:string): Observable<string[][]>{
        return this.http.get<string[][]>(`${this.apiServerUrl}/VentasMolienda/listarHijos?CONTRATO=${contrato}`);
    }
    public realizarSplit(CONTRATO_VENTA:string,TM:string): Observable<string>{
        return this.http.get<string>(`${this.apiServerUrl}/VentasMolienda/realizarSplit?CONTRATO_VENTA=${CONTRATO_VENTA}&TM=${TM}`);
    }
    public obtenerDetallePadre(contrato:string): Observable<string[][]>{
        return this.http.get<string[][]>(`${this.apiServerUrl}/VentasMolienda/obtenerDetallePadre?CONTRATO=${contrato}`);
    }
    public realizarDuplicado(CONTRATO_MOLIENDA:string,USUARIO:string): Observable<string>{
        return this.http.get<string>(`${this.apiServerUrl}/VentasMolienda/realizarDuplicado?CONTRATO_MOLIENDA=${CONTRATO_MOLIENDA}&USUARIO=${USUARIO}`);
    }
    public cantidadFacturasDespachadas(CONTRATO:string): Observable<number>{
        return this.http.get<number>(`${this.apiServerUrl}/VentasMolienda/cantidadFacturasDespachadas?CONTRATO=${CONTRATO}`);
    }
    public cancelarContrato(contrato: number,incoterm: boolean,usuario: string): Observable<boolean>{
        return this.http.get<boolean>(`${this.apiServerUrl}/VentasMolienda/cancelarContrato?contrato=${contrato}&incoterm=${incoterm}&usuario=${usuario}`);
    }
    public revertirSplit(Contrato_Padre: number,Contrato_Hijo: number): Observable<boolean>{
        return this.http.get<boolean>(`${this.apiServerUrl}/VentasMolienda/revertirSplit?Contrato_Padre=${Contrato_Padre}&Contrato_Hijo=${Contrato_Hijo}`);
    }
    public FlgReversion(cod_padre:string,cod_hijo:string): Observable<number>{
        return this.http.get<number>(`${this.apiServerUrl}/VentasMolienda/FlgReversion?cod_padre=${cod_padre}&cod_hijo=${cod_hijo}`);
    }
    public listarGrupoRT(Contrato:number): Observable<listaGrupoRT[]>{
        return this.http.get<listaGrupoRT[]>(`${this.apiServerUrl}/VentasMolienda/listarGrupoRT?Contrato=${Contrato}`);
    }
    public mostrarAvanceSAP(Contrato:number): Observable<listaAvanceSAP[]>{
        return this.http.get<listaAvanceSAP[]>(`${this.apiServerUrl}/VentasMolienda/mostrarAvanceSAP?Contrato=${Contrato}`);
    }
    public cerrarContrato_RT(Contrato:number): Observable<number>{
        return this.http.get<number>(`${this.apiServerUrl}/VentasMolienda/cerrarContrato_RT?Contrato=${Contrato}`);
    }

    public getEstadoPortafolioXSociedad(sociedad:number): Observable<ClosingControl[]>{
        return this.http.get<ClosingControl[]>(`${this.apiServerUrl}/VentasMolienda/estadoPortafolioXSociedad?sociedad=${sociedad}`);
    }
    public realizarCierreMolienda(listaCierre: ControlCierresVentasMolienda[]){
        return this.http.post<string>(`${this.apiServerUrl}/VentasMolienda/realizarCierreMolienda`,listaCierre);
    }
    public deshacerCierrePortafolioMolienda(listaCierre: ControlCierresVentasMolienda[]){
        return this.http.post<string>(`${this.apiServerUrl}/VentasMolienda/deshacerCierrePortafolioMolienda`,listaCierre);
    }
    public eliminarFlat(Usuario: string, Cod_Flat: number,Cliente: string, ContratoVenta: string, Underlying: number): Observable<any>{
        return this.http.get<any>(`${this.apiServerUrl}/VentasMolienda/eliminarFlat?Usuario=${Usuario}&Cod_Flat=${Cod_Flat}&Cliente=${Cliente}&ContratoVenta=${ContratoVenta}&Underlying=${Underlying}`);
    }
    public eliminarFuturo(Usuario: string, Cod_Futuro: number, Cliente: string): Observable<any>{
        return this.http.get<any>(`${this.apiServerUrl}/VentasMolienda/eliminarFuturo?Usuario=${Usuario}&Cod_Futuro=${Cod_Futuro}&Cliente=${Cliente}`);
    }
    public notificarEliminarFuturo(Underlying: number, Society: number, Cod_Futuro: number): Observable<any>{
        return this.http.get<any>(`${this.apiServerUrl}/VentasMolienda/notificarEliminarFuturo?Underlying=${Underlying}&Society=${Society}&Cod_Futuro=${Cod_Futuro}`);
    }
    public eliminarBase(Usuario: string, Cod_Base: number,Cliente: string, ContratoVenta: string, Underlying: number): Observable<any>{
        return this.http.get<any>(`${this.apiServerUrl}/VentasMolienda/eliminarBase?Usuario=${Usuario}&Cod_Base=${Cod_Base}&Cliente=${Cliente}&ContratoVenta=${ContratoVenta}&Underlying=${Underlying}`);
    }
    public obtenerDatosCierreComercial(ContratoVenta:string): Observable<DatosCierreComercial>{
        return this.http.get<DatosCierreComercial>(`${this.apiServerUrl}/VentasMolienda/obtenerDatosCierreComercial?ContratoVenta=${ContratoVenta}`);
    }
    public obtenerCaracteristicasCierreComercial(contrato:string): Observable<string[][]>{
        return this.http.get<string[][]>(`${this.apiServerUrl}/VentasMolienda/obtenerCaracteristicasCierreComercial?ContratoVenta=${contrato}`);
    }
    public obtenerFlat(id:number): Observable<FlatForSale>{
        return this.http.get<FlatForSale>(`${this.apiServerUrl}/VentasMolienda/obtenerFlat?id=${id}`);
    }
    public obtenerFuturo(id:number): Observable<PriceForSale>{
        return this.http.get<PriceForSale>(`${this.apiServerUrl}/VentasMolienda/obtenerFuturo?id=${id}`);
    }
    public obtenerBase(id:number): Observable<BaseForSale>{
        return this.http.get<BaseForSale>(`${this.apiServerUrl}/VentasMolienda/obtenerBase?id=${id}`);
    }
    public obtenerConsultaHistorica(FACTURADO:string,DESDE:string,HASTA:string,CAMPANIA:string,SOCIEDAD:string): Observable<consultaHistorica[]>{
        return this.http.get<consultaHistorica[]>(`${this.apiServerUrl}/VentasMolienda/obtenerConsultaHistorica?FACTURADO=${FACTURADO}&DESDE=${DESDE}&HASTA=${HASTA}&CAMPANIA=${CAMPANIA}&SOCIEDAD=${SOCIEDAD}`);
    }
    public obtenerConsultaHistoricaEspecifico(codigosConsulta:string): Observable<consultaHistoricaEspecifica>{
        return this.http.get<consultaHistoricaEspecifica>(`${this.apiServerUrl}/VentasMolienda/obtenerConsultaHistoricaEspecifico?codigosConsulta=${codigosConsulta}`);
    }
    public modificarBaseForSale(baseForSale: BaseForSale){
        return this.http.post<string>(`${this.apiServerUrl}/VentasMolienda/modificarBaseForSale`,baseForSale);
    }
    public obtenerColumnasConsultaHistorica(Sociedad:number): Observable<number>{
        return this.http.get<number>(`${this.apiServerUrl}/VentasMolienda/obtenerColumnasConsultaHistorica?Sociedad=${Sociedad}`);
    }
    public reporteDelDia(sociedad: number): Observable<number>{
        return this.http.get<number>(`${this.apiServerUrl}/VentasMolienda/reporteDia?sociedad=${sociedad}`);
    }
    public guardarBarco(barco: Shipment){
        return this.http.post<Shipment>(`${this.apiServerUrl}/VentasMolienda/guardarBarco`,barco);
    }
    public obtenerDosificadas(contrato: number): Observable<objInitDosificada>{
        return this.http.get<objInitDosificada>(`${this.apiServerUrl}/VentasMolienda/consultarDosificadas?contrato=${contrato}`);
    }
    public buscarAvanceSAPDosed(CodigoDosificada: number): Observable<listaAvanceSAPDosed[]>{
        return this.http.get<listaAvanceSAPDosed[]>(`${this.apiServerUrl}/VentasMolienda/buscarAvanceSAPDosed?CodigoDosificada=${CodigoDosificada}`);
    }
    public cancelarOperacionDosificada(CodigoDosificada: number): Observable<boolean>{
        return this.http.get<boolean>(`${this.apiServerUrl}/VentasMolienda/cancelarOperacionDosificada?CodigoDosificada=${CodigoDosificada}`);
    }
    public buscarPedidosDosificadas(CodigoDosificada: number): Observable<listaPedidosDosificada[]>{
        return this.http.get<listaPedidosDosificada[]>(`${this.apiServerUrl}/VentasMolienda/buscarPedidosDosificadas?CodigoDosificada=${CodigoDosificada}`);
    }
    public DuplicarDosificada(CodigoDosificada: number): Observable<boolean>{
        return this.http.get<boolean>(`${this.apiServerUrl}/VentasMolienda/DuplicarDosificada?CodigoDosificada=${CodigoDosificada}`);
    }
    public RegresarDosificada(CodigoDosificada: number): Observable<boolean>{
        return this.http.get<boolean>(`${this.apiServerUrl}/VentasMolienda/RegresarDosificada?CodigoDosificada=${CodigoDosificada}`);
    }
    public guardarPedidoDosificada(order:Order): Observable<Order>{
        return this.http.post<Order>(`${this.apiServerUrl}/VentasMolienda/guardarPedidoDosificada`,order);
    }
    public cancelarPedidoDosificada(PedidoID:number): Observable<boolean>{
        return this.http.post<boolean>(`${this.apiServerUrl}/VentasMolienda/cancelarPedidoDosificada`,PedidoID);
    }
    public listarOrder(CodigoDosificada: number): Observable<Order[]>{
        return this.http.get<Order[]>(`${this.apiServerUrl}/VentasMolienda/listarOrder?CodigoDosificada=${CodigoDosificada}`);
    }
    public obtenerObjetosIngresarFactura(): Observable<objInitIngresarFactura>{
        return this.http.get<objInitIngresarFactura>(`${this.apiServerUrl}/VentasMolienda/obtenerObjetosIngresarFactura`);
    }
    public ejecutarAvanceSCL(): Observable<boolean>{
        return this.http.get<boolean>(`${this.apiServerUrl}/VentasMolienda/ejecutarAvanceSCL`);
    }
    public ingresarFactura(factura:objIngresarFactura): Observable<number>{
        return this.http.post<number>(`${this.apiServerUrl}/VentasMolienda/ingresarFactura`,factura);
    }
    public guardarModificacionFactura(factura:objIngresarFactura): Observable<number>{
        return this.http.post<number>(`${this.apiServerUrl}/VentasMolienda/guardarModificacionFactura`,factura);
    }
    public obtenerDatosModificarFactura(codigoFactura: number): Observable<objIngresarFactura>{
        return this.http.get<objIngresarFactura>(`${this.apiServerUrl}/VentasMolienda/obtenerDatosModificarFactura?codigoFactura=${codigoFactura}`);
    }
    public facturarContrato(contratoVenta:number): Observable<boolean>{
        return this.http.post<boolean>(`${this.apiServerUrl}/VentasMolienda/facturarContrato`,contratoVenta);
    }
    public obtenerdatosFacturas(contratoVenta: number): Observable<datosFacturas>{
        return this.http.get<datosFacturas>(`${this.apiServerUrl}/VentasMolienda/obtenerdatosFacturas?contratoVenta=${contratoVenta}`);
    }
    public pasaraFacturadaDosedMasiva(listaFacturas:number[]): Observable<boolean>{
        return this.http.post<boolean>(`${this.apiServerUrl}/VentasMolienda/pasaraFacturadaDosedMasiva`,listaFacturas);
    }
    public consultaHistoricaFacturas(CLIENTE: string,PRODUCTO: string,DESTINO: string,CONTRATO_VENTA: string,PLANTA: string,DESDE: number,HASTA: number): Observable<consultaHistoricaDosificada[]>{
        return this.http.get<consultaHistoricaDosificada[]>(`${this.apiServerUrl}/VentasMolienda/consultaHistoricaFacturas?CLIENTE=${CLIENTE}&PRODUCTO=${PRODUCTO}&DESTINO=${DESTINO}&CONTRATO_VENTA=${CONTRATO_VENTA}&PLANTA=${PLANTA}&DESDE=${DESDE}&HASTA=${HASTA}`);
    }
    public obtenerObjetosConsultaHistoricaFactura(): Observable<objInitConsultaHistoricaFactura>{
        return this.http.get<objInitConsultaHistoricaFactura>(`${this.apiServerUrl}/VentasMolienda/obtenerObjetosConsultaHistoricaFactura`);
    }
    public guardarEmpresaTransporte(truck:Truck): Observable<Truck>{
        return this.http.post<Truck>(`${this.apiServerUrl}/VentasMolienda/guardarEmpresaTransporte`,truck);
    }
    public validarFactura(DosingCode: number,ID: number,accion: number): Observable<string[]>{
        return this.http.get<string[]>(`${this.apiServerUrl}/VentasMolienda/validarFactura?DosingCode=${DosingCode}&ID=${ID}&accion=${accion}`);
    }
    public guardarIngresoFactura(ingresaFactura : IngresaFactura) {
        return this.http.post<IngresaFactura>(`${this.apiServerUrl}/VentasMolienda/guardarIngresoFactura`, ingresaFactura);
    }
    public getSociedades_cost(): Observable<tipoSociedad[]>{
        return this.http.get<tipoSociedad[]>(`${this.apiServerUrl}/VentasMolienda/sociedadcostplus`);
    }
    public getproductos_cost(sociedad:number): Observable<Underlying[]>{
        return this.http.get<Underlying[]>(`${this.apiServerUrl}/VentasMolienda/productos_costplus?sociedad=${sociedad}`);
    }
    public getcliente_cost(): Observable<tipoCliente[]>{
        return this.http.get<tipoCliente[]>(`${this.apiServerUrl}/VentasMolienda/comboCliente`);
    }
    public getunderlying_cost(): Observable<Underlying[]>{
        return this.http.get<Underlying[]>(`${this.apiServerUrl}/VentasMolienda/comboUnderlying`);
    }
    public registrar_Rel_Soc_Under(datorelacion:tipoRelacion_Soc_Und){
                return this.http.post<tipoRelacion_Soc_Und>(`${this.apiServerUrl}/VentasMolienda/guardarrelacion`,datorelacion) } 

    public eliminar_Rel_Soc_Under(sociedad: number,underlying: number): Observable<boolean>{
                    return this.http.get<boolean>(`${this.apiServerUrl}/VentasMolienda/eliminarrelacion?sociedad=${sociedad}&underlying=${underlying}`);
                }
    public getPuerto_cost(): Observable<cargaCombo[]>{
        return this.http.get<cargaCombo[]>(`${this.apiServerUrl}/VentasMolienda/comboPuerto`);
    }
    public eliminar_Rel_Soc_Puerto_Origen(sociedad: number,puerto: number): Observable<boolean>{
        return this.http.get<boolean>(`${this.apiServerUrl}/VentasMolienda/eliminarrelacion_puerto?sociedad=${sociedad}&puerto=${puerto}`);
    }
    public regis_Soc_Puerto_Origen(datorelacion:tipoRelacion_Soc_Puertoorigen){
        return this.http.post<tipoRelacion_Soc_Puertoorigen>(`${this.apiServerUrl}/VentasMolienda/guardarRel_Puerto`,datorelacion) } 

    public eliminar_Rel_Soc_Puerto_Destino(sociedad: number,puerto: number): Observable<boolean>{
        return this.http.get<boolean>(`${this.apiServerUrl}/VentasMolienda/eliminarrelacion_puerto_destino?sociedad=${sociedad}&puerto=${puerto}`);
    }
    public regis_Soc_Puerto_Destino(datorelacion:tipoRelacion_Soc_PuertoDestino){
        return this.http.post<tipoRelacion_Soc_PuertoDestino>(`${this.apiServerUrl}/VentasMolienda/guardarRel_Puerto_destino`,datorelacion) } 
    
}