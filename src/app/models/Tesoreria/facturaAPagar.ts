export class FacturaAPagar{
    codigo_factura: string;
    subsidiaria: string;
    proveedor: string;
    fecha_registro: number;
    fecha_comprobante: number;
    fecha_vencimiento: number;
    moneda: string;
    nominal: number;
    monto_pagado: number;
    saldoDisponible: number;
    saldoPagar: number;
    montoCoberturado: number;
    flgFacturaSeleccionada: boolean;
    usuario_pago: string;
}