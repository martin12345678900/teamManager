import { html } from 'https://unpkg.com/lit-html?module';
import { getAllTeams, getAllMembersInParticularTeams, getAllMembersInParticularTeam} from '../data.js';
import { until } from '//unpkg.com/lit-html/directives/until?module';
import { teamTemplate, loaderTemplate } from './common/common.js';

const browseTemplate = (teams, loadMembers, isLogged) => html`            
        <section id="browse">

            <article class="pad-med">
                <h1>Team Browser</h1>
            </article>

            <article class="layout narrow">
                ${ isLogged ? html`<div class="pad-small"><a href="/create" class="action cta">Create Team</a></div>` : undefined }
            </article>
            ${teams.map(team => teamTemplate(team, loadMembers.filter(m => m.teamId == team._id).length))}
        </section>`;

export const browseTeamsPage = async (ctx) => {
    ctx.render(until(populateTemplate(), loaderTemplate()));

    async function populateTemplate() {
        const teams = await getAllTeams();
        const loadMembers = await getAllMembersInParticularTeams(teams.map(t => t._id));

        return browseTemplate(teams, loadMembers, sessionStorage.getItem('authToken') != null);
    }
}