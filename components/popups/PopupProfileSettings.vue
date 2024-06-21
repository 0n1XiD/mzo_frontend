<template>
  <div class="wrapper">
    <div class="pop-up__close-bg" @click="closeWindow()"></div>
    <div class="popup-profile-settings pop-up__content">
        <div class="pop-up__close" @click="closeWindow()">
            <img src="@/assets/img/svg/close.svg" alt="close">
        </div>
        <div class="popup-profile-settings__title pop-up__title">{{$t('profileSettings.title')}}</div>
        <div class="popup-profile-settings__content">
            <div class="popup-profile-settings__selection">
              <div class="select-item" :class="{'active' : !isPassword}" @click="isPassword = false">{{$t('profileSettings.data')}}</div>
              <div class="select-item" :class="{'active' : isPassword}" @click="isPassword = true">{{$t('profileSettings.password')}}</div>
            </div>
            <div class="error-text" v-if="clientDataError && !isPassword">{{$t('profileSettings.error1')}}</div>
            <div class="success-text" v-if="clientDataSuccess && !isPassword">{{$t('profileSettings.dataSuccess')}}</div>
            <div class="error-text" v-if="clientPasswordError && isPassword">{{ clientPasswordErrorText }}</div>
            <div class="success-text" v-if="clientPasswordSuccess && isPassword">{{$t('profileSettings.passwordSuccess')}}</div>
            <div class="main-settings" v-if="!isPassword">
                <InputFields 
                    v-model.trim="$v.settingsForm.email.$model"
                    :error="$v.settingsForm.email.$error"
                    default 
                    :placeholder="$t('profileSettings.placeholderEmail')"
                />
                <InputFields 
                    v-model.trim="$v.settingsForm.first_name.$model"
                    :error="$v.settingsForm.first_name.$error"
                    default 
                    :placeholder="$t('profileSettings.placeholderName')"
                />
                <InputFields 
                    v-model.trim="$v.settingsForm.last_name.$model"
                    :error="$v.settingsForm.last_name.$error"
                    default 
                    :placeholder="$t('profileSettings.placeholderSurname')"
                />
                <vue-phone-number-input
                    class="registration-new-client__phone"
                    v-model="userInfo.phone" 
                    @update="countryChanged($event)" 
                    :fetch-country="true"
                    :translations="phoneTranslations"
                    :error="!phoneError"
                />
            </div>
            <div class="password-settings" v-if="isPassword">
                <div class="password-settings__input">
                    <InputFields
                        :class="{'input-error': $v.passwordForm.oldPassword.$error}" 
                        :type="passwordTypes[0].type" 
                        :placeholder="$t('profileSettings.placeholderOldPassword')" 
                        v-model.trim="$v.passwordForm.oldPassword.$model"
                    />
                    <img @click="changePasswordType(0)" v-if="passwordTypes[0].type == 'text'" src="@/assets/img/svg/password-show.svg" alt="show-password">
                    <img @click="changePasswordType(0)" v-if="passwordTypes[0].type == 'password'" src="@/assets/img/svg/password-hide.svg" alt="show-password">
                </div>
                <div class="password-settings__input">
                    <InputFields 
                        :class="{'input-error': $v.passwordForm.newPassword.$error}" 
                        :type="passwordTypes[1].type" 
                        :placeholder="$t('profileSettings.placeholderNewPass')" 
                        v-model.trim="$v.passwordForm.newPassword.$model"
                    />
                    <img @click="changePasswordType(1)" v-if="passwordTypes[1].type == 'text'" src="@/assets/img/svg/password-show.svg" alt="show-password">
                    <img @click="changePasswordType(1)" v-if="passwordTypes[1].type == 'password'" src="@/assets/img/svg/password-hide.svg" alt="show-password">
                </div>
                <div class="password-settings__input">
                    <InputFields 
                        :class="{'input-error': $v.passwordForm.confirmNewPassword.$error}" 
                        :type="passwordTypes[2].type" 
                        :placeholder="$t('profileSettings.placeholderRepeatPass')" 
                        v-model.trim="$v.passwordForm.confirmNewPassword.$model"
                    />
                    <img @click="changePasswordType(2)" v-if="passwordTypes[2].type == 'text'" src="@/assets/img/svg/password-show.svg" alt="show-password">
                    <img @click="changePasswordType(2)" v-if="passwordTypes[2].type == 'password'" src="@/assets/img/svg/password-hide.svg" alt="show-password">
                </div>
            </div>
            <Btn @click="saveSettings()" blue :name="$t('profileSettings.saveBtn')" class="lg-btn" type="submit"/>
            <!-- <Btn v-if="!isPassword" @click="isResetWeeks = true" blueBorder :name="$t('profileSettings.resetWeeksBtn')" type="submit"/> -->
        </div>
    </div>
    <!-- <PopupResetWeeks
        v-if="isResetWeeks"
        @resetWeeksConfirm="resetWeeks()"
        @close="isResetWeeks = false"
    /> -->
  </div>
</template>

<script>
if (process.client) require('@/plugins/vue-phone-number-input.js')
import { required, email, sameAs, minLength, helpers } from 'vuelidate/lib/validators'
const isRussianAlpha = helpers.regex('isRussianAlpha',/^[а-яa-z]*$/i)

export default {
    props: {
        userInfo: {
            type: Object,
            required: true
        }
    },
    data: function() {
        return{
            isResetWeeks: false,
            isPassword: false,
            phoneError: false,
            phoneTranslations:{
                countrySelectorLabel: this.$nuxt.$t('profileSettings.placeholderPhone1'),
                countrySelectorError: this.$nuxt.$t('profileSettings.placeholderPhone2'),
                phoneNumberLabel: this.$nuxt.$t('profileSettings.placeholderPhone3'),
                example: this.$nuxt.$t('profileSettings.placeholderPhone4')
            },
            clientDataError: false,
            clientDataSuccess: false,
            clientPasswordError: false,
            clientPasswordErrorText: '',
            clientPasswordSuccess: false,
            passwordTypes: [
                {type: 'password'},
                {type: 'password'},
                {type: 'password'},
            ],
            passwordForm: {
                oldPassword: '',
                newPassword: '',
                confirmNewPassword: '',
            },
            error: false,
            settingsForm: this.userInfo
        }
    },
    validations: {
        settingsForm: {
            first_name: {
                required,
                isRussianAlpha,
                minLength: minLength(2)
            },
            last_name: {
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
            oldPassword: { required },
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
        countryChanged(e) {
            try{
                this.phonePayload = e
                if(e.isValid != undefined){
                    this.phoneError = e.isValid
                }
            } catch {
                this.phonePayload.isValid = false
                this.phoneError = true
            }
        },
        changePasswordType(index){
            this.passwordTypes[index].type = this.passwordTypes[index].type == 'password' ? 'text' : 'password'
        },
        updateUserInfo(){
            try{
                let haveChanges = true
                this.$v.settingsForm.$touch()
                if(this.phonePayload.isValid && !this.$v.settingsForm.$invalid && haveChanges){
                    this.clientDataError = false
                    const user_form = new FormData();
                    user_form.append('email', this.settingsForm.email.toLowerCase().trim());
                    user_form.append('first_name', this.settingsForm.first_name);
                    user_form.append('last_name', this.settingsForm.last_name);
                    user_form.append('phone', this.settingsForm.phone);
                    this.$axios.$put(`/api/v1/user/change-user-info/`, user_form, { 
                        headers: { Authorization: `Token ${this.userInfo.token}` } 
                    }).catch(e => {
                        this.clientDataError = true
                    })
                    this.userInfo.first_name = this.settingsForm.first_name
                    this.userInfo.last_name = this.settingsForm.last_name
                    this.clientDataSuccess = true
                } else {
                    this.clientDataError = true
                }
            }
            catch {
                
            }
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
                        new_password: this.passwordForm.newPassword.trim(),
                        current_password: this.passwordForm.oldPassword.trim()
                    }
                    let changePass = await this.$axios.$put(`/api/v1/user/change-password/`, params, {
                        headers: { Authorization: `Token ${this.userInfo.token}` },
                        "Content-Type": "multipart/form-data"
                    })
                    if(changePass.message == 'Wrong current password'){
                        this.clientPasswordErrorText = this.$nuxt.$t('profileSettings.error2')
                        this.clientPasswordError = true
                    } else if(changePass.message === 'Current and new password match'){
                        this.clientPasswordErrorText = this.$nuxt.$t('profileSettings.error3')
                        this.clientPasswordError = true
                    } else{
                        this.$cookies.remove("cfid");
                        this.$cookies.set("cfid", changePass.token);
                        this.$store.commit('changeOrSetUserToken', changePass.token)
                        this.clientPasswordErrorText = ''
                        this.clientPasswordError = false
                        this.clientPasswordSuccess = true
                    }
                }
            }
        },
        saveSettings(){
            if(this.isPassword){
                this.changePassword()
            } else {
                this.updateUserInfo()
            }
        },
        async resetWeeks(){
            await this.$axios.$post(`/api/v1/user/reset-all-weeks/`, {}, {
                headers: { 'Authorization': `Token ${this.userInfo.token}` }
            }).catch(e => {
                console.log(e.response)
            })
            window.location.href = this.localePath('/client')
        }
    },
    components: {
        Btn: () => import('@/components/controls/Btn.vue'),
        InputFields: () => import('@/components/controls/Input-fields.vue'),
        // PopupResetWeeks: () => import(`@/components/popups/PopupResetWeeks.vue`),
    }
}
</script>

<style lang="scss">
.popup-profile-settings{
    &__title{
        text-align: center;
    }
    &__selection{
      margin-bottom: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      .select-item{
        cursor: pointer;
        padding-bottom: 5px;
        border-bottom: 1px solid $gray;
        text-align: center;
        width: 50%;
        font-weight: 500;
        &.active{
          font-weight: 600;
          border-bottom: 2px solid $orange;
        }
        &:hover{
          opacity: 0.6;
          font-weight: 700;
          border-bottom: 2px solid $orange;
        }
      }
    }
    &__content{
        .main-settings{
            .input{
                width: 100%;
                margin-bottom: 10px;
            }
        }
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
        .lg-btn{
            margin-bottom: 10px;
        }
        .btn{
            width: 100%;
        }
    }
}
</style>