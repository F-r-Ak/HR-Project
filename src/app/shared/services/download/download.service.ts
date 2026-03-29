import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from '../../../core/services/config/config.service';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class DownloadService {
    private http = inject(HttpClient);
    private configService = inject(ConfigService);

    /**
     * Download a file from URL with proper authentication
     * @param filePath The file path from the API
     * @param fileName The desired filename for download
     */
    downloadFile(filePath: string, fileName?: string): void {
        const fullUrl = `${environment.HUB_URL}${filePath}`;

        // Extract filename if not provided
        if (!fileName) {
            fileName = filePath.split('/').pop() || 'download';
        }

        // Try direct download first (for public files)
        this.tryDirectDownload(fullUrl, fileName).catch(() => {
            // If direct download fails, try authenticated download
            this.downloadWithAuth(fullUrl, fileName!);
        });
    }

    /**
     * Try direct download (for public files)
     */
    private tryDirectDownload(url: string, fileName: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            link.style.display = 'none';
            link.target = '_blank';

            // Add error handling
            link.onerror = () => reject(new Error('Direct download failed'));
            link.onload = () => resolve();

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Resolve after a short delay if no error occurred
            setTimeout(() => resolve(), 100);
        });
    }

    /**
     * Download file with authentication headers
     */
    private downloadWithAuth(url: string, fileName: string): void {
        // Get the file as blob with authentication
        this.http.get(url, {
            responseType: 'blob',
            headers: this.getAuthHeaders()
        }).subscribe({
            next: (blob: Blob) => {
                this.downloadBlob(blob, fileName);
            },
            error: (error) => {
                console.error('Error downloading file:', error);
                // Fallback: try opening in new window
                window.open(url, '_blank');
            }
        });
    }

    /**
     * Download blob as file
     */
    private downloadBlob(blob: Blob, fileName: string): void {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up the URL object
        window.URL.revokeObjectURL(url);
    }

    /**
     * Get authentication headers (customize based on your auth system)
     */
    private getAuthHeaders(): HttpHeaders {
        let headers = new HttpHeaders();

        // Add authentication token if available
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (token) {
            headers = headers.set('Authorization', `Bearer ${token}`);
        }

        return headers;
    }

    /**
     * Download multiple files with delay between downloads
     */
    downloadMultipleFiles(files: Array<{path: string, name?: string}>, delayMs: number = 100): void {
        files.forEach((file, index) => {
            setTimeout(() => {
                this.downloadFile(file.path, file.name);
            }, index * delayMs);
        });
    }

    /**
     * Check if file exists before download
     */
    checkFileExists(filePath: string): Observable<boolean> {
        const fullUrl = `${environment.HUB_URL}${filePath}`;

        return new Observable(observer => {
            this.http.head(fullUrl, { headers: this.getAuthHeaders() }).subscribe({
                next: () => {
                    observer.next(true);
                    observer.complete();
                },
                error: () => {
                    observer.next(false);
                    observer.complete();
                }
            });
        });
    }
}
