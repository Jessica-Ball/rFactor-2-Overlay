import { Injectable } from '@angular/core';
import { Jsonp } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LiveService {

    private DATA_REFRESH_RATE = 2500;
    private BASE_URL = 'http://176.9.64.2:8000/live/get_full_server_data_jsonp?callback=JSONP_CALLBACK';

    private _vehicles: Array<any> = [];
    private _sectorFlags: Array<number> = [11, 11, 11]; // 11 = green, 1 = yellow

    constructor(
        private jsonp: Jsonp
    ) {}

    start(): void {
        setInterval(() => {
            this._fetch();
        }, this.DATA_REFRESH_RATE);
    }

    getVehicleByName(driverName: string): any {
        return this._vehicles.find(vehicle => vehicle.mDriverName === driverName);
    }

    _fetch(): void {
        this._dataObservable().subscribe(data => {
            if (data.server_names_list.length === 0) {
                return;
            }

            const serverName = data.server_names_list[0];
            const serverData = data.server_data[serverName];

            this._vehicles = serverData.mVehicles;
            this._sectorFlags = serverData.mScoringInfo.mSectorFlag;
        });
    }

    _dataObservable(): Observable<any> {
        return this.jsonp
            .request(`${this.BASE_URL}`)
            .map(response => response.json())
            .catch(this._handleError);
    }

  _handleError(error: any): any {
    console.log(error);
  }
}
