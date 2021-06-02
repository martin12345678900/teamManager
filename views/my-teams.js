import { html } from 'https://unpkg.com/lit-html?module';
import { getAllTeamsWhereIamAMember, getAllMembersInParticularTeams } from '../data.js';
import { teamTemplate, loaderTemplate } from './common/common.js';
import { until } from '//unpkg.com/lit-html/directives/until?module';

const myTeamsTemplate = (teams, loadMembers) => html`          
    <section id="my-teams">
        <article class="pad-med">
            <h1>My Teams</h1>
        </article>

        ${
            teams.length == 0 ? html`        
            <article class="layout narrow">
                <div class="pad-med">
                    <p>You are not a member of any team yet.</p>
                    <p><a href="/browse-teams">Browse all teams</a> to join one, or use the button bellow to cerate your own
                        team.</p>
                </div>
                <div class=""><a href="/create" class="action cta">Create Team</a></div>
            </article>` : teams.map(team => teamTemplate(team, loadMembers.filter(m => m.teamId == team._id).length))
        }

    </section>`;


export async function myTeamsPage(ctx) {
    ctx.render(until(populateTemplate(), loaderTemplate()));

    async function populateTemplate() {
        const userId = sessionStorage.getItem('userId');
        const teams = await getAllTeamsWhereIamAMember(userId);
        const loadMembers = await getAllMembersInParticularTeams(teams.map(team => team.teamId));

        return myTeamsTemplate(teams.map(t => t.team), loadMembers);
    }
}