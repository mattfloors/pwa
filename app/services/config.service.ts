import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Config } from "../models/config.model";

@Injectable({
  providedIn: 'root'
})

export class ConfigService {
  public config?: Config;

  constructor(private http: HttpClient) {}

  private getConfigFileName(): string {
    if(environment.production) {
      return `config.prod`
    }
    if(environment.staging) {
      return `config.stag`
    }
    return `config`
  }

  loadConfig() {
    return this.http
      .get<Config>(`./config/${this.getConfigFileName()}.json`)
      .toPromise()
      .then(config => {
        this.config = config;
      });
  }
}