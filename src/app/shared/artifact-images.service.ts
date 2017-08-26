import {Injectable} from "@angular/core";
import {Headers, Http, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {Location} from "./location.model";
import {ReplaySubject} from "rxjs/ReplaySubject";

@Injectable()
export class ArtifactImagesService {

  private http: Http;
  private BASE_URL: string = "http://localhost:8080";

  constructor(http: Http) {
    this.http = http;
  }

  private getResponse(relativePath: string): Observable<Response> {
    return this.http.get(this.BASE_URL + relativePath);
  }

  public getImage(id: number): Observable<string> {
    return this.getResponse("/getArtifactImage?id="+id)
      .map((response: Response) => response.text());
  }

  public iconDataSubjectMap = new Map<number, Observable<string>>();
  // data$: Observable<string> = this.iconDataSubject.asObservable();

  public fetch(id: number) {
    let iconDataSubject = new ReplaySubject<string>();
    this.iconDataSubjectMap.set(id, iconDataSubject.asObservable());
    return this.getResponse("/getArtifactImageIcon?id="+id)
      .map((response: Response) => response.text()).subscribe(iconText => iconDataSubject.next(iconText));
  }
  public getIconData(id:number):Observable<string> {
    return this.iconDataSubjectMap.get(id);
  }
  // public getImageIcon(id: number): Observable<string> {
  //   return this.getResponse("/getArtifactImageIcon?id="+id)
  //     .map((response: Response) => response.text());
  // }

  public getAll(): Observable<Location[]> {
    return this.getResponse("/artifacts")
      .map(response => response.json().map(toArtifact));
  }

  private getHeaders() {
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    return headers;
  }
}

function toArtifact(r: any): Location {
  return new Location(r.id, r.title, r.longitude, r.latitude);
}
