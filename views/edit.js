import { editTeam } from '../data.js';
import { createEditTemplate } from './common/common.js';


export async function editPage(ctx) {
    ctx.render(createEditTemplate('edit', onSubmit));

    async function onSubmit(event) {
        event.preventDefault();
        try {
            const [ name, logoUrl, description ] = [...new FormData(event.target).values()];

            if (name.length < 4 || logoUrl == undefined || description.length < 10) {
                throw new Error('Wront input !');
            }
            
            await editTeam(ctx.params.id, { name, logoUrl, description });
            ctx.page.redirect('/browse-teams');
        } catch (error) {
            ctx.render(createEditTemplate('edit', onSubmit, error.message));
        }
    }
}