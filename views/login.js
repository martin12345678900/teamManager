import { html } from 'https://unpkg.com/lit-html?module';
import { login } from '../data.js';
import { setPropertiesToSessionStorage } from './common/common.js';

const loginTemplate = (onSubmit, errorMsg) => html`            
    <section id="login">
        <article class="narrow">
            <header class="pad-med">
                <h1>Login</h1>
            </header>
            <form @submit=${onSubmit} id="login-form" class="main-form pad-large">
                ${ errorMsg ? html`<div class="error">${errorMsg}</div>` : undefined }
                <label>E-mail: <input type="text" name="email"></label>
                <label>Password: <input type="password" name="password"></label>
                <input class="action cta" type="submit" value="Sign In">
            </form>
            <footer class="pad-small">Don't have an account? <a href="/register" class="invert">Sign up here</a>
            </footer>
        </article>
    </section>`;

export async function loginPage(ctx) {
    ctx.render(loginTemplate(onSubmit));

    async function onSubmit(event) {
        event.preventDefault();
        try {
            const [ email, password ] = [...new FormData(event.target).values()];
            
            const data = await login({ email, password });
            setPropertiesToSessionStorage([{name: 'username', value: data.username}, {name: 'email', value: data.email}, {name: 'authToken', value: data.accessToken}, {name: 'userId', value: data._id}]);
            ctx.setUserNav();
            ctx.page.redirect('/');
        } catch (error) {
            ctx.render(loginTemplate(onSubmit, error.message));
        }
    }
}