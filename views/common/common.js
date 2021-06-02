import { html } from 'https://unpkg.com/lit-html?module';

const createEditTemplate = (word, onSubmit, errorMsg) => html`            
    <section id=${word}>
        <article class="narrow">
            <header class="pad-med">
                <h1>${word.slice(0,1).toUpperCase().concat(word.slice(1))} Team</h1>
            </header>
            <form @submit=${onSubmit} id=${`${word}-form`} class="main-form pad-large">
                ${ errorMsg ? html`<div class="error">${errorMsg}</div>` : undefined }
                <label>Team name: <input type="text" name="name"></label>
                <label>Logo URL: <input type="text" name="logoUrl"></label>
                <label>Description: <textarea name="description"></textarea></label>
                ${ word === 'edit' 
                ? html`<input class="action cta" type="submit" value="Save Changes">` 
                : html`<input class="action cta" type="submit" value="Create Team">` }
            </form>
        </article>
    </section>`;

const teamTemplate = (team, membersCount) => html`            
<article class="layout">
    <img src=${team.logoUrl} class="team-logo left-col">
    <div class="tm-preview">
        <h2>${team.name}</h2>
        <p>${team.description}</p>
        <span>${membersCount} Members</span>
        <div><a href=${`/details/${team._id}`} class="action">See details</a></div>
    </div>
</article>`;

const detailsCommonTemplate = (anker, users, team) => html`                    
        <article class="layout">
            <img src=${team.logoUrl} class="team-logo left-col">
            <div class="tm-preview">
                <h2>${team.name}</h2>
                <p>${team.description}</p>
                <span class="details">${users.filter(user => user.status == 'member').length} Members</span>
                <div>
                    ${anker}
                </div>
            </div>
            <div class="pad-large">
                <h3>Members</h3>
                <ul class="tm-members">
                    ${ showMembers(users) }
                </ul>
            </div>
            <div class="pad-large">
                <h3>Membership Requests</h3>
                <ul class="tm-members">
                </ul>
            </div>
        </article>`;

const loaderTemplate = () => html`<article class="pad-large"><h1>Loading&hellip;</h1></article>`;

const modalTemplate = (message, toAction) => html`    
    <div class="overlay">
        <div class="modal">
            <p>${message}</p>
            <a href="/browse-teams" class="action" @click=${toAction}>Action</a>
        </div>
    </div>`;

function setPropertiesToSessionStorage(properties) {
    properties.forEach(p => sessionStorage.setItem(p.name, p.value));
}

function showMembers(members) {
    return html`${ members.length > 0 ? members.filter(member => member.status == 'member').map(m => html`<li id=${m._id}>${m.user.username}</li>`) : '' }`;
}


export {
    createEditTemplate,
    setPropertiesToSessionStorage,
    showMembers,
    teamTemplate,
    loaderTemplate,
    detailsCommonTemplate,
    modalTemplate
}