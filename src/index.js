import React from 'react';
import { render } from 'react-dom';
import StorePicker from './components/StorePicker';
import App from './components/App';
import NotFound from './components/NotFound';
import './css/style.css';
import { BrowserRouter, Match, Miss } from 'react-router';

/*
***** STATE = Master Object *****

STATE is one object that holds ALL THE DATA being used in the application

-----

FOR HOSITNG WITH GITUB PAGES:

const Repo = `/{$window.location.pathname.split('/')[1]}`;
<BrowserRouter basename={repo}>

npm run build
cd build
git init
git remote add origin git@github.com:[GH-USER-NAME]/[REPO-NAME].git
git add -A
git commit -m ""
git push -u origin master

GITHUB SETTINGS:
under github pages, set this one to be the "master branch"
add "github.io" to FireBase authentication domains
IN BUILD FLDER
cp index.html 404.html
add to git
this spoofs GitHub's 404 page to the index.html :)

However... you're telling the browser it's a 404 page, so SEO etc won't work

-- FOR HOSTING WITH OTHER SERVER

** If deploying to a SUBDIRECTORY (and not a subdomain), then the basename prop of BrowserRouter and HOMEPAGE in package.json
must be the path of the subdirectory

** if deploying to SUBDOMAIN, then it'll jsut be a root folder and no changes must be made

Copy/paste everything from build into FTP client for pushing files to the website
Add domain to Firebase's authentication
Fix refreshing issue (again) by telling server to ALWAYS serve index.html, no matter the route

FOR APACHE SERVER:

create ".htaccess" file

edit rules to serve up either the requested filename (js, css) OR the index.html file
	Rewritebase /
	RewriteRule ^index\.html$ - [L]
	RewriteCond %{REQUEST_FILENAME} !-f
	RewriteCond %{REQUEST_FILENAME} !-d
	RewriteRule ./index.html [L]

Push ".htcaccess" file via FTP
Profit.

----

OTHERWISE, GOOGLE "NGINX single page app" and figure it out
 */

const Root = () => {
	console.log(BrowserRouter);
	return(
		<BrowserRouter>
			<div>
				<Match exactly pattern="/" component={StorePicker} />
				<Match pattern="/store/:storeId" component={App} />
				<Miss component={NotFound} />
			</div>
		</BrowserRouter>
	)
}

StorePicker.contextTypes = {
	router: React.PropTypes.object
}

render(<Root />, document.querySelector('#main'))