/**
 * Production environment settings
 *
 * This file can include shared settings for a production environment,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

const connectionString = process.env.MONGODB_CONNECTIONSTRING || "mongodb://localhost/Prometheus";

module.exports = {
    
    connectionString: connectionString,

    /***************************************************************************
     * Set the default database connection for models in the production        *
     * environment (see config/connections.js and config/models.js )           *
     ***************************************************************************/

    connections: {
        MongoDB: {
            adapter: 'sails-mongo',
            url: connectionString
        }
    },

    models: {
        connection: 'MongoDB'
    },

    /***************************************************************************
     * Set the port in the production environment to 80                        *
     ***************************************************************************/

    port: process.env.PORT || 80,

    /***************************************************************************
     * Set the log level in production environment to "silent"                 *
     ***************************************************************************/

    log: {
        level: "silent"
    },

    environment: "production",

    session: {
        adapter: 'connect-mongo',
        url: connectionString
    }

};
