export interface Config {
  ApiResources: IApiResources[]
}
export interface IAuthResource {
  AuthEndpoint: string;
  CliendId: string;
  Scopes: string;
}
 export interface IApiResources {
  ResourceName: string;
  ResourceEndpoint: string;
}