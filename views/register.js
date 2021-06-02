import { html } from 'https://unpkg.com/lit-html?module';
import { register } from '../data.js';
import { setPropertiesToSessionStorage } from './common/common.js';

const registerTemplate = (onSubmit, errorMsg) => html`            
    <section id="register">
        <article class="narrow">
            <header class="pad-med">
                <h1>Register</h1>
            </header>
            <form @submit=${onSubmit} id="register-form" class="main-form pad-large">
                ${ errorMsg ? html`<div class="error">${errorMsg}</div>` : undefined }
                <label>E-mail: <input type="text" name="email"></label>
                <label>Username: <input type="text" name="username"></label>
                <label>Password: <input type="password" name="password"></label>
                <label>Repeat: <input type="password" name="repass"></label>
                <input class="action cta" type="submit" value="Create Account">
            </form>
            <footer class="pad-small">Already have an account? <a href="/login" class="invert">Sign in here</a>
            </footer>
        </article>
    </section>`;

export async function registerPage(ctx)  {
    ctx.render(registerTemplate(onSubmit));

    async function onSubmit(event) {
        event.preventDefault();
        try {
            const [ email, username, password, repass ] = [...new FormData(event.target).values()];

            if (!email || username.length < 3 || password.length < 3 || password !== repass) {
                throw new Error('Some fields are wrong!');
            }

            const data = await register({ email, username, password, repass });
            setPropertiesToSessionStorage([{name: 'username', value: data.username}, {name: 'email', value: data.email}, {name: 'authToken', value: data.accessToken}, {name: 'userId', value: data._id}]);
            ctx.setUserNav();
            ctx.page.redirect('/');
        } catch (error) {
            ctx.render(registerTemplate(onSubmit, error.message));
        }
    }
}