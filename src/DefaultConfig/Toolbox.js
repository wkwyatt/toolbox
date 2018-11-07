

export default {
	requests: {
        timeout: 5000,
    },
    
	log: {
		hide: false,

	    events: true,
	    device: {
	      	battery: false,
	      	network: false,
	      	notification: false,
	        tracking: false,
	    },
	    http: {
		    requests: true,
		    responses: true,
		},
	},


	locatable: {
		arcgis: {
		  	clientId: "F4DmKX3EquPRJVNB",
		  	clientSecret: "87c4ac6f564644de96da28282c7b5ddd",
		},
		
		tracking: {
			enabled: true,

			postInterval: 120000,
		    // both
		    interval: 6000,
		    desiredAccuracy: 0,
		    distanceFilter: 0,
		    debug: false,
		    useDevAPI: false,

		    permissionsChangePrompt: {
		        title: 'Location',
		        message: 'MapAnything needs access to your current location.'
		    },

		    // ios only
		    persistInBackground: true,
		    useActivityDetection: true,

		    // android only
		    fastestInterval: 6000,
		    activitiesInterval: 60000,
		    stopOnStillActivity: false,
		    startOnBoot: false,
		    locationTimeout: 30,

		    stopOnTerminate: true, // true ??


		    notificationTitle: 'MapAnything',
		    notificationText: 'Live Location is turned on',
		    notificationIconSmall: 'white_icon',

		    settingsPromptMessage: "<h2>Use Location ?</h2>This app wants to change your device settings:<br/><br/>Use GPS, Wi-Fi, and cell network for location<br/>",

		    locationProviderName: 'ANDROID_ACTIVITY_PROVIDER',
		},
	},
};