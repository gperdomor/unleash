import { Response } from 'express';
import { IUnleashConfig } from '../types/option';
import Controller from './controller';
import { IAuthRequest } from './unleash-types';

class LogoutController extends Controller {
    private baseUri: string;

    constructor(config: IUnleashConfig) {
        super(config);
        this.baseUri = config.server.baseUriPath;
        this.get('/', this.logout);
    }

    async logout(req: IAuthRequest, res: Response): Promise<void> {
        if (req.session) {
            // Allow SSO to register custom logout logic.
            if (req.session.logoutUrl) {
                console.log("Executing custom logout logic")
                res.redirect(req.session.logoutUrl);
                return;
            }

            //req.session.destroy(); // passport logout will try to destroy the session
        }

        if (req.logout) {
            console.log(req.logout) // prints [Function (anonymous)] with v0.4.1 of passport
            if (req.logout.length === 0) {
                // passport < 0.6.0
                console.log("Excecuting logout for passport 0.4.1")
                req.logout();
                this.afterLogout(req, res);
            } else {
                // for passport >= 0.6.0, try to call with a callback function
                console.log("Excecuting logout for passport 0.6.0")
                req.logout((err) => {
                    if (err) {
                        console.log("Error catched", err)
                    }
                    this.afterLogout(req, res);
                });
            }
        }

        if (req.session) {
            // delay session destroy cause it's used by the logout function
//            console.log(JSON.stringify(req.session)) // {"cookie":{"originalMaxAge":172800000,"expires":"2022-09-01T15:29:41.747Z","secure":false,"httpOnly":true,"path":"/"},"passport":{}}
            
            /* either function below fails with [ERROR] TypeError: Cannot read properties of undefined (reading 'regenerate')
    at [..]/unleash-examples/v4/securing-keycloak-auth/node_modules/passport/lib/sessionmanager.js:83:17 
    
    https://github.com/jaredhanson/passport/blob/1e8f112bd233dbffb1904d4dd2051780d81b0a22/lib/sessionmanager.js#L81-L91
    */
            //req.session.destroy();
            //delete req.session;
            //req.session = null
        }
    }

    private afterLogout(req: IAuthRequest, res: Response) {
        res.set('Clear-Site-Data', '"cookies", "storage"');
        res.redirect(`${this.baseUri}/`);
    }
}

module.exports = LogoutController;
export default LogoutController;
