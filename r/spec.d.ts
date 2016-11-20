/* tslint:disable */

import {ReporterConsumer} from "../index.d";

export interface SpecOptions {
    write?(line: string): void | PromiseLike<void>;
    reset?(): void | PromiseLike<void>;
    color?: boolean;
}

export default function spec(options?: SpecOptions): ReporterConsumer;
