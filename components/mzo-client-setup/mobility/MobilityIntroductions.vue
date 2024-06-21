<template>
    <div class="mzo-client-step">
        <div class="title">{{$t('mobilityIntroductions.title')}}</div>
        <div class="subtitle">
            {{$t('mobilityIntroductions.subtitle')}}
        </div>
        <Btn blue :name="$t('mobilityIntroductions.continueBtn')" @click="goToPage(5)"/>
    </div>  
</template>

<script>
import { mapState } from "vuex";

export default {
    props: {
      max_step: {
        type: Number,
        required: true
      }
    },
    computed:{
        ...mapState(["userInfo"]),
    },
    methods: {
        goToPage: async function(page){
            let form_data= {
                step: page
            }
            if(this.max_step == 4){
                await this.$axios.$post('/api/v1/user/mzo-client-setup/', form_data, { 
                    headers: { Authorization: `Token ${this.userInfo.token}`}
                })
            }
            this.$emit('changePage', page)
        }
    },
    components:{
        Btn: () => import('@/components/controls/Btn.vue'),
    }
}
</script>