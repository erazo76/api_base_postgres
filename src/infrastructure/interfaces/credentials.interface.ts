import { UserPayload } from "./current-user.interface";

export interface Credentials {
  accessToken: string;
  payload: UserPayload;
}
