import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface CommodityInfo {
    ticker: string;
    basePrice: number;
    currentPrice: number;
    volatility: number; // Porcentaje de variación máxima
  }
  
@Injectable({
  providedIn: 'root'
})
export class simulacionPreciosService {
    private commodities: CommodityInfo[] = [
        { ticker: 'SMK4', basePrice: 363.6, currentPrice: 363.6, volatility: 3 },
        { ticker: 'BON4', basePrice: 47.55, currentPrice: 47.55, volatility: 5 },
        { ticker: 'BOQ4', basePrice: 40.05, currentPrice: 40.05, volatility: 5 },
        { ticker: 'W U4', basePrice: 571.25, currentPrice: 571.25, volatility: 4 },
        { ticker: 'W K4', basePrice: 657, currentPrice: 657, volatility: 4 },
        { ticker: 'BOK4', basePrice: 42.68, currentPrice: 42.68, volatility: 5 },
        { ticker: 'SMH4', basePrice: 333.2, currentPrice: 333.2, volatility: 3 },
        { ticker: 'MWK4', basePrice: 729.25, currentPrice: 729.25, volatility: 4 },
        { ticker: 'SMN4', basePrice: 368.5, currentPrice: 368.5, volatility: 3 },
        { ticker: 'KWK4', basePrice: 724, currentPrice: 724, volatility: 4 },
        { ticker: 'W N4', basePrice: 538, currentPrice: 538, volatility: 4 },
        { ticker: 'SMZ4', basePrice: 284.1, currentPrice: 284.1, volatility: 3 },
        { ticker: 'BOF5', basePrice: 45.73, currentPrice: 45.73, volatility: 5 },
        { ticker: 'BOH5', basePrice: 45.01, currentPrice: 45.01, volatility: 5 },
        { ticker: 'BOK5', basePrice: 45.36, currentPrice: 45.36, volatility: 5 },
        { ticker: 'BON5', basePrice: 45.53, currentPrice: 45.53, volatility: 5 },
        { ticker: 'BOQ5', basePrice: 45.26, currentPrice: 45.26, volatility: 5 },
        { ticker: 'BOU4', basePrice: 40.69, currentPrice: 40.69, volatility: 5 },
        { ticker: 'BOU5', basePrice: 44.97, currentPrice: 44.97, volatility: 5 },
        { ticker: 'BOV4', basePrice: 42.16, currentPrice: 42.16, volatility: 5 },
        { ticker: 'BOV5', basePrice: 44.67, currentPrice: 44.67, volatility: 5 },
        { ticker: 'BOZ4', basePrice: 42.28, currentPrice: 42.28, volatility: 5 },
        { ticker: 'BOZ5', basePrice: 44.72, currentPrice: 44.72, volatility: 5 },
        { ticker: 'SMF5', basePrice: 298.4, currentPrice: 298.4, volatility: 3 },
        { ticker: 'SMH5', basePrice: 314.8, currentPrice: 314.8, volatility: 3 },
        { ticker: 'SMK5', basePrice: 322.4, currentPrice: 322.4, volatility: 3 },
        { ticker: 'SMN5', basePrice: 328.8, currentPrice: 328.8, volatility: 3 },
        { ticker: 'SMQ4', basePrice: 320.6, currentPrice: 320.6, volatility: 3 },
        { ticker: 'SMQ5', basePrice: 329.5, currentPrice: 329.5, volatility: 3 },
        { ticker: 'SMU4', basePrice: 315.4, currentPrice: 315.4, volatility: 3 },
        { ticker: 'SMU5', basePrice: 329.4, currentPrice: 329.4, volatility: 3 },
        { ticker: 'SMV4', basePrice: 316.5, currentPrice: 316.5, volatility: 3 },
        { ticker: 'SMV5', basePrice: 328.4, currentPrice: 328.4, volatility: 3 },
        { ticker: 'SMZ5', basePrice: 330.7, currentPrice: 330.7, volatility: 3 },
        { ticker: 'W H5', basePrice: 554.5, currentPrice: 554.5, volatility: 4 },
        { ticker: 'W K5', basePrice: 568, currentPrice: 568, volatility: 4 },
        { ticker: 'W N5', basePrice: 578.5, currentPrice: 578.5, volatility: 4 },
        { ticker: 'W U5', basePrice: 592, currentPrice: 592, volatility: 4 },
        { ticker: 'W Z4', basePrice: 526.5, currentPrice: 526.5, volatility: 4 },
        { ticker: 'W Z5', basePrice: 610.75, currentPrice: 610.75, volatility: 4 },
        { ticker: 'MWN4', basePrice: 621, currentPrice: 621, volatility: 4 },
        { ticker: 'MWU4', basePrice: 608, currentPrice: 608, volatility: 4 },
        { ticker: 'MWZ4', basePrice: 582.25, currentPrice: 582.25, volatility: 4 },
        { ticker: 'MWH5', basePrice: 604.5, currentPrice: 604.5, volatility: 4 },
        { ticker: 'MWK5', basePrice: 615, currentPrice: 615, volatility: 4 },
        { ticker: 'MWN5', basePrice: 624.75, currentPrice: 624.75, volatility: 4 },
        { ticker: 'MWU5', basePrice: 634.75, currentPrice: 634.75, volatility: 4 },
        { ticker: 'MWZ5', basePrice: 651, currentPrice: 651, volatility: 4 },
        { ticker: 'KWN4', basePrice: 604, currentPrice: 604, volatility: 4 },
        { ticker: 'KWU4', basePrice: 578.5, currentPrice: 578.5, volatility: 4 },
        { ticker: 'KWZ4', basePrice: 538.75, currentPrice: 538.75, volatility: 4 },
        { ticker: 'KWH5', basePrice: 570.75, currentPrice: 570.75, volatility: 4 },
        { ticker: 'KWK5', basePrice: 580.5, currentPrice: 580.5, volatility: 4 },
        { ticker: 'KWN5', basePrice: 589.5, currentPrice: 589.5, volatility: 4 },
        { ticker: 'KWU5', basePrice: 601.75, currentPrice: 601.75, volatility: 4 },
        { ticker: 'KWZ5', basePrice: 618, currentPrice: 618, volatility: 4 },
        { ticker: 'S F5', basePrice: 1043, currentPrice: 1043, volatility: 2 },
        { ticker: 'S H5', basePrice: 1064, currentPrice: 1064, volatility: 2 },
        { ticker: 'S K5', basePrice: 1076.5, currentPrice: 1076.5, volatility: 2 },
        { ticker: 'S N5', basePrice: 1087, currentPrice: 1087, volatility: 2 },
        { ticker: 'S Q5', basePrice: 1078.75, currentPrice: 1078.75, volatility: 2 },
        { ticker: 'S U4', basePrice: 986.75, currentPrice: 986.75, volatility: 2 },
        { ticker: 'S U5', basePrice: 1053.75, currentPrice: 1053.75, volatility: 2 },
        { ticker: 'S X4', basePrice: 985.75, currentPrice: 985.75, volatility: 2 },
        { ticker: 'S X5', basePrice: 1052.5, currentPrice: 1052.5, volatility: 2 }
      ];
    
      constructor() { }

      /**
       * Simula un stream de mensajes de WebSocket con precios que fluctúan
       * alrededor de valores base para cada commodity
       */
      getMessages(): Observable<string> {
        return new Observable<string>(observer => {
          // Enviar un mensaje inicial inmediatamente
          this.sendRandomMessage(observer);
          
          // Configurar intervalo para enviar mensajes periódicamente
          const interval = setInterval(() => {
            this.sendRandomMessage(observer);
          }, 150); // Envía un nuevo precio cada 1.5 segundos
          
          // Limpieza cuando se cancele la suscripción
          return () => {
            clearInterval(interval);
          };
        });
      }
      
      /**
       * Genera y envía un mensaje con precio fluctuante basado en el precio base
       */
      private sendRandomMessage(observer: any): void {
        // Seleccionar un commodity aleatorio
        const randomIndex = Math.floor(Math.random() * this.commodities.length);
        const commodity = this.commodities[randomIndex];
        
        // Asignar volatilidad basada en el tipo de commodity
        let volatility = commodity.volatility;
        
        // Calcular la fluctuación de precio (entre -volatility% y +volatility%)
        const fluctuationPercentage = (Math.random() * 2 - 1) * volatility;
        const fluctuationAmount = commodity.basePrice * (fluctuationPercentage / 100);
        
        // Calcular el nuevo precio
        const newPrice = parseFloat((commodity.currentPrice + fluctuationAmount).toFixed(2));
        
        // Limitar las fluctuaciones extremas (opcional)
        // Máximo 15% de desviación del precio base para mantener estabilidad
        const maxDeviation = commodity.basePrice * 0.15;
        const minAllowedPrice = commodity.basePrice - maxDeviation;
        const maxAllowedPrice = commodity.basePrice + maxDeviation;
        
        // Aplicar límites
        let finalPrice = newPrice;
        if (newPrice < minAllowedPrice) finalPrice = minAllowedPrice;
        if (newPrice > maxAllowedPrice) finalPrice = maxAllowedPrice;
        
        // Actualizar el precio actual en nuestro registro
        commodity.currentPrice = finalPrice;
        
        // Crear un objeto JSON completo
        const data = {
          ticker: commodity.ticker,
          precio: finalPrice
        };
        
        // Convertir el objeto a cadena JSON y enviarlo
        const jsonString = JSON.stringify(data);
        
        // Extraer el contenido entre llaves para que sea compatible con
        // el código que añade las llaves message = "{" + message + "}"
        const message = jsonString.substring(1, jsonString.length - 1);
        
        // Enviar el mensaje
        observer.next(message);
      }
      
      /**
       * Método para obtener la lista de commodities (útil para inicializar portafolio)
       */
      getCommodities(): CommodityInfo[] {
        return [...this.commodities]; // Devuelve una copia para evitar modificaciones externas
      }
    
      /**
       * Asigna volatilidad basada en el prefijo del ticker
       */
      private getVolatilityByTickerType(ticker: string): number {
        if (ticker.startsWith('BO')) return 5; // Más volátil
        if (ticker.startsWith('SM')) return 3; // Volatilidad media
        if (ticker.startsWith('S ')) return 2; // Menos volátil
        return 4; // Volatilidad predeterminada
      }
    }
    