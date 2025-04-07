import { cargaCombo } from "../cargaCombo";
import { ClosingPrice } from "../ClosingPrice";

export class objVenderFuturo{
    public nuevoClosingPrice: ClosingPrice;
    public comboFuturosCM: cargaCombo[];

    public precioCosto: number;
    public precioVenta: number;
    public pnlVenta: number;
    public fisicoID: number;
    public underlyingID: number;
    public comentario: string;
    
    constructor(){}
}