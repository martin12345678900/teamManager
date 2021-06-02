// Import needed libraries
import page from '//unpkg.com/page/page.mjs';
import { render } from 'https://unpkg.com/lit-html?module';

// Import view handlers
import { homePage}  from './home.js';
import { browseTeamsPage } from './browse.js';
import { registerPage } from './register.js';
import { loginPage } from './login.js';
import { editPage } from './edit.js';
import { detailsPage } from './details.js';
import { createPage } from './create.js';
import { myTeamsPage } from './my-teams.js';

// Add logout logic
document.getElementById('logoutBtn').addEventListener('click', () => {
    sessionStorage.clear();
    setUserNav();
    page.redirect('/');
});

// Fill the routing table
page('/', decorateContextFunction, homePage);
page('/browse-teams', decorateContextFunction, browseTeamsPage);
page('/register', decorateContextFunction, registerPage);
page('/login', decorateContextFunction, loginPage);
page('/edit/:id', decorateContextFunction, editPage);
page('/details/:id', decorateContextFunction, detailsPage);
page('/create', decorateContextFunction, createPage);
page('/my-teams', decorateContextFunction, myTeamsPage);

setUserNav();

// Start Application
page.start();

// Pass render and setUserNav functions over the context object
function decorateContextFunction(ctx, next) {
    ctx.render = (content) => render(content, document.querySelector('main'));
    ctx.setUserNav = setUserNav;
    
    next();
}

// Setting user navigation
function setUserNav() {
    const welcomeUserSpan = document.getElementById('welcome-user');
    if (sessionStorage.getItem('authToken') != null) {
        document.querySelectorAll('nav > .guest').forEach(g => g.style.display = 'none');
        document.querySelectorAll('nav > .user').forEach(u => u.style.display = 'block');
        welcomeUserSpan.textContent = `Welcome, ${sessionStorage.getItem('username')}`;
        welcomeUserSpan.style.display = 'block';
    } else {
        document.querySelectorAll('nav > .guest').forEach(g => g.style.display = 'block');
        document.querySelectorAll('nav > .user').forEach(u => u.style.display = 'none');
        welcomeUserSpan.style.display = 'none';
    }
}
