export const strict = false

export const state = () => ({
    userLoggined: false,
    userInfo: [],
})

export const actions = {
    async nuxtServerInit ({ state, commit }, {route, redirect}) {
        /* #region User */
        let token = this.$cookies.get('cfid')
        if (token){
            try{
                let userInfo = await this.$axios.$get('/api/v1/user/me/', {
                    headers: {'Authorization': `Token ${token}`}
                })
                state.userInfo = userInfo
                state.userInfo.token = token
            } catch {
                this.$cookies.remove("cfid");
                this.$cookies.remove("cfut");
            }
        }
        state.userLoggined = state.userInfo.id ? true : false
        console.log(state.userInfo)
        if(!state.userLoggined){
            if (
                !route.query.authorization_code && route.path != '/' && 
                !route.query.reset_password_code && route.path != '/reset-password'
            ){
                redirect('/')
            }
        } else{
            if(state.userInfo.status == 'trainer' || state.userInfo.status == 'mzo_trainer' || state.userInfo.status == 'online_trainer'){
                if(route.path == '/' || route.name == null){
                    redirect(`/trainer/clients`)
                }
            } else if(state.userInfo.status == 'online_client' && !state.userInfo.question_complete) {
                    redirect(`/client/account-setup`)
            } else if(state.userInfo.status == 'moderator') {
                redirect(`/moderator`)
            } else {
                if(route.path == '/' || route.name == null){
                    redirect(`/client`)
                }
            }
        }
        /* #endregion */
    },
    async logout({ state }){
        let token = this.$cookies.get('cfid')
        state.userLoggined = false;
        await this.$axios.$post('/api/v1/user/logout/', {}, { 
            headers: { Authorization: `Token ${token}` } 
        })
        this.$cookies.remove("cfid");
        this.$cookies.remove("cfut");
        this.$cookies.remove('w_w')
        this.$cookies.remove('w_d')
        this.$router.go(this.localePath('/'))
    },
    async getPopups({ state, commit }){
        let token = this.$cookies.get('cfid')
        if ((state.userInfo.status == 'online_client' && state.userInfo.question_complete) || state.userInfo.status == 'client' || state.userInfo.status == 'mzo_client'){
            let week_num = null
            let day_num = null
            let weeks = null
            if (this.state.userInfo.type != 'pregnant'){
                weeks = await this.$axios.$get(`/api/v1/user/get-client-weeks/?client_id=${state.userInfo.id}`, {
                    headers: { 'Authorization': `Token ${token}` }
                }).catch(e => {
                    console.log(e.response)
                })
            } else{
                weeks = await this.$axios.$get(`/api/v1/user/get-client-periods/?client_id=${state.userInfo.id}`, {
                    headers: { 'Authorization': `Token ${token}` }
                }).catch(e => {
                    console.log(e.response)
                })   
            }
            commit('client/setClientWeeks', weeks)
            let cur_week_index = null
            for (let i in weeks.weeks){
                if(weeks.weeks[i].is_available_for_client){
                    cur_week_index = i
                } else {
                    break
                }
            }
            week_num = parseInt(cur_week_index) + 1
            day_num = parseInt(weeks.weeks[cur_week_index].complete_count) + 1
            this.$cookies.set("w_d", parseInt(weeks.weeks[cur_week_index].complete_count + 1));     // Current Day
            this.$cookies.set("w_w", parseInt(cur_week_index) + 1);         // Current Week
            if (!week_num){
                week_num = this.$cookies.get('w_w')
            }
            if (!day_num){
                day_num = this.$cookies.get('w_d')
            }
            commit('client/setDayIndex', this.$cookies.get('w_d'))
            commit('client/setStartDayIndex', this.$cookies.get('w_d'))
            commit('client/setWeekIndex', this.$cookies.get('w_w'))
            let popup_billet_content = null
            if(state.userInfo.last_visit.split('T').length > 0){
                state.userInfo.last_visit = state.userInfo.last_visit.split('T')[0]
            }
            if ((state.userInfo.status == 'client' || state.userInfo.status == 'mzo_client') && (new Date(state.userInfo.last_visit).getDate() < new Date().getDate() || state.userInfo.is_first_login)){
                console.log(week_num)
                popup_billet_content = await this.$axios.$get(`/api/v1/site_content/get-popup/?week_num=${week_num}&day_num=${day_num}&client_type=${state.userInfo.status}`, {
                    headers: { 'Authorization': `Token ${token}` }
                }).catch(e => {
                    console.log(e.response)
                })
            }
            if ((state.userInfo.status == 'online_client' && state.userInfo.question_complete) && new Date(state.userInfo.last_visit).getDate() < new Date().getDate()){
                console.log(state.userInfo)
                popup_billet_content = await this.$axios.$get(`/api/v1/site_content/get-popup/?week_num=${week_num}&day_num=${day_num}&client_type=${state.userInfo.status}&rate_id=${state.userInfo.rate.id}`, {
                    headers: { 'Authorization': `Token ${token}` }
                }).catch(e => {
                    console.log(e.response)
                })
            }
            let changeTime = true
            if(state.userInfo.status == 'online_client' && !state.userInfo.question_complete){
                changeTime = false
            }
            if(changeTime){
                console.log(1)
                await this.$axios.$post(`/api/v1/user/change-client-last-visit/`, {}, {
                    headers: { 'Authorization': `Token ${token}` }
                }).catch(e => {
                    console.log(e.response)
                })
            }
            commit('client/setHtmlPopupContent', popup_billet_content)
        } else if (state.userInfo.length > 0) {
            this.$cookies.set("w_d", 1);
            this.$cookies.set("w_w", 1);
        }
    }
}

export const mutations = {
    setUserInfo (state, userInfo) {
        let save_token = state.userInfo.token
        state.userInfo = userInfo
        state.userInfo.token = save_token
    },
    addClientNote(state, note) {
        state.userInfo.notes.push(note)
    },
    changeOrSetUserToken(state, token) {
        state.userInfo.token = token
    }
}

export const getters = () => ({

    getUserInfo: (state) => {
      return state.userInfo
    }
})