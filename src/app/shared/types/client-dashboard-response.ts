import { LoadClientDataDTO } from "../../models/dtos/load-client-data.interface";
import { ApiResponse } from "../api/api-response";

export type ClientDashboardResponse = ApiResponse<LoadClientDataDTO>;
