// import {AppState} from "react-native"
//
// import AppVersion from './AppVersion'
// import ErrorHandler from './ErrorHandler'
//
// import Config from "./Config"
// import DB from "./storage/DB"
// import Environment from "./Environment"
// import Event from "./Event"
// import Navigator from "./navigation/Navigator"
// import Request from "./Request"
// import Storage from "./storage/Storage"
// import Util from "./../Util"
//
// import TBComponent from "./components/Component"
//
// class App
// {
//     static StateChangeListener = undefined;
//
//     static DB = {};
//
//     static Navigation = [];
//
//     static Scoped = undefined;
//
//     constructor()
//     {
//         // this.native = Util.native('ToolboxApp');
//
//         // this.environment = Environment.boot(this);
//         // this.Version = AppVersion.forApp(this);
//
//         // this.errorHandler = ErrorHandler.boot(
//             // this.env(), this.errorReport
//         // );
//
//         this.loadState();
//     }
//
//     loadState()
//     {
//         this.state = AppState.currentState;
//
//         AppState.removeEventListener(
//             "change", App.StateChangeListener
//         );
//
//         App.StateChangeListener = nextState => {
//             this.onStateChange(nextState);
//         };
//
//         AppState.addEventListener(
//             "change",  App.StateChangeListener
//         );
//
//         return this;
//     }
//
//     isInForeground()
//     {
//         return this.state === 'active';
//     }
//
//     isInBackground()
//     {
//         return this.state === 'background';
//     }
//
//     isInactive()
//     {
//         return this.state === 'inactive';
//     }
//
//     onStateChange(nextState)
//     {
//         this.state = nextState;
//
//         /*
//         USER of this package should set an:
//          - onEnterForeground
//          - onEnterBackground
//          - onBecomeInactive
//
//          to track app events.  Set these vars in the TBConfig file.
//          */
//
//         let handler;
//         switch (nextState) {
//             case 'active': handler = 'onEnterForeground'; Request.Timeout = 10; break;
//             case 'background': handler = 'onEnterBackground'; Request.Timeout = 5; break;
//             case 'inactive': handler = 'onBecomeInactive'; break;
//         }
//
//         if (this[handler]) {
//             this[handler]();
//         }
//
//         // Event.fire(
//         //     'App@StateChange', nextState
//         // );
//     }
//
//     // track(event, options)
//     // {
//     //     ErrorHandler.shared().breadcrumb(
//     //         event, options
//     //     );
//     // }
//
//     errorReport(meta, error)
//     {
//         return meta;
//     }
//
//     // setUser(user)
//     // {
//     //     Event.fire('Auth@tracking', true);
//     //
//     //     ErrorHandler.shared().setUser(user);
//     // }
//
//     // clearUser()
//     // {
//     //     Event.fire('Auth@tracking', false);
//     //
//     //     ErrorHandler.shared().clearUser();
//     // }
//
//     // env()
//     // {
//     //     return this.environment.value();
//     // }
//
//     info(updated)
//     {
//         if (updated) {
//             this.Info = updated;
//         }
//
//         return this.Info;
//     }
//
//     // version()
//     // {
//     //     return this.Version.current();
//     // }
//
//     packageName()
//     {
//         return Config.get('App.package');
//     }
//
//     codePushStagingKey = () => {
//         return Config.get(`App.codePush.${TB.device().platform()}.staging`);
//     };
//
//     codePushProductionKey = () => {
//         return Config.get(`App.codePush.${TB.device().platform()}.production`);
//     };
//
//     codePushCustomkey = (env) => {
//         if (Config.get(`App.codePush.${env}`) !== undefined) {
//             return Config.get(`App.codePush.${TB.device().platform()}.${env}`);
//         } else {
//             return Config.get(`App.codePush.${TB.device().platform()}.staging`);
//         }
//     };
//
//     // storage(keyOrMap, defaultValue)
//     // {
//     //     if (Util.isString(keyOrMap)) {
//     //         return this.storageService.get(keyOrMap, defaultValue);
//     //     }
//     //     else if (!Util.isUndefined(keyOrMap)) {
//     //         let key = Util.head(
//     //             Util.keys(keyOrMap)
//     //         );
//     //
//     //         return this.storageService.put(key, keyOrMap[key]);
//     //     }
//     //
//     //     return this.storageService;
//     // }
//
//     async scaffold()
//     {
//         // return Navigator.shared().boot(
//         //     "App@Home"
//         // );
//     }
//
//     // static boot()
//     // {
//     //     return new Promise(async(resolve,reject) => {
//     //         let app = new this();
//     //
//     //         Config.boot();
//     //         Navigator.boot(app);
//     //         TBComponent.application = app;
//     //
//     //         app.storageService = await Storage.boot(app);
//     //
//     //         await DB.boot(app, this.DB);
//     //
//     //
//     //         await app.Version.checkChange();
//     //         await app.Version.checkForUpdate();
//     //
//     //         /*
//     //          * Developer Mode
//     //          */
//     //         await app.storage('DeveloperMode', false);
//     //
//     //         resolve(app);
//     //     });
//     // }
// }
//
// export default App;