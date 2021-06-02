import { html } from 'https://unpkg.com/lit-html?module';
import { until } from '//unpkg.com/lit-html/directives/until?module';
import { getAllMembersInParticularTeam, getTeamById, joinTheTeam, approveMembership, declineRequest } from '../data.js';
import { loaderTemplate, detailsCommonTemplate, modalTemplate } from './common/common.js';

const detailsTemplate = (team, showInformation) => html`            
        <section id="team-home">
            ${showInformation(team)}
        </section>`; 

export async function detailsPage(ctx) {
    ctx.render(until(populateTemplate(), loaderTemplate()));

    async function populateTemplate() {
        const team = await getTeamById(ctx.params.id);
        const users = await getAllMembersInParticularTeam(team._id);
        const userId = sessionStorage.getItem('userId');
        
        function showInformation(team) {
            if (userId) {
                if (userId == team._ownerId) {
                    const myUsername = users.find(u => u._ownerId === userId).user.username;

                    return html`                
                    <article class="layout">
                            <img src=${team.logoUrl} class="team-logo left-col">
                            <div class="tm-preview">
                                <h2>${team.name}</h2>
                                <p>${team.description}</p>
                                <span class="details">${users.filter(user => user.status == 'member').length} Members</span>
                                <div>
                                    <a href="/edit/${team._id}" class="action">Edit team</a>
                                </div>
                            </div>
                            <div class="pad-large">
                                <h3>Members</h3>
                                <ul class="tm-members">
                                    ${ myUsername ? html`<li>${myUsername}</li>` : undefined }
                                    ${ users.length > 0 ? users.filter(u => u.status == 'member' && u.user.username != myUsername).map(u => html`<li id=${u._id}>${u.user.username}<a @click=${toDecline} href="javascript:void(0)" class="tm-control action">Remove from team</a></li>`) : '' }
                                </ul>
                            </div>
                            <div class="pad-large">
                                <h3>Membership Requests</h3>
                                <ul class="tm-members">
                                ${users.length > 0 ? users.filter(u => u.status == 'pending').map(p => html`<li id=${p._id}>${p.user.username}<a @click=${toApprove} href="javascript:void(0)" class="tm-control action">Approve</a><a @click=${toDecline} href="javascript:void(0)"
                                        class="tm-control action">Decline</a></li>`) : ''}
                                </ul>
                            </div>
                    </article>`;
                } else if (users.some(u => u._ownerId === userId && u.status === 'member')) {
                    return detailsCommonTemplate(html`<a @click=${toLeaveTeam} href="javascript:void(0)" class="action invert">Leave team</a>`, users, team);
                } else if (users.some(u => u._ownerId === userId && u.status === 'pending')) {
                    return detailsCommonTemplate(html`Membership pending. <a @click=${toCancelRequest} href="javascript:void(0)">Cancel request</a>`, users, team);
                } else {
                    return detailsCommonTemplate(html`<a @click=${toJoinTeam} href="javascript:void(0)" class="action">Join team</a>`, users, team);
                }
            } else {
                return detailsCommonTemplate(undefined, users, team);
            }

            async function toJoinTeam() {
                await joinTheTeam(team._id);
                const joinTemplate = () => detailsCommonTemplate(html`<a @click=${toJoinTeam} href="javascript:void(0)" class="action">Join team</a>`, users, team)
                ctx.render(until(joinTemplate(), loaderTemplate()));
                ctx.page.redirect('/browse-teams');
            }
        
            async function toDecline(event) {
                const toDeclineRequest = async () => await declineRequest(event.target.parentNode.id);
                ctx.render(modalTemplate('Are u sure u want to decline the request ?!'), toDeclineRequest());
            }

            async function toApprove(event) {
                const toApproveRequest = async () => await approveMembership(event.target.parentNode.id);
                ctx.render(modalTemplate('Are u sure u want to approve the request ?!'), toApproveRequest());
            }
    
            async function toCancelRequest() {
                const id = users.filter(user => user.status == 'pending').find(m => m._ownerId == userId)._id;
                const toCancel = async () => await declineRequest(id);
                
                ctx.render(modalTemplate('Are u sure u want to cancel the request ?!'), toCancel());
            }
    
            async function toLeaveTeam() {
                const id = users.filter(user => user.status == 'member').find(m => m._ownerId == userId)._id;
                const toLeaveTeamRequest = async () => await declineRequest(id);

                ctx.render(modalTemplate('Are u sure u want to leave the team ?!'), toLeaveTeamRequest());
            }
        }

        return detailsTemplate(team, showInformation);
    }
}