<template>
    <div class="clients-page">
        <div class="_container">
            <div class="clients-page__inner">
                <div class="clients-page__header row jsb">
                    <div class="clients-page__title main__title">{{$t('trainerIndex.title')}}</div>
                    <div class="clients-page__manipulations">
                        <div class="search" @keyup.enter="searchClients()">
                            <InputFields 
                                default 
                                v-model="search" 
                                :placeholder="$t('trainerIndex.placeholder')"
                            />
                            <Btn @click="searchClients()" search class="search__btn"/>
                        </div>
                        <Btn v-if="userInfo.status != 'online_trainer'" @click="isNewClient = true" blue :name="$t('trainerIndex.addClientBtn')"/>
                    </div>
                </div>
                <div class="clients-page__cards">
                    <client-card 
                        v-for="(client, index) in clients" :key="client.id" 
                        :clientName="`${client.first_name} ${client.last_name}`"
                        :lastVisit="new Date(client.last_visit).toLocaleDateString()"
                        :id="client.id"
                        :type="client.type"
                        :email="client.email"
                        :phone="client.phone"
                        :image="client.avatar"
                        :current_week="client.current_week"
                        :current_day="client.current_day"
                        :is_new_note="client.is_new_note"
                        :token="token"
                        :delete_active="isDeleteActive"
                        @delete="deleteClient(index)"
                        @deleteError="deleteClient(index, true)"
                    />
                </div>
                <client-only>
                    <infinite-loading @infinite="infiniteScroll">
                        <div slot="spinner">
                            <Loader/>
                        </div>
                        <div slot="no-more"></div>
                        <div slot="no-results"></div>
                    </infinite-loading>
                </client-only>
            </div>
        </div>
        <newClient :isActive="isNewClient" :userInfo="userInfo" :token="token" @close="closeNewClientPopup($event)"/>

        <transition name="submit-transition">
            <div class="submit-response" v-if="this.submitResponse == 'DELETE_ERROR'">
                <div class="row">
                    <div class="submit-response__picture">
                        <img src="@/assets/img/svg/cancel.svg" alt="cancel">
                    </div>
                    <div class="submit-response__description">
                        <div class="title">{{$t('trainerIndex.error')}}</div>
                    </div>
                </div>
            </div>
            <div class="submit-response" v-if="this.submitResponse == 'DELETE_OK'">
                <div class="row">
                    <div class="submit-response__picture">
                        <img src="@/assets/img/svg/sent_by.svg" alt="sent_by">
                    </div>
                    <div class="submit-response__description">
                        <div class="title">{{$t('trainerIndex.success')}}</div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
if (process.client) require('@/plugins/vue-infinite-loading.js')
import '@/assets/css/popup-delete.scss'
export default {
    data: () => ({
        search: '',
        isDelete: false,
        del_id: null,
        isNewClient: false,
        page: 1,
        isSearch: false,
        oldClients: [],
        submitResponse: '',
    }),
    async asyncData({ $axios, store, error }){
        try{
            let userInfo = store.state.userInfo
            let token = store.state.userInfo.token
            let startCount = 0
            let endCount = 10
            let countStep = 10
            let clients = await $axios.$get(`/api/v1/user/get-trainer-clients/?count=${startCount}-${endCount}`, {
                headers: { 'Authorization': `Token ${token}` }
            })
            let isDeleteActive = true
            if(userInfo.status == 'online_trainer'){
                isDeleteActive = false
            }
            return { userInfo, clients, token, startCount, endCount, countStep, isDeleteActive }
        } catch (e) {
            error({ statusCode: 404, message: 'Страница не найдена' })
        }
    },
    methods: {
        closeNewClientPopup(e){
            if(e){
                this.clients.push(e)
            }
            this.isNewClient = !this.isNewClient
        },
        infiniteScroll($state) {
            setTimeout(() => {
                this.page++;
                this.startCount = this.endCount
                this.endCount += this.countStep
                this.$axios.$get(`/api/v1/user/get-trainer-clients/?count=${this.startCount}-${this.endCount}`, {
                    headers: { 'Authorization': `Token ${this.token}` }
                }).then(response => {
                    if (response.length > 0) {
                        response.forEach(client => this.clients.push(client));
                        $state.loaded();
                    } else {
                        $state.complete();
                    }
                }).catch(err => {
                    console.log(err);
                });
            }, 500);
        },
        searchClients(){
            this.oldClients = this.clients
            let search_data = {
                'search': this.search
            }
            this.clients = this.$axios.$post(`/api/v1/user/search-clients/`, search_data, {
                headers: { 'Authorization': `Token ${this.token}` }
            }).then(response => {
                if (response.length > 0){
                    this.clients = response
                } else {
                    this.clients = this.oldClients
                }
            })
        },
        deleteClient(index, error=false){
            if (!error){
                this.clients.splice(index, 1);
                setTimeout(() => {
                    this.submitResponse = 'DELETE_OK'
                    setTimeout(() => {
                        this.submitResponse = ''
                    }, 4000)
                },)
            } else {
                etTimeout(() => {
                    this.submitResponse = 'DELETE_ERROR'
                    setTimeout(() => {
                        this.submitResponse = ''
                    }, 4000)
                },)
            }
        }
    },
    components:{
        Btn: () => import(`@/components/controls/Btn.vue`),
        InputFields: () => import(`@/components/controls/Input-fields.vue`),
        clientCard: () => import(`@/components/clientCard.vue`),
        newClient: () => import(`~/components/new-client/newClient.vue`),
        Loader: () => import(`@/components/Loader.vue`)
    }
}
</script>

<style lang="scss">
.clients-page{
    &__header{
        margin-bottom: 16px;
    }
    &__title{
        margin-bottom: 0;
    }
    &__manipulations{
        display: flex;
        .input{
            width: 360px;
            margin-right: 10px;
        }
        .search{
            display: flex;
            align-items: center;
            margin-right: 20px;
        }
    }
    &__cards{
        place-content: space-evenly;
        display: grid;
        grid-template-columns: repeat(auto-fill, 270px);
        grid-gap: 20px;
    }
    .loader{
        position: absolute;
        left: 0;
        right: 0;
        margin: auto;
        width: 40px;
        height: 40px;
    }
}
@media (max-width: 992px){
    .clients-page{
        &__header{
            .input{
                width: 300px;
            }
        }
    }
}

@media (max-width: 768px){
    .clients-page{
        &__title{
            margin-bottom: 10px;
        }
        &__header{
            flex-direction: column;
            .input{
                width: fit-content;
            }
        }
        &__cards{
            grid-template-columns: repeat(auto-fill, 100%);
        }
    }
}

@media (max-width: 576px){
    .clients-page{
        &__manipulations{
            display: block;
            width: 100%;
            .input{
                width: -webkit-fill-available;
            }
            .search {
                margin-bottom: 10px;
                margin-right: 0;
                .btn{
                    min-width: 48px;
                    width: 48px;
                    height: 48px;
                }
            }
            .btn{
                width: -webkit-fill-available;
                font-size: 14px;
                min-width: 100px;
            }
        }
    }
}
</style>