import { postANewTeam, joinTheTeam } from '../data.js';
import { createEditTemplate } from './common/common.js';


export function createPage(ctx) {
    ctx.render(createEditTemplate('create', onSubmit));

    async function onSubmit(event) {
        event.preventDefault();
        try {
            const [ name, logoUrl, description ] = [...new FormData(event.target).values()];

            if (name.length < 4 || logoUrl == undefined || description.length < 10) {
                throw new Error('Wront input !');
            }

            const teamData = await postANewTeam({ name, logoUrl, description });
            await joinTheTeam(teamData._id);
            ctx.page.redirect('/browse-teams');
        } catch (error) {
            ctx.render(createEditTemplate('create', onSubmit, error.message));
        }
    }
}
