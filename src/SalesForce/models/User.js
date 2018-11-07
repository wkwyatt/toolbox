import {Alert} from "react-native";

import Model from '../../Model';
import Salesforce from "../SalesForce";
// import Event from './Event'

// import PostEventsRequest from "@requests/PostEventsRequest";

export default class User extends Model
{
    static schemaName = 'User';

    static useTimestamps = false;

    static current()
    {
        return User.first();
    }

    // confirmEndTracking()
    // {
    //     return new Promise((resolve,reject) => {
    //         Alert.alert(
    //             'Live Location Updates Still Enabled',
    //             `Do you want to stop all location updates?`, [
    //                 {text: 'Yes, Continue', onPress: () => {
    //                         resolve(true);
    //                     }},
    //                 {text: 'Cancel', onPress: () => resolve(false)},
    //             ]);
    //     });
    // }
    //
    // async endTracking(force = false)
    // {
    //     if (!force && this.isAvailable) {
    //         let didConfirm = await this.confirmEndTracking();
    //
    //         if (!didConfirm) {
    //             return false;
    //         }
    //     }
    //
    //     await this.app().setLoading(true, "Please wait...");
    //
    //     await this.app().tracker.stop();
    //
    //     this.app().tracker.stopTryingToSyncWithRemote();
    //
    //     let didSync = true;
    //     await TB.app().tracker.syncWithRemote().catch(e => {
    //         didSync = false;
    //     });
    //
    //     if (!force && !didSync) {
    //         await this.showNetworkError();
    //         return false;
    //     }
    //     else {
    //         await Event.truncate();
    //     }
    //
    //     return true;
    // }

    static async login(props)
    {
        delete props.id;
        console.log('Model/User @ login -> props', props);
        console.log('Model/User @ login -> Salesforce', Salesforce);
        console.log('Model/User @ login -> Salesforce.auth', Salesforce.auth);
        // props.organization = await TB.app().salesforce.auth.organization().catch(console.error);

        if (!props.organization) {
            props.organization = {};
        }

        let user = await User.create(props);
        // await User.cacheCurrent();

        // TB.app().salesforce.auth.user(user);

        // TB.event('Auth@login', user);

        // TB.app().errorHandler.updateReport();

        return user;
    }

    // async logout()
    // {
    //     await TB.app().salesforce.auth.logout().catch(console.error);
    //
    //     await TB.app().storage().forget('CachedUser').catch(console.error);
    //
    //     TB.nav().resetToScene('Salesforce@Login', () => TB.app().setLoading(false));
    // }
    //
    // static async handleLogout()
    // {
    //     await User.truncate().catch(console.error);
    //     await User.cacheCurrent().catch(console.error);
    //
    //     TB.event('Auth@logout');
    //
    //     TB.app().errorHandler.updateReport();
    // }
    //
    // async showNetworkError()
    // {
    //     await TB.app().setLoading(false);
    //
    //     Alert.alert(
    //         'Oops..',
    //         `Connectivity error. Please try again.`, [
    //             {text: 'OK'},
    //         ]);
    // }
    //
    // static cached()
    // {
    //     if (!this.application || !this.application.storage()) {
    //         return;
    //     }
    //
    //     return this.application.storage().cached("CachedUser");
    // }
    //
    //
    // static async cache(props)
    // {
    //     let updated;
    //     if (props) {
    //         updated = {...props};
    //     }
    //
    //     return this.application.storage({"CachedUser": updated});
    // }
    //
    //
    // static bindToErrorReport(report)
    // {
    //     let currentUser = User.cached();
    //
    //     if (!currentUser) {
    //         return report;
    //     }
    //
    //     let userDetails = {
    //         salesforce_id : currentUser.userId,
    //         name          : currentUser.name,
    //         username      : currentUser.username,
    //         email         : currentUser.email,
    //         instance_url  : currentUser.instanceUrl,
    //     };
    //
    //     report.user = report.user ? report.user : {};
    //     report.user = {...report.user, ...userDetails};
    //
    //     return report;
    // }
    //
    // static async cacheCurrent()
    // {
    //     let user = await User.current();
    //     let props;
    //     if (user) {
    //         props = {...user.props()};
    //     }
    //
    //     return this.application.storage({
    //         "CachedUser": props
    //     });
    // }
}
