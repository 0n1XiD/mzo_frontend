export default async function ({ store, $axios, redirect }) {
    if(new Date(store.state.userInfo.rate_end_day).getTime() <= new Date().getTime()){
        console.log("Your access has expired")
        let params = {
            trainer_id: store.state.userInfo.client_trainer.id
        }
        await $axios.$post('/api/v1/user/add-client-to-archive/', params, { 
            headers: { Authorization: `Token ${store.state.userInfo.token}` } ,
        }).catch(e => {
            console.log(e.response)
        })
        store.dispatch('logout')
        redirect('/')
    }
}