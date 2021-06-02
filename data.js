export async function getAllTeams() {
    const response = await fetch('http://localhost:3030/data/teams');

    return await response.json();
}

export async function getAllMembersInParticularTeams(teamIds) {
    const query = encodeURIComponent(` IN ("${teamIds.join('", "')}") AND status="member"`);
    const response = await fetch('http://localhost:3030/data/members?where=teamId' + query);

    return await response.json();
} 
export async function getAllMembersInParticularTeam(teamId) {
    const response = await fetch(`http://localhost:3030/data/members?where=teamId%3D%22${teamId}%22&load=user%3D_ownerId%3Ausers`);
    return await response.json();
}
export async function getAllMembers() {
    const response = await fetch('http://localhost:3030/data/members?where=status%3D%22member%22');

    return await response.json();
}

export async function joinTheTeam(teamId) {
    const authToken = sessionStorage.getItem('authToken');
    if (authToken) {
        const response = await fetch('http://localhost:3030/data/members', {
            method: 'post',
            headers: { 'Content-Type': 'application/json', 'X-Authorization': authToken },
            body: JSON.stringify({ teamId })
        });

        return await response.json();
    }
}

export async function approveMembership(id, teamId) {
    const authToken = sessionStorage.getItem('authToken');
    if (authToken) {
        await fetch('http://localhost:3030/data/members/' + id, {
            method: 'put',
            headers: { 'Content-Type': 'application/json', 'X-Authorization': authToken },
            body: JSON.stringify({ teamId, status: 'member' })
        });
    }
}

export async function declineRequest(id) {
    const authToken = sessionStorage.getItem('authToken');
    if (authToken) {
        await fetch('http://localhost:3030/data/members/' + id, {
            method: 'delete',
            headers: {'X-Authorization': authToken },
        });
    }
}

export async function getAllTeamsWhereIamAMember(userId) {
    return await (await fetch(`http://localhost:3030/data/members?where=_ownerId%3D%22${userId}%22%20AND%20status%3D%22member%22&load=team%3DteamId%3Ateams`)).json();
}

export async function register(data) {
    try {
        const response = await fetch('http://localhost:3030/users/register', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok == false) {
            throw new Error((await response.json()).message);
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}

export async function login(data) {
    try {
        const response = await fetch('http://localhost:3030/users/login', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok == false) {
            throw new Error((await response.json()).message);
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}

export async function postANewTeam(data) {
    try {
        const authToken = sessionStorage.getItem('authToken');
        if (authToken) {
            const response = await fetch('http://localhost:3030/data/teams', {
                method: 'post',
                headers: { 'Content-Type': 'application/json', 'X-Authorization': authToken },
                body: JSON.stringify(data)
            });

            if (response.ok == false) {
                throw new Error((await response.json()).message);
            }
            return await response.json();
        }
    } catch (error) {
        throw error;
    }

}

export async function getTeamById(teamId) {
    try {
        const response = await fetch('http://localhost:3030/data/teams/' + teamId, {
            method: 'get'
        });

        if (response.ok == false) {
            throw new Error((await response.json()).message);
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}

export async function editTeam(teamId, data) {
    try {
        const authToken = sessionStorage.getItem('authToken');
        if (authToken) {
            const response = await fetch('http://localhost:3030/data/teams/' + teamId, {
                method: 'put',
                headers: {
                    'X-Authorization': authToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok == false) {
                throw new Error((await response.json()).message);
            }
        }
    } catch (error) {
        throw error;
    }
}