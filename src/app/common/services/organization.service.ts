import {Injectable} from '@angular/core';
import {RestService} from "./rest.service";
import {Observable} from "rxjs";
import {OrganizationResponse} from "../models/resonse/organization/organization-response";
import {catchSomethingWrong} from "../utils/functions";
import {OrganizationRequest} from "../models/request/user/organization-request";

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  constructor(
    private restService: RestService,
  ) {
  }

  getMyOrganization(): Observable<OrganizationResponse> {
    return this.restService.get<OrganizationResponse>(`/organizations/myself`)
      .pipe(catchSomethingWrong());
  }

  updateOrganization(formData: any): Observable<OrganizationResponse> {
    const body: OrganizationRequest = {
      name: formData.name
    };

    return this.restService.put<OrganizationResponse>(`/organizations/myself`, body)
      .pipe(catchSomethingWrong());
  }
}
