
module.exports = {
  consumerKey: "3MVG9yZ.WNe6byQBnyHiGHJ8W5imMYooHxLNUheZPIGcmQ_TSjWyJsakI5.NTMqhJEUyaVECyiCqudFPujL96",
  secretKey: "166516284035974200",

  redirectURI: "https://login.salesforce.com/services/oauth2/callback",
  scope: "full refresh_token",

  apiVersion: '39.0',

  defaultConnections: {
    Production: "login.salesforce.com",
    Sandbox: "test.salesforce.com",
    Cservings: "cservings.force.com",
    // Bing: "bing.force.com/retailsupport",
  },

  testAccounts: [
      /*** UNUSED TEST ACCOUNTS ***/ /**
    {
      // login.salesforce - dev org
      username   : "marketing@bingbeverage.com",
      password   : "Bing1234",
      connection : "Bing",
    },
    {
      // login.salesforce - dev org
      username   : "admin@mapanything.com.uninstalled",
      password   : "saber123",
      connection : "Production",
    },
    {
      // login.salesforce - dev org
      username   : "user@mapanything.com.uninstalled",
      password   : "saber123",
      connection : "Production",
    },

    {
      // login.salesforce - dev org
      username   : "admin@mapanything.com.expired",
      password   : "saber123",
      connection : "Production",
    },
    {
      // login.salesforce - dev org
      username   : "user@mapanything.com.expired",
      password   : "saber123",
      connection : "Production",
    },

    {
      // login.salesforce - dev org
      username   : "admin@mapanything.com.admin",
      password   : "saber123",
      connection : "Production",
    },
    {
      // login.salesforce - dev org
      username   : "user@mapanything.com.admin",
      password   : "saber123",
      connection : "Production",
    },
   {
     // login.salesforce - dev org
     username   : "lwhitaker@mapanythingmobile.com",
     password   : "secret123",
     connection : "Production",
   },
   {
     // test.salesforce
     username   : "lwhitaker@mapanything.com.fullcopy",
     password   : "saber123",
     connection : "Sandbox",
   },
   {
       // test.salesforce
     username   : "klawson@mapanything.com.fullcopy",
     password   : "secret123",
     connection : "Sandbox",
   },
 ***/
      /*** WWYATT SF login creds ***/
    {
      // login.salesforce - prod org
      username   : "wwyatt@mapanything.com",
      password   : "Secret123",
      connection : "Production",
    },
    {
      // login.salesforce - mobile dev org
      username   : "wwyatt@mapanything.com.mobile",
      password   : "saber321",
      connection : "Production",
    },
    {
      // login.salesforce - mobile dev org
      username   : "mobiledev@mapanything.com",
      password   : "apple123",
      connection : "Production",
    },

      // SMART CIRCLE login creds
      {
          // login.salesforce - mobile dev org
          username   : "sfdclogins@mapanything.com.sci.icd",
          password   : "Saber123!",
          connection : "Production",
      },

      // TEST ORG
    {
        // login.salesforce - mobile dev org
        username   : "madev@mapanything.com",
        password   : "Saber123",
        connection : "Production",
    },

      /*** CSERVINGS login creds ***/
    {
        // login.salesforce - prod org
        username   : "gobrientest@servings.org",
        password   : "18Marbury!@",
        connection : "Cservings",
    },

      /*** AMEX SSO login creds ***/
    {
      // login.salesforce - prod org
      username   : "mapanything-testing@mapanythingmobile.com",
      password   : "Masupport2018",
      connection : "Production",
    },

  ],

};