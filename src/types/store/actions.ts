import { Credentials } from '../user-info';
import { QueryParams } from "@/modules/api";
import { Signal } from "../signals";
import { Paginated } from "../pagination";

export type LoginActionType = (credentials: Credentials) => Promise<void>;
export type LoadSignalActionType = (params: QueryParams) => Promise<Paginated<Signal>>;
