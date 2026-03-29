import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { StorageService } from '../../../shared/services/storage/storage.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
    const storageService = inject(StorageService);

    const token = storageService.getToken();
    const language = storageService.getItem('currentLang');
    req = req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`,
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-store, must-revalidate',
            Pragma: 'no-cache',
            Expires: '0',
            'Accept-Language': `${language}`
        }
    });

    return next(req);
};
