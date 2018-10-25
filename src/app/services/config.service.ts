import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

@Injectable()
export class ConfigService {

    private _config: Object = null;

    constructor(private http: Http) {}

    public get(key: string): any {
        if (!this._config) {
            throw new Error('Cannot fetch config parameter when no config is loaded');
        }

        return this._config[key];
    }

    public load(): Promise<void> {
        return this.http.get(environment.settings_url).pipe(
            map(res => res.json())
        ).toPromise().then(response => {
            this._config = response;
            console.log(this._config);
        });
    }
}
