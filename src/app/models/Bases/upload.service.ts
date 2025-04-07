import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpRequest,
  HttpEvent,
  HttpEventType,
  HttpErrorResponse
} from "@angular/common/http";
import { map, tap, catchError } from "rxjs/operators";
import { Observable, throwError } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class UploadService {
  constructor(private readonly http: HttpClient) {}

  uploadFiles(fd) {
    const req = new HttpRequest(
      "POST",
      "https://cm3u7.sse.codesandbox.io/upload",
      fd,
      {
        reportProgress: true
      }
    );

    return this.http.request(req).pipe(
      map(event => this.getEventMessage(event)),
      tap(message => this.showMessages(message)),
      catchError(this.handleError())
    );
  }

  private getEventMessage(event: HttpEvent<any>) {
    switch (event.type) {
      case HttpEventType.Sent:
        return {
          status: 0,
          message: "Uploading files"
        };

      case HttpEventType.UploadProgress:
        const percentDone =Math.round(100 * (event.loaded || 1) / (event.total || 1))
        return {
          status: 1,
          message: "Progress",
          percentDone
        };

      case HttpEventType.Response:
        return {
          status: 2,
          message: "Files uploaded"
        };

      default:
        return {
          status: 3
        };
    }
  }

  private showMessages(message) {
    console.log(message);
  }

  private handleError() {
    return (error: HttpErrorResponse) => {
      if (error.error instanceof ErrorEvent) {
        console.error("Frontend returned error:", error.error.message);
      } else {
        console.error(
          `Backend returned code ${error.status}, ` + `body was: ${error.error}`
        );
      }
      return throwError("Something bad happened; please try again later.");
    };
  }
}
