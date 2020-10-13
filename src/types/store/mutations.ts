import { Signal } from '../signals';

export type LoadingMutationType = ({ loading, message }: { loading: boolean; message?: string }) => void;
export type SignalsMutationType = ({ items }: { items: Signal[] }) => void;
