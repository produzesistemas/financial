import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class FileHelper {
    constructor(private http: HttpClient) {
    }

    Download(data: any, type: string, fileName: string) {
        const blob: Blob = new Blob([data], { type: type });
        const objectUrl: string = URL.createObjectURL(blob);
        const a: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;

        a.href = objectUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        URL.revokeObjectURL(objectUrl);
    }

    DownloadFile(fileName: string): void {
        this.http.post(`${environment.urlApi}file/download/`, { fileName }, { observe: 'response', responseType: 'blob' })
        .subscribe(response => {
                if (response.body === null)
                return;
            const objectUrl: string = URL.createObjectURL(response.body);
            const a: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;

            a.href = objectUrl;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();

            document.body.removeChild(a);
            URL.revokeObjectURL(objectUrl);
        });
    }
}