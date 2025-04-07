export class SalesContract{
    
    public t218_ID: string; //codigo
    public t218_Date: string; //fecha
    public t218_RegisteredBy: string;
    public t218_SellBuy: string; //compraVenta
    public t218_GrindingCustomer: string; //cliente
    public t218_GrindingProduct: string; //producto
    public t218_StartDate: string; //fechaInicio
    public t218_EndDate: string; //fechaFin
    public t218_Contract: string = ""; //contrato
    public t218_Campaign: string; //campania
    public t218_PortFrom: string; //puertoOrigen
    public t218_PortUp: string; //puertoDestino
    public t218_Incoterm: string; //incoterm
    public t218_ContractStatus: string = "1";
    public t218_Society: string;
    public t218_PriceType: string; //tipoPrecio
    public t218_Shipment: string; //barco
    public t218_MetricTons: number; //toneladametrica
    public t218_Tolerance: string; //tolerancia
    public t218_FinalPrice: number = 0;
    public t218_VolumeContract: string; //caks
    public t218_Commentary: string = ""; //comentarios
    public t218_Status: string = "1";
    public t218_ContractBySociety: string; //contratoSociedad
    public t218_ClientContract: string = ""; //contratoExterno
    public t218_Country: string; //origen
    public t218_Market: string ; //mercado
    public t218_WashOut: number=1;
    public t218_IDZona: string = ""; //zona
    
    constructor(){}

}