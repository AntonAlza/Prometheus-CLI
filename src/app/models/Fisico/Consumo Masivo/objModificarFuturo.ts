import { ClosingPrice } from "../ClosingPrice";

export class ObjModificarFuturo{
    public closingPrice: ClosingPrice;
    public ticker: string;
    public currencyMeasure: number;
    public ventaEnlazada: boolean;
    public underlyingID: number;
    public precioFuturo: number;
    public comentario: string;

    constructor(){}
}