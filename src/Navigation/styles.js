
import { Theme } from '../Theme'

export default Theme.Current.stylesheet({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: Theme.Current.color('primary'),
        flexDirection: 'row',
        height: Theme.Current.metric('navBarHeight'),
        ios: {
            paddingTop: 10,
        },
        android: {
            paddingTop: 0,
        }
    },

    navbar: {
        flexDirection: 'row',
        height: Theme.Current.metric('navBarHeight'),
        justifyContent: 'space-between',
        ios: {
            paddingTop: 10,
        },
        android: {
            paddingTop: 0,
        },
    },
    title: {
        flex: 3,
        textAlign: 'center',
        color: Theme.Current.color('white'),
        fontWeight: '200',
        fontSize: 18,
        alignSelf: 'center'
    },
    logo: {
        alignSelf: 'center',
        height: Theme.Current.metric('icons.lg'),
        phone: {
            width: 200
        },
        tablet: {
            width: 300
        },
    },
    rightButtons: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
    leftButtons: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    }
});