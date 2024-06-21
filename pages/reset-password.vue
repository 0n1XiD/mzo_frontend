<template>
    <div class="reset-password">
        <div class="_container">
            <div class="main__breadcrumbs">
                <img src="@/assets/img/svg/breadcrumbs-arrow.svg" alt="small-arrow">
                <nuxt-link :to="localePath(`/`)">
                    {{$t('resetPassword.backLink')}}
                </nuxt-link> 
            </div>
            <div class="reset-password__inner">
                <div class="reset-password__title main__title">{{$t('resetPassword.title')}}</div>
                <div class="reset-password__step">{{$t('resetPassword.stepTitle1')}} {{step}} {{$t('resetPassword.stepTitle2')}}</div>
                <div class="reset-password__subtitle">
                    <p v-if="step == 1">
                        {{$t('resetPassword.step1_1')}} <br>
                        {{$t('resetPassword.step1_2')}}
                    </p>
                    <p v-if="step == 2">
                        {{$t('resetPassword.step2_1')}} <br>
                        {{$t('resetPassword.step2_2')}} <br>
                        {{$t('resetPassword.step2_3')}}
                    </p>
                </div>
                <form method="POST" onsubmit="return false" class="reset-password__form" v-if="step == 1 && !successfullySendMail">
                    <div class="error-text" v-if="mailError">{{ mailErrorText }}</div>
                    <InputFields
                        class="email-input"
                        v-model.trim="$v.form.email.$model"
                        :error="$v.form.email.$error"
                        default 
                        :placeholder="$t('resetPassword.placeholderEmail')"
                    />
                    <Btn @click="sendMail()" blue :name="$t('resetPassword.sendMailBtn')" class="lg-btn" type="submit"/>
                </form>
                <div class="reset-password__successfully-send" v-if="successfullySendMail">
                    {{$t('resetPassword.send1')}} <br>
                    {{$t('resetPassword.send2')}}
                </div>
                <form method="POST" onsubmit="return false" class="reset-password__form" v-if="step == 2">
                    <div class="error-text" v-if="passwordError">{{$t('resetPassword.sendError')}}</div>
                    <div class="reset-password__password-input">
                        <InputFields 
                            :class="{'input-error': $v.passwordForm.newPassword.$error}" 
                            :type="passwordTypes[0].type" 
                            :placeholder="$t('resetPassword.placeholderNewPass')" 
                            v-model.trim="$v.passwordForm.newPassword.$model"
                        />
                        <img @click="changePasswordType(0)" v-if="passwordTypes[0].type == 'text'" src="@/assets/img/svg/password-show.svg" alt="show-password">
                        <img @click="changePasswordType(0)" v-if="passwordTypes[0].type == 'password'" src="@/assets/img/svg/password-hide.svg" alt="show-password">
                    </div>
                    <div class="reset-password__password-input">
                        <InputFields 
                            :class="{'input-error': $v.passwordForm.confirmNewPassword.$error}" 
                            :type="passwordTypes[1].type" 
                            :placeholder="$t('resetPassword.placeholderRepeatPass')" 
                            v-model.trim="$v.passwordForm.confirmNewPassword.$model"
                        />
                        <img @click="changePasswordType(1)" v-if="passwordTypes[1].type == 'text'" src="@/assets/img/svg/password-show.svg" alt="show-password">
                        <img @click="changePasswordType(1)" v-if="passwordTypes[1].type == 'password'" src="@/assets/img/svg/password-hide.svg" alt="show-password">
                    </div>
                    <Btn @click="changePassword()" blue :name="$t('resetPassword.saveBtn')" class="lg-btn" type="submit"/>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
require('@/plugins/vuelidate.js')
import { required, email, minLength, sameAs } from 'vuelidate/lib/validators'

export default {
    data: () => ({
        step: 1,
        successfullySendMail: false,
        mailError: false,
        mailErrorText: '',
        passwordError: false,
        form: {
            email: null
        },
        passwordTypes: [
            {type: 'password'},
            {type: 'password'},
        ],
        passwordForm: {
            newPassword: '',
            confirmNewPassword: '',
        },
    }),
    async asyncData({ route }){
        let reset_code = route.query.reset_password_code
        return { reset_code }
    },
    validations: {
        form: {
            email: { required, email },
        },
        passwordForm: {
            newPassword: { required, minLength: minLength(6) },
            confirmNewPassword: { required, minLength: minLength(6), sameAsPassword: sameAs('newPassword')},
        }
    },
    methods: {
        changePasswordType(index){
            this.passwordTypes[index].type = this.passwordTypes[index].type == 'password' ? 'text' : 'password'
        },
        checkValidate(){
            this.$v.passwordForm.$touch()
            if (!this.$v.passwordForm.$invalid) {
                return true
            }
        },
        async sendMail(){
            this.$v.form.$touch()
            if(!this.$v.form.$invalid){
                this.mailError = false
                let params = {
                    'step': 1,
                    'email': this.form.email.toLowerCase().trim()
                }
                let reset_mailing = await this.$axios.$post(`/api/v1/user/reset-password/`, params, {})
                if (reset_mailing.message == 'There is no such user'){
                    this.mailError = true
                    this.mailErrorText = 'Такой почты не существует'
                } else if(reset_mailing.message == 'Message sent in the mail'){
                    this.successfullySendMail = true
                }
            } else {
                this.mailError = true
                this.mailErrorText = 'Неправильная почта'
            }
        },
        async changePassword(){ // Изменить
            this.checkValidate()
            if(this.checkValidate()){
                if (this.passwordForm) {
                    this.passwordError = false,
                    this.passwordErrorText = ''
                    let params = {
                        'step': 2,
                        'reset_password_code': this.reset_code,
                        'new_password': this.passwordForm.newPassword
                    }
                    await this.$axios.$post(`/api/v1/user/reset-password/`, params, {}).then(async res => {
                        if(res.message == 'Wrong password'){
                            this.clientPasswordErrorText = 'Ошибка при смене пароля'
                            this.clientPasswordError = true
                        } else {
                            this.user = await this.$axios.$get('/api/v1/user/me/', {
                                headers: {'Authorization': `Token ${res.token}`}
                            })
                            this.$store.state.userInfo = this.user
                            this.$store.state.userInfo.token = res.token
                            this.$cookies.set("cfid", res.token);
                            this.$cookies.set("cfut", res.user_status);
                            if(res.user_status == 'trainer' || res.user_status == 'mzo_trainer' || res.user_status == 'online_trainer'){
                                this.$router.push(this.localePath(`/trainer/clients`))
                            } else {
                                this.$router.push(this.localePath(`/client`))
                            }
                        }
                    }).catch(e => {
                        console.log(e.response)
                    })
                }
            }
        },
    },
    async beforeMount(){
        if(this.reset_code != undefined){
            try{
                let params = {
                    'reset_password_code': this.reset_code
                }
                let reset_validation = await this.$axios.$post(`/api/v1/user/check-valid-reset-code/`, params, {}).catch(e => {console.log(e.response)})
                if (reset_validation.message == 'Correct code'){
                    this.step = 2
                } else {
                    this.step = 1
                }
            } catch {
                this.step = 1
            }
        }
    },
    components: {
        InputFields: () => import('@/components/controls/Input-fields.vue'),
        Btn: () => import('@/components/controls/Btn.vue'),
    }
}
</script>

<style lang="scss">
    .reset-password{
        &__inner{
            max-width: 600px;
        }
        &__subtitle{
            p{
                margin-bottom: 20px;
                font-weight: 600;
                font-size: 14px;
                line-height: 20px;
            }
        }
        &__form{
            .input, .btn{
                width: 100%;
                max-width: 400px;
            }
            .email-input{
                margin-bottom: 20px;
            }
        }
        &__step{
            color: $light-gray-three;
            margin-bottom: 15px;
            font-weight: 600;
            font-size: 14px;
            line-height: 20px;
        }
        &__successfully-send{
            color: $blue;
            font-weight: 500;
            font-size: 20px;
            line-height: 26px;
        }
        &__password-input{
            margin-bottom: 10px;
            position: relative;
            max-width: 400px;
            .input{
                width: 100%;
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
</style>