<template>
    <div class="login">
      <div class="_container">
        <div class="login__content" @keyup.enter="login">
            <div class="logo">
                <img width="380" height="220" src="@/assets/img/svg/logo_full.svg" alt="logo">
            </div>
            <div class="title">{{$t('mainIndex.title')}}</div>
            <InputFields v-model="form.email" default :placeholder="$t('mainIndex.placeholder1')"/>
            <div class="password">
                <InputFields v-model="form.password" default :placeholder="$t('mainIndex.placeholder2')" :type="passwordType"/>
                <img @click="changePasswordType" v-if="passwordType == 'text'" src="@/assets/img/svg/password-show.svg" alt="show-password">
                <img @click="changePasswordType" v-if="passwordType == 'password'" src="@/assets/img/svg/password-hide.svg" alt="show-password">
            </div>
            <nuxt-link :to="localePath(`/reset-password`)" class="forgot-password" tag="div">
                {{$t('mainIndex.forgotPassword')}}
            </nuxt-link>
            <div class="sign-in" @click="login">
                <Btn blue :name="$t('mainIndex.signInBtn')"/>
            </div>
        </div>
    </div>
    <transition name="submit-transition">
        <div class="submit-response" v-if="this.submitResponse == 'ERROR'">
            <div class="row">
                <div class="submit-response__picture">
                    <img src="@/assets/img/svg/cancel.svg" alt="cancel">
                </div>
                <div class="submit-response__description">
                    <div class="title">{{$t('mainIndex.error1')}}</div>
                </div>
            </div>
        </div>
        <div class="submit-response" v-if="this.submitResponse == 'ERRORRATE'">
            <div class="row">
                <div class="submit-response__picture">
                    <img src="@/assets/img/svg/cancel.svg" alt="cancel">
                </div>
                <div class="submit-response__description">
                    <div class="title">{{$t('mainIndex.error2')}}</div>
                </div>
            </div>
        </div>
    </transition>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import Btn from '@/components/controls/Btn.vue'

export default {
    layout: 'empty',
    data: () => ({
        form: {
            email: '',
            password: ''
        },
        submitResponse: '',
        passwordType: 'password',
    }),
    async asyncData({ route }){
        let new_code = route.query.authorization_code
        return { new_code }
    },
    methods: {
        ...mapActions(["getPopups"]),
        async login(){
            try {
                await this.$axios.$post('/api/v1/user/login/', {
                    username: this.form.email.toLowerCase().trim(),
                    password: this.form.password.trim()
                }).then(async result => {
                    console.log(result)
                    this.user = await this.$axios.$get('/api/v1/user/me/', {
                        headers: {'Authorization': `Token ${result.token}`}
                    }).catch(err => {
                        console.log(err.response);
                    });
                    if(this.checkRate()){
                        return
                    }
                    console.log(this.user)
                    this.$cookies.set("cfid", result.token);
                    this.$cookies.set("cfut", this.user.status);
                    this.$store.state.userInfo = this.user
                    this.$store.state.userInfo.token = result.token
                    if(this.user.status == 'trainer' || this.user.status == 'mzo_trainer' || this.user.status == 'online_trainer'){
                        this.$router.push(this.localePath(`/trainer/clients`))
                    } else if(this.user.status == 'online_client' && !this.user.question_complete) {
                        this.$router.push(this.localePath(`/client/account-setup`))
                    } else if(this.user.status == 'moderator'){
                        this.$router.push(this.localePath(`/moderator`))
                    } else {
                        this.$router.push(this.localePath(`/client`))
                    }
                }).catch(err => {
                    console.log(err);
                    setTimeout(() => {
                        this.submitResponse = 'ERROR'
                        setTimeout(() => {
                            this.submitResponse = ''
                        }, 4000)
                    },)
                });
            }
            catch {
                this.loggedIn = false
                this.user = {}
                this.$cookies.remove("cfid");
                this.$cookies.remove("cfut");
                setTimeout(() => {
                    this.submitResponse = 'ERROR'
                    setTimeout(() => {
                        this.submitResponse = ''
                    }, 4000)
                },)
            }
        },
        changePasswordType(){
            this.passwordType = this.passwordType == 'password' ? 'text' : 'password'
        },
        checkRate(){
            if(this.user.status == 'mzo_client'){
                if (new Date(this.user.rate_end_day).getTime() <= new Date().getTime()){
                    setTimeout(() => {
                        this.submitResponse = 'ERRORRATE'
                        setTimeout(() => {
                            this.submitResponse = ''
                        }, 4000)
                    },)
                    return true;
                }
            }
            return false
        }
    },
    async beforeMount(){
        if(this.new_code != undefined){
            try{
                let params = {
                    'authorization_code': this.new_code
                }
                let login_code = await this.$axios.$post(`/api/v1/user/token-from-auth-code/`, params, {})
                this.user = await this.$axios.$get('/api/v1/user/me/', {
                    headers: {'Authorization': `Token ${login_code.token}`}
                })
                if(this.checkRate()){
                    return
                }
                this.$cookies.set("cfid", login_code.token);
                this.$cookies.set("cfut", this.user.status);
                this.$store.state.userInfo = this.user
                this.$store.state.userInfo.token = login_code.token
                if(this.user.status == 'trainer' || this.user.status == 'mzo_trainer' || this.user.status == 'online_trainer'){
                    this.$router.push(this.localePath(`/trainer/clients`))
                } else {
                    this.$router.push(this.localePath(`/client`))
                }
            } catch {
                setTimeout(() => {
                    this.submitResponse = 'ERROR'
                    setTimeout(() => {
                        this.submitResponse = ''
                    }, 4000)
                },)
            }
        }
    },
    components:{
        InputFields: () => import('@/components/controls/Input-fields.vue'),
        Btn
    }
}
</script>

<style lang="scss">
.login{
    padding-bottom: 0 !important;
    min-height: calc(100% - 45px);
    &__content{
        display: flex;
        flex-direction: column;
        min-height: calc(100vh - 45px);
        margin: auto;
        justify-content: center;
        padding-bottom: 20px;
        width: 460px;
        .logo{
            margin-bottom: 20px;
            align-self: center;
        }
        .title{
            margin-bottom: 30px;
            text-align: center;
            font-weight: 700;
            font-size: 32px;
            line-height: 38px;
        }
        .input{
            margin-bottom: 20px;
            width: 100%;
        }
        .btn{
            margin-bottom: 12px;
            min-width: 100%;
        }
        .forgot-password{
            margin-bottom: 20px;
            cursor: pointer;
            text-align: center;
            font-size: 16px;
            line-height: 19px;
            color: #959CAD;
        }
        .password{
            position: relative;
            input{
                margin-bottom: 12px;
            }
            img{
                cursor: pointer;
                position: absolute;
                width: 24px;
                height: 24px;
                right: 12px;
                top: 12px;
                z-index: 10;
            }
        }
    }
}

@media (max-width: 576px){
    .login{
        &__content{
            width: 100%;
        }
    }
}
</style>
