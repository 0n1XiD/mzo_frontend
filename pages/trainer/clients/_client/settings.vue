<template>
    <div class="client-page">
        <div class="_container">
            <div class="main__breadcrumbs">
                <img src="@/assets/img/svg/breadcrumbs-arrow.svg" alt="small-arrow">
                <nuxt-link :to="localePath(`/trainer/clients`)">
                    {{$t('trainerSettings.backLink')}}
                </nuxt-link> 
            </div>
            <ClientPageNav :id="client.id" :title="`${client.first_name} ${client.last_name}`"/>
            <div class="client-page__main-info">
                <div class="client-page__block-title">{{$t('trainerSettings.infoTitle')}}</div>
                <div class="error-text client-page__error" v-if="clientDataError">{{$t('trainerSettings.error')}}</div>
                <form v-if="isBrowser" class="form" id="clientPageSettingsForm" method="POST" name="clientPageSettingsForm" onsubmit="return false">
                    <InputFields 
                        v-model.trim="$v.settingsForm.email.$model"
                        :error="$v.settingsForm.email.$error"
                        default 
                        :placeholder="$t('trainerSettings.placeholderEmail')"
                    />
                    <InputFields 
                        v-model.trim="$v.settingsForm.firstName.$model"
                        :error="$v.settingsForm.firstName.$error"
                        default 
                        :placeholder="$t('trainerSettings.placeholderName')"
                    />
                    <InputFields 
                        v-model.trim="$v.settingsForm.lastName.$model"
                        :error="$v.settingsForm.lastName.$error"
                        default 
                        :placeholder="$t('trainerSettings.placeholderSurname')"
                    />
                    <vue-phone-number-input
                        class="registration-new-client__phone"
                        v-model="settingsForm.phone" 
                        @update="countryChanged($event)" 
                        :fetch-country="true"
                        :translations="phoneTranslations"
                        :error="!phoneError"
                    />
                    <button @click="updateClientInfo()" :id="`ClientPageSettingsButton`" type="submit" class="btn btn_blue">{{$t('trainerSettings.saveChangeBtn')}}</button>
                </form>
                <div v-else>
                    <InputFields v-model="settingsForm.email" default :placeholder="$t('trainerSettings.placeholderSurname')"/>
                    <InputFields v-model="settingsForm.firstName" default :placeholder="$t('trainerSettings.placeholderName')"/>
                    <InputFields v-model="settingsForm.lastName" default :placeholder="$t('trainerSettings.placeholderSurname')"/>
                    <button @click="updateClientInfo()" :id="`ClientPageSettingsButton`" type="submit" class="btn btn_blue">{{$t('trainerSettings.saveChangeBtn')}}</button>
                </div>
            </div>
            <div class="client-page__settings">
                <div class="client-page__block-title">{{$t('trainerSettings.additionalTitle')}}</div>
                <div class="resend-auth-mail" @click="resendAuth = true">{{$t('trainerSettings.resendBtn')}}</div>
                <div class="password-settings">
                    <div class="password-settings__input">
                        <InputFields 
                            :class="{'input-error': $v.passwordForm.newPassword.$error}" 
                            :type="passwordTypes[0].type" 
                            :placeholder="$t('trainerSettings.placeholderNewPass')" 
                            v-model.trim="$v.passwordForm.newPassword.$model"
                        />
                        <img @click="changePasswordType(0)" v-if="passwordTypes[0].type == 'text'" src="@/assets/img/svg/password-show.svg" alt="show-password">
                        <img @click="changePasswordType(0)" v-if="passwordTypes[0].type == 'password'" src="@/assets/img/svg/password-hide.svg" alt="show-password">
                    </div>
                    <div class="password-settings__input">
                        <InputFields 
                            :class="{'input-error': $v.passwordForm.confirmNewPassword.$error}" 
                            :type="passwordTypes[1].type" 
                            :placeholder="$t('trainerSettings.placeholderRepeatPass')" 
                            v-model.trim="$v.passwordForm.confirmNewPassword.$model"
                        />
                        <img @click="changePasswordType(1)" v-if="passwordTypes[1].type == 'text'" src="@/assets/img/svg/password-show.svg" alt="show-password">
                        <img @click="changePasswordType(1)" v-if="passwordTypes[1].type == 'password'" src="@/assets/img/svg/password-hide.svg" alt="show-password">
                    </div>
                    <button @click="changePassword()" :id="`ClientPageSettingsButton`" type="submit" class="btn btn_blue">{{$t('trainerSettings.changeBtn')}}</button>
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
                        <div class="title">{{$t('trainerSettings.error1')}}</div>
                    </div>
                </div>
            </div>
            <div class="submit-response" v-if="this.submitResponse == 'OK'">
                <div class="row">
                    <div class="submit-response__picture">
                        <img src="@/assets/img/svg/sent_by.svg" alt="sent_by">
                    </div>
                    <div class="submit-response__description">
                        <div class="title">{{$t('trainerSettings.success1')}}</div>
                    </div>
                </div>
            </div>

            <div class="submit-response" v-if="this.submitResponse == 'PASSERROR'">
                <div class="row">
                    <div class="submit-response__picture">
                        <img src="@/assets/img/svg/cancel.svg" alt="cancel">
                    </div>
                    <div class="submit-response__description">
                        <div class="title">{{$t('trainerSettings.error2')}}</div>
                    </div>
                </div>
            </div>
            <div class="submit-response" v-if="this.submitResponse == 'PASSOK'">
                <div class="row">
                    <div class="submit-response__picture">
                        <img src="@/assets/img/svg/sent_by.svg" alt="sent_by">
                    </div>
                    <div class="submit-response__description">
                        <div class="title">{{$t('trainerSettings.success2')}}</div>
                    </div>
                </div>
            </div>
        </transition>

        <PopupResendCode
            v-if="resendAuth"
            :email="client.email"
            :firstName="client.first_name"
            :lastName="client.last_name"
            @close="resendAuth = false"
            @resend="resendAuthCode()"
        />

    </div>
</template>

<script>
if (process.client) require('@/plugins/vue-phone-number-input.js')
import { required, email, minLength, helpers, sameAs } from 'vuelidate/lib/validators'
const isRussianAlpha = helpers.regex('isRussianAlpha',/^[а-яa-z]*$/i)

export default {
    data: function() {
        return{
            phoneError: false,
            phoneTranslations:{
                countrySelectorLabel: this.$nuxt.$t('trainerSettings.placeholderPhone1'),
                countrySelectorError: this.$nuxt.$t('trainerSettings.placeholderPhone2'),
                phoneNumberLabel: this.$nuxt.$t('trainerSettings.placeholderPhone3'),
                example: this.$nuxt.$t('trainerSettings.placeholderPhone4')
            },
            clientDataError: false,
            isBrowser: false,
            resendAuth: false,
            submitResponse: '',
            passwordTypes: [
                {type: 'password'},
                {type: 'password'},
            ],
            passwordForm: {
                newPassword: '',
                confirmNewPassword: '',
            },
        }
    },
    async asyncData({ params, $axios, store }) {
        let token = store.state.userInfo.token
        let client = null
        if(store.state.trainer.current_client){
            client = store.state.trainer.current_client
        } else {
            client = await $axios.$get(`/api/v1/user/get-client/?client_id=${params.client}`, {
                headers: { 'Authorization': `Token ${token}` },
            })
            store.commit('trainer/setClientInfo', client)
        }
        let settingsForm = {
            email: '',
            firstName: '',
            lastName: '',
            phone: ''
        }
        settingsForm.email = client.email
        settingsForm.firstName = client.first_name
        settingsForm.lastName = client.last_name
        settingsForm.phone = client.phone
        return {client, settingsForm, token}
    },
    mounted () {
        this.isBrowser = process.browser
    },
    validations: {
        settingsForm: {
            firstName: {
                required,
                isRussianAlpha,
                minLength: minLength(2)
            },
            lastName: {
                required,
                isRussianAlpha,
                minLength: minLength(2)
            },
            email: {
                required,
                email
            },
        },
        passwordForm: {
            newPassword: { required, minLength: minLength(6) },
            confirmNewPassword: { required, minLength: minLength(6), sameAsPassword: sameAs('newPassword')},
        }
    },
    methods: {
        updateClientInfo(){
            let haveChanges = false
            if(
                this.settingsForm.email != this.client.email || 
                this.settingsForm.firstName != this.client.firstname ||
                this.settingsForm.lastName != this.client.lastname || 
                this.settingsForm.phone != this.client.phone
            ) {
                haveChanges = true
            } else {
                return;
            }
            if(this.phonePayload.isValid && !this.$v.settingsForm.$invalid && haveChanges){
                this.clientDataError = false
                const user_form = new FormData();
                user_form.append('user_id', this.client.id);
                user_form.append('email', this.settingsForm.email.toLowerCase().trim());
                user_form.append('first_name', this.settingsForm.firstName);
                user_form.append('last_name', this.settingsForm.lastName);
                user_form.append('phone', this.settingsForm.phone);
                this.$axios.$put(`/api/v1/user/change-user-info/`, user_form, { 
                    headers: { Authorization: `Token ${this.token}` } 
                }).catch(e => {
                    console.log('error change user info')
                })
                this.client.firstname = this.settingsForm.firstName
                this.client.lastname = this.settingsForm.lastName
            } else {
                this.clientDataError = true
            }
        },
        countryChanged(e) {
            this.phonePayload = e
            if(e.isValid != undefined){
                this.phoneError = e.isValid
            }
        },
        async resendAuthCode(){
            this.resendAuth = false
            let form_data= {
                'client_id': this.client.id
            }
            await this.$axios.$post('/api/v1/user/resend-auth-code/', form_data, { 
                headers: { Authorization: `Token ${this.token}` }
            }).then(res => {
                setTimeout(() => {
                    this.submitResponse = 'OK'
                    setTimeout(() => {
                        this.submitResponse = ''
                    }, 4000)
                },)
            }).catch(e => {
                setTimeout(() => {
                    this.submitResponse = 'ERROR'
                    setTimeout(() => {
                        this.submitResponse = ''
                    }, 4000)
                },)
            })
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
                    let params = {
                        user_id: this.client.id,
                        change_for_client: true,
                        client_password: this.passwordForm.newPassword.trim(),
                    }
                    await this.$axios.$put(`/api/v1/user/change-password/`, params, {
                        headers: { Authorization: `Token ${this.token}` },
                        "Content-Type": "multipart/form-data"
                    }).then(res => {
                        this.passwordForm = {
                            newPassword: '',
                            confirmNewPassword: '',
                        }
                        setTimeout(() => {
                            this.submitResponse = 'PASSOK'
                            setTimeout(() => {
                                this.submitResponse = ''
                            }, 4000)
                        },)
                    }).catch(e => {
                        setTimeout(() => {
                            this.submitResponse = 'PASSERROR'
                            setTimeout(() => {
                                this.submitResponse = ''
                            }, 4000)
                        },)
                    }).catch(e => {})
                }
            }
        },
    },
    components: {
        Btn: () => import('@/components/controls/Btn.vue'),
        InputFields: () => import('@/components/controls/Input-fields.vue'),
        ClientPageNav: () => import('@/components/client-page-nav.vue'),
        PopupResendCode: () => import('@/components/popups/PopupResendCode.vue')
    }
}
</script>
<style lang="scss">
.client-page{
    &__block-title{
        margin-bottom: 15px;
        font-weight: 700;
        font-size: 24px;
        line-height: 28px;
    }
    &__main-info{
        max-width: 360px;
        width: 360px;
        margin-bottom: 36px;
        .input{
            &:not(:last-child){
                margin-bottom: 15px;
            }
        }
        .input, .btn{
            width: 100%;
        }
    }
    &__error{
        margin-bottom: 20px;
    }
    .password-settings{
        .btn{
            max-width: 360px;
            width: 100%;
        }
        &__input{
            margin-bottom: 10px;
            position: relative;
            max-width: 360px;
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
}
@media (max-width: 768px){
    .client-page{
        &__main-info{
            width: 100%;
            max-width: 100%;
            .input, .btn{
                width: 100%;
            }
        }
        .password-settings{
            &__input, .btn{
                max-width: 100%;
            }
        }
    }
}
</style>