<template>
  <div class="wrapper">
    <div class="popup-first-login pop-up__content">
        <div class="popup-first-login__title pop-up__title">{{$t('firstLogin.title')}}</div>
        <div class="popup-first-login__subtitle">
            {{$t('firstLogin.subtitle1')}} <br>
            {{$t('firstLogin.subtitle2')}}
        </div>
        <div class="popup-first-login__content">
            <div class="error-text" v-if="clientPasswordError">{{ clientPasswordErrorText }}</div>
            <div class="success-text" v-if="clientPasswordSuccess">{{$t('firstLogin.changeSuccessText')}}</div>
            <div class="password-settings">
                <div class="password-settings__input">
                    <InputFields 
                        :class="{'input-error': $v.passwordForm.newPassword.$error}" 
                        :type="passwordTypes[0].type" 
                        :placeholder="$t('firstLogin.passwordPlaceholder')" 
                        v-model.trim="$v.passwordForm.newPassword.$model"
                    />
                    <img @click="changePasswordType(0)" v-if="passwordTypes[0].type == 'text'" src="@/assets/img/svg/password-show.svg" alt="show-password">
                    <img @click="changePasswordType(0)" v-if="passwordTypes[0].type == 'password'" src="@/assets/img/svg/password-hide.svg" alt="show-password">
                </div>
                <div class="password-settings__input">
                    <InputFields 
                        :class="{'input-error': $v.passwordForm.confirmNewPassword.$error}" 
                        :type="passwordTypes[1].type" 
                        :placeholder="$t('firstLogin.repeatPasswordPlaceholder')" 
                        v-model.trim="$v.passwordForm.confirmNewPassword.$model"
                    />
                    <img @click="changePasswordType(1)" v-if="passwordTypes[1].type == 'text'" src="@/assets/img/svg/password-show.svg" alt="show-password">
                    <img @click="changePasswordType(1)" v-if="passwordTypes[1].type == 'password'" src="@/assets/img/svg/password-hide.svg" alt="show-password">
                </div>
            </div>
            <Btn @click="changePassword()" blue name="Сохранить" class="lg-btn" type="submit"/>
        </div>
    </div>
  </div>
</template>

<script>
if (process.client) require('@/plugins/vue-phone-number-input.js')
import { required, sameAs, minLength } from 'vuelidate/lib/validators'

export default {
    props: {
        userInfo: {
            type: Object,
            required: true
        }
    },
    data () {
        return{
            clientPasswordError: false,
            clientPasswordErrorText: '',
            clientPasswordSuccess: false,
            passwordTypes: [
                {type: 'password'},
                {type: 'password'},
            ],
            passwordForm: {
                newPassword: '',
                confirmNewPassword: '',
            },
            settingsForm: this.userInfo
        }
    },
    validations: {
        passwordForm: {
            newPassword: { required, minLength: minLength(6) },
            confirmNewPassword: { required, minLength: minLength(6), sameAsPassword: sameAs('newPassword')},
        }
    },
    watch: {
        answer(newValue) {
            this.settingsForm = newValue // Update when the prop changes
        }
    },
    methods: {
        closeWindow(){
            let active = this.isActive
            this.$emit("close", active);
        },
        changePasswordType(index){
            this.passwordTypes[index].type = this.passwordTypes[index].type == 'password' ? 'text' : 'password'
        },
        checkValidate(){
            this.$v.passwordForm.$touch()
            if (!this.$v.passwordForm.$invalid) {
                return true
            }
        },
        async changePassword(){
            this.checkValidate()
            if(this.checkValidate()){
                if (this.passwordForm) {
                    this.clientPasswordError = false,
                    this.clientPasswordErrorText = ''
                    this.clientPasswordSuccess = false
                    let params = {
                        first_login: true,
                        new_password: this.passwordForm.newPassword,
                    }
                    let changePass = await this.$axios.$put(`/api/v1/user/change-password/`, params, {
                        headers: { Authorization: `Token ${this.userInfo.token}` },
                        "Content-Type": "multipart/form-data"
                    })
                    if(changePass.message == 'Wrong password'){
                        this.clientPasswordErrorText = this.$nuxt.$t('firstLogin.repeatPasswordPlaceholder')
                        this.clientPasswordError = true
                    } else {
                        this.$cookies.remove("cfid");
                        this.$cookies.set("cfid", changePass.token);
                        this.$store.commit('changeOrSetUserToken', changePass.token)
                        this.closeWindow()
                    }
                }
            }
        },
    },
    components: {
        Btn: () => import('@/components/controls/Btn.vue'),
        InputFields: () => import('@/components/controls/Input-fields.vue')
    }
}
</script>

<style lang="scss">
.popup-first-login{
    &__title{
        text-align: center;
    }
    &__subtitle{
        margin-bottom: 20px;
        text-align: center;
        font-size: 16px;
        font-weight: 500;
    }
    &__content{
        .password-settings{
            &__input{
                margin-bottom: 10px;
                position: relative;
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
        .error-text, .success-text{
            text-align: center;
            margin-bottom: 20px;
        }
        .btn{
            width: 100%;
        }
    }
}
</style>