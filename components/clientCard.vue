<template>
    <div class="client-card">
        <div class="client-card__notification" v-if="is_new_note"/>
        <img @click="goToClientPage()" v-if="image" :src="image" :alt="alt" class="client-card__image">
        <img @click="goToClientPage()" v-else src="@/assets/img/no_image.jpg" alt="no image" class="client-card__image">
        <div class="client-card__content">
            <div class="client-card__name" @click="goToClientPage()">{{ clientName }}</div>
            <div class="client-card__additional-info">{{$t('clientCard.info1')}} <span>{{ lastVisit }}</span></div>
            <div class="client-card__additional-info">{{$t('clientCard.info2')}} <span>{{ email }}</span></div>
            <div class="client-card__additional-info">{{$t('clientCard.info3')}} <span>{{ phone }}</span></div>
            <div v-if="type != 'pregnant'" class="client-card__week-info">{{$t('clientCard.info4')}} <span>{{ current_week }} {{$t('clientCard.info5')}}</span></div>
            <div v-if="type != 'pregnant'" class="client-card__week-day-complete">{{$t('clientCard.info6')}} <span>{{current_day}} {{$t('clientCard.info7')}}</span></div>
            <div v-if="type == 'pregnant'" class="client-card__week-info">{{$t('clientCard.info9')}} <span>{{ current_week }} {{$t('clientCard.info10')}}</span></div>
            <div v-if="type == 'pregnant'" class="client-card__week-day-complete">{{$t('clientCard.info6')}} <span>{{current_day}} {{$t('clientCard.info8')}}</span></div>
            
            <div class="client-card__btns">
                <Btn v-if="delete_active" @click="isDeleteClient = true" delete class="client-card__delete"></Btn>
                <Btn @click="goToClientPage()" blueBorder class="client-card__edit">{{$t('clientCard.openBtn')}}</Btn>
            </div>
        </div>

        <PopupDeleteClient
            v-if="isDeleteClient"
            @deleteConfirm="deleteClient()"
            @close="isDeleteClient = false"
        />
    </div>
</template>

<script>
export default {
    data: () => ({
        isDeleteClient: false
    }),
    props: [
        'id',
        'clientName',
        'image',
        'alt',
        'lastVisit',
        'email',
        'phone',
        'current_week',
        'current_day',
        'is_new_note',
        'token',
        'delete_active',
        'type'
    ],
    methods: {
        goToClientPage(){
            this.$store.commit('trainer/resetClientinfo')
            this.$router.push(this.localePath(`/trainer/clients/${this.id}`))
        },
        async deleteClient(){
            try {
                this.isDeleteClient = false
                let form_data= {
                    'client_id': this.id
                }
                await this.$axios.$post('/api/v1/user/add-client-to-archive/', form_data, { 
                    headers: { Authorization: `Token ${this.token}` } ,
                }).then(res => {
                    this.$emit("delete");
                }).catch(e => {
                    this.$emit("deleteError");
                })
            } catch { return "Sumthing went wrong" }
        },
    },
    components:{
        Btn: () => import(`@/components/controls/Btn.vue`),
        PopupDeleteClient: () => import(`@/components/popups/PopupDeleteClient`),
    }
}
</script>

<style lang="scss">
.client-card{
    position: relative;
    white-space: nowrap;
    width: 275px;
    display: flex;
    flex-direction: column;
    &__notification{
        position: absolute;
        z-index: 50;
        border-radius: 100%;
        width: 14px;
        height: 14px;
        background: red;
        right: 5px;
        top: 5px;
    }
    &__image{
        cursor: pointer;
        overflow: hidden;
        border-radius: 10px;
        z-index: 1;
        width: 275px;
        height: 160px;
        min-width: 275px;
        min-height: 160px;
        object-fit: cover;
        object-position: top;
        img{
            width: 100%;
            height: 100%;
        }
    }
    &__content{
        height: 230px;
        position: relative;
        margin-top: -15px;
        padding: 15px 25px;
        width: 100%;
        justify-content: space-between;
        border-radius: 10px;
        background: $white;
        filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.15));
        z-index: 2;
    }
    &__name{
        cursor: pointer;
        overflow: hidden;
        max-height: 25px;
        margin-bottom: 4px;
        font-weight: bold;
        font-size: 20px;
        line-height: 24px;
        color: $blue;
        &:hover{
            opacity: 0.7;
        }
    }
    &__additional-info, &__week-info, &__week-day-complete{
        overflow: hidden;
        font-weight: bold;
        font-size: 16px;
        line-height: 19px;
        span{
            font-weight: 600;
            font-size: 14px;
        }
    }
    &__btns{
        display: flex;
        position: absolute;
        bottom: 25px;
        right: 25px;
        .btn{
            &:first-child{
                margin-right: 10px;
            }
        }
    }
    &:not(:last-child){
        margin-bottom: 15px;
    }
}

@media (max-width: 768px){
  .client-card{
    width: 100%;
    flex-direction: row;
    &__image{
        height: 200px;
    }
    &__content{
        width: 100%;
        margin-left: -15px;
        margin-top: 0;
    }
  }
}

@media (max-width: 576px){
    .client-card{
    width: 100%;
    flex-direction: column;
    &__image{
        width: 100%;
        height: 300px;
    }
    &__content{
        width: 100%;
        margin-left: 0;
        margin-top: -15px;
    }
  }
}

</style>