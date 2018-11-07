import { Theme } from '../../../Theme';

const styles = Theme.Current.stylesheet({
    loadingContainer:{
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    },
    loadingIndicator: {
        height: 80
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        marginTop: Theme.Current.metric('navBarHeight')
    },
    webView:{
        flex:1
    },
    splash: {
        backgroundColor: Theme.Current.color('primary'),
        width: Theme.Current.metric('screenWidth'),
        height: Theme.Current.metric('screenHeight'),
        justifyContent: 'center',
        alignItems: 'center'
    },
    logo: {
        width: Theme.Current.metric('percentOfScreenWidth')( 0.70 )
    },
});

export default styles