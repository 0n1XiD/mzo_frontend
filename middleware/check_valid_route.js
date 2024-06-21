export default async function ({ store, route, redirect }) {
    if (store.state.userInfo) {
        if (
            store.state.userInfo.status === 'client' ||
            store.state.userInfo.status === 'mzo_client' ||
            store.state.userInfo.status === 'online_client'
        ) {
            if (route.name.split('-')[0] === 'trainer') {
                redirect('/client')
            }
        } else if (store.state.userInfo.status === 'moderator') {
            if (route.name.split('-')[0] === 'moderator') {
                redirect('/moderator')
            }
        } else {
            if (route.name.split('-')[0] === 'client') {
                redirect('/trainer')
            }
        }
    }
}