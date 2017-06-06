import defaultT, * as Thallium from "./index"
import * as Assert from "./assert";
import * as Reporters from "./r";

declare var assert: typeof Assert
declare namespace assert {
    type AssertionError = Assert.AssertionError
    type Key = Assert.Key
    type MapLike<T, U> = Assert.MapLike<T, U>
    type Matcher = Assert.Matcher
    type ObjectMap = Assert.ObjectMap
}

declare var t: typeof defaultT & {
    r: typeof Reporters;

    settings: {
        windowWidth: number;
        newline: string;
        symbols: {
            Pass: string;
            Fail: string;
            Dot: string;
            DotFail: string;
        };
        defaultOpts: {
            print(line: string): any | Promise<any>;
            write(line: string): any | Promise<any>;
            reset(): any | Promise<any>;
        };
        colorSupport: {
            supported: boolean;
            forced: boolean;
        };
    };
};

declare namespace t {
    type Location = Thallium.Location;
    type ReportType = Thallium.ReportType;
    type Report = Thallium.Report;
    type HookStage = Thallium.HookStage;
    type HookError<S extends HookStage> = Thallium.HookError<S>;
    type StartReport = Thallium.StartReport;
    type EnterReport = Thallium.EnterReport;
    type LeaveReport = Thallium.LeaveReport;
    type PassReport = Thallium.PassReport;
    type FailReport = Thallium.FailReport;
    type SkipReport = Thallium.SkipReport;
    type EndReport = Thallium.EndReport;
    type ErrorReport = Thallium.ErrorReport;
    type HookReport = Thallium.HookReport;
    type BeforeAllReport = Thallium.BeforeAllReport;
    type BeforeEachReport = Thallium.BeforeEachReport;
    type AfterEachReport = Thallium.AfterEachReport;
    type AfterAllReport = Thallium.AfterAllReport;
    type Reporter<T> = Thallium.Reporter<T>;
    type ArgReporter<T> = Thallium.ArgReporter<T>;
    type VoidReporter = Thallium.VoidReporter;
    type ReporterConsumer = Thallium.ReporterConsumer;
    type Plugin<T, R> = Thallium.Plugin<T, R>;
    type ArgPlugin<T, R> = Thallium.ArgPlugin<T, R>;
    type VoidPlugin<R> = Thallium.VoidPlugin<R>;
    type Callback = Thallium.Callback;
    type Reflect = Thallium.Reflect;
    type ReflectRoot = Thallium.ReflectRoot;
    type ReflectChild = Thallium.ReflectChild;

    namespace r {
        type DotOptions = Reporters.DotOptions;
        type SpecOptions = Reporters.SpecOptions;
        type TapOptions = Reporters.TapOptions;
    }
}
