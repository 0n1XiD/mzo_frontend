<template>
    <div class="client-page">
        <div class="_container">
            <div class="main__breadcrumbs">
                <img src="@/assets/img/svg/breadcrumbs-arrow.svg" alt="small-arrow">
                <nuxt-link :to="localePath(`/trainer/clients`)">
                    {{$t('trainerClientIndex.backLink')}}
                </nuxt-link> 
            </div>
            <ClientPageNav :id="client.id" :title="`${client.first_name} ${client.last_name}`"/>
            <div class="client-page__notes">
                <div class="notes-row row jsb">
                    <div class="row">
                        <div 
                            class="client-page__block-title notes-title" 
                            :class="{'active': active_note == trainer_notes}"
                            @click="changeActiveNote('trainer')"
                        >
                            {{$t('trainerClientIndex.notesTrainer')}}
                        </div>
                        <div class="client-notes-notification">
                            <div class="client-notes-notification__circle" v-if="isNotification"/>
                            <div 
                                class="client-page__block-title notes-title"
                                :class="{'active': active_note == client_notes}"
                                @click="changeActiveNote('client')"
                            >
                                {{$t('trainerClientIndex.notesClient')}}
                            </div>
                        </div>
                    </div>
                    <Btn @click="isAddNote = true" blueBorder :name="$t('trainerClientIndex.addNote')"/>
                </div>
                <div class="notes" :class="{'notes_zero': active_note.length == 0}">
                    <div @click="isAddNote = true" class="notes__empty" v-if="active_note.length == 0 && active_title_name == 'Заметки тренера'">
                        <img width="46" height="46" src="@/assets/img/svg/note.svg" alt="note" class="icon">
                        <div class="title">{{$t('trainerClientIndex.notesEmptyTrainerTitle')}}</div>
                        <div class="subtitle">{{$t('trainerClientIndex.notesEmptyTrainerSubtitle')}}</div>
                    </div>
                    <div class="notes__empty" v-if="active_note.length == 0 && active_title_name == 'Заметки клиента'">
                        <img width="46" height="46" src="@/assets/img/svg/note.svg" alt="note" class="icon">
                        <div class="title">{{$t('trainerClientIndex.notesEmptyClientTitle')}}</div>
                        <div class="subtitle">{{$t('trainerClientIndex.notesEmptyClientSubtitle')}}</div>
                    </div>
                    <div class="notes__items" v-if="active_note.length > 0">
                        <div class="note-item" v-for="(note, index) in active_note" :key="note.id">
                            <btn v-if="!note.visible_to_client" delete @click="removeNote(note.id, index)" class="note-item__delete"/>
                            <div 
                                v-if="!note.visible_to_client" 
                                class="note-item__edit-note"
                                @click="openEditNotePopup(note, index)"
                            ></div>
                            <div class="row note-item__header">
                                <div class="note-item__title">{{$t('trainerClientIndex.note')}}{{ index + 1 }}</div>
                                <div class="note-item__date">( {{note.created_at}} )</div>
                            </div>
                            <div class="note-item__text">{{note.text}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="wrapper" v-if="isAddNote || isEditNote">
            <div class="pop-up__close-bg" @click="closeNotePopUp()"></div>
            <div class="add-note-pop-up">
                <div class="pop-up__close" @click="closeNotePopUp()">
                    <img src="@/assets/img/svg/close.svg" alt="close">
                </div>
                <div class="add-note-pop-up__title" v-if="isAddNote">{{$t('trainerClientIndex.addNoteTrainer')}}</div>
                <div class="add-note-pop-up__title" v-if="isEditNote">{{$t('trainerClientIndex.editNoteTrainer')}}</div>
                <textarea 
                    maxlength='200'
                    class="add-note-pop-up__textarea" 
                    :placeholder="$t('trainerClientIndex.placeholder')"
                    v-model="noteText"
                />
                <btn v-if="isAddNote" @click="addNote()" blueBorder :name="$t('trainerClientIndex.addNoteBtn')" class="add-note-pop-up__button"/>
                <btn v-if="isEditNote" @click="editNote()" blueBorder :name="$t('trainerClientIndex.editNoteBtn')" class="add-note-pop-up__button"/>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    data: () => ({
        isAddNote: false,
        isEditNote: false,
        editNoteItem: null,
        noteText: '',
        active_title_name: 'Заметки тренера'
    }),
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
        let notes = []
        let client_notes = []
        let trainer_notes = []
        notes = client.notes
        let isNotification = false
        console.log(notes)
        for (let [_, note] of notes.entries()) {
            if (note.visible_to_client) { client_notes.push(note) } 
            else { trainer_notes.push(note)}
        }
        if (client.is_new_note) {
            isNotification = true
        }
        let active_note = trainer_notes
        return {client, token, notes, trainer_notes, client_notes, active_note, isNotification}
    },
    methods: {
        addNote(){
            if (this.noteText.trim()){
                let params = {
                    client_id: this.client.id,
                    text: this.noteText,
                    day: null,
                    week: null
                }
                this.$axios.$post('/api/v1/user/add-client-note/', params, { 
                    headers: { Authorization: `Token ${this.token}` } 
                }).then(response => {
                    let note = {id: response.id, created_at: response.created_at, text: response.text}
                    this.trainer_notes.push(note)
                    this.$store.commit('trainer/addTrainerNoteToClient', note)
                })
                this.isAddNote = false
                this.noteText = ''
                if (this.active_note == this.client_notes){
                    this.active_note = this.trainer_notes
                    this.active_title_name = 'Заметки тренера'
                }
            }
        },
        removeNote(id, index){
            this.$axios.$delete(`/api/v1/user/delete-client-note/?note_id=${id}`, { 
                headers: { Authorization: `Token ${this.token}` },
                data: { client_id: this.client.id }
            })
            this.trainer_notes.splice(index, 1)
            this.$store.commit('trainer/deleteTrainerNoteToClient', index)
        },
        openEditNotePopup(note, index){
            this.editNoteItem = note
            this.editNoteItem.index = index
            this.isEditNote = true
            this.noteText = this.editNoteItem.text
        },
        async editNote(){
            if (this.noteText.trim() && this.noteText != this.editNoteItem.text){
                let params = {
                    note_id: this.editNoteItem.id,
                    text: this.noteText
                }
                await this.$axios.$post('/api/v1/user/edit-client-note/', params, { 
                    headers: { Authorization: `Token ${this.token}` } 
                }).then(response => {
                    this.trainer_notes[this.editNoteItem.index].text = response.text
                    this.trainer_notes[this.editNoteItem.index].created_at = response.created_at
                    this.trainer_notes[this.editNoteItem.index].id = response.id

                    let note_data = {index: this.editNoteItem.index, note: this.trainer_notes[this.editNoteItem.index]}
                    this.$store.commit('trainer/editTrainerNoteToClient', note_data)

                    this.active_note = this.trainer_notes
                }).catch(e => {
                    console.log(e.response)
                })
                this.isEditNote = false
                this.noteText = ''
                this.editNoteItem = null
            }
        },
        closeNotePopUp(){
            this.isAddNote = false
            this.isEditNote = false
            this.noteText = ''
            this.editNoteItem = null
        },
        async changeActiveNote(type='trainer'){
            if (type=='client'){
                this.active_note = this.client_notes
                let params = {
                    client_id: this.client.id,
                }
                await this.$axios.$post(`/api/v1/user/set-client-is-new-note/`, params, {
                    headers: { 'Authorization': `Token ${this.token}` },
                }).catch(e => {
                    console.log(e.response)
                })
                this.isNotification = false
            } else {
                this.active_note = this.trainer_notes
            }
        }
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
    .client-notes-notification{
        padding-top: 7px;
        width: fit-content;
        height: 40px;
        position: relative;
        &__circle{
            right: -10px;
            top: 8px;
            padding: 0 4px;
            position: absolute;
            border-radius: 100%;
            width: 8px;
            height: 8px;
            color: white;
            background: red;
            font-size: 12px;
            line-height: 14px;
        }
    }
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
    &__settings{
        .resend-auth-mail{
            margin-bottom: 20px;
            font-weight: 700;
            cursor: pointer;
            color: $blue;
        }
    }
    &__notes{
        .notes-row{
            align-items: center;
            margin-bottom: 15px;
        }
        .notes-title{
            margin-bottom: 0;
            cursor: pointer;
            font-size: 18px;
            &.active{
                color: $orange;
            }
            &:hover{
                color: $orange;
                opacity: 0.8;
            }
            &:first-child{
                margin-right: 10px;
                padding-right: 10px;
                border-right: 2px solid $gray;
            }
        }
        .change-type{
            cursor: pointer;
            margin-left: 10px;
            width: 24px;
            height: 24px;
        }
        .notes-type{
            margin-top: 4px;
            font-weight: 600;
            cursor: pointer;
            color: $blue;
            margin-left: 15px;
        }
        .notes{
            &_zero{
                display: flex;
                justify-content: center;
            }
            &__empty{
                margin-top: 10px;
                cursor: pointer;
                padding: 0 20px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                width: 250px;
                height: 250px;
                border: 1px solid #D9D9D9;
                border-radius: 4px;
                .icon{
                    margin-bottom: 10px;
                }
                .title{
                    margin-bottom: 10px;
                    text-align: center;
                    font-weight: 700;
                    font-size: 14px;
                    line-height: 16px;
                }
                .subtitle{
                    font-weight: 500;
                    font-size: 14px;
                    line-height: 16px;
                    text-align: center;
                }
            }
            &__items{
                display: grid;
                grid-template-columns: repeat(auto-fill, 500px);
                grid-gap: 20px;
                .note-item{
                    position: relative;
                    width: 500px;
                    height: auto;
                    padding: 10px 15px;
                    border: 1px solid #EBEBEB;
                    border-radius: 4px;
                    &__header{
                        margin-bottom: 10px;
                    }
                    &__title{
                        font-weight: 600;
                        font-size: 20px;
                        line-height: 20px;
                    }
                    &__date{
                        margin-left: 5px;
                        font-weight: 500;
                        font-size: 16px;
                        line-height: 20px;
                        color: #9A9A9A;
                    }
                    &__delete{
                        z-index: 3;
                        position: absolute;
                        top: 10px;
                        right: 15px;
                    }
                    &__text{
                        overflow-wrap: break-word;
                        width: 90%;
                        font-weight: 500;
                        font-size: 16px;
                        line-height: 18px;
                    }
                    &__edit-note{
                        z-index: 2;
                        cursor: pointer;
                        position: absolute;
                        width: 100%;
                        height: 100%;
                    }
                }
            }
        }
        
    }
    &__line{
        border: 1px solid #EBEBEB;
        margin-bottom: 36px;
    }
    &__error{
        margin-bottom: 20px;
    }
    .add-note-pop-up{
        position: relative;
        width: 700px;
        padding: 20px;
        background: $white;
        border-radius: 15px;
        &__title{
            margin-bottom: 30px;
            text-align: center;
            font-weight: bold;
            margin-bottom: 15px;
            font-size: 28px;
        }
        &__textarea{
            margin-bottom: 10px;
            padding: 17px;
            width: 100%;
            height: 150px;
            resize: none;
            font-size: 18px;
            line-height: 21px;
            border: 1px solid #EBEBEB;
            border-radius: 8px;    
        }  
        &__button{
            float: right;
            min-width: 100px;
            height: 40px;
            font-weight: 500;
            font-size: 18px;
        }
    }
}

@media (max-width: 1200px){
    .client-page{
        &__notes{
            .notes{
                &__items{
                    grid-template-columns: repeat(auto-fill, 400px);
                    .note-item{
                        width: 400px
                    }
                }
            }
        }
    }
}

@media (max-width: 992px){
    .client-page{
        &__notes{
            .notes{
                &__items{
                    grid-template-columns: repeat(auto-fill, 350px);
                    .note-item{
                        width: 350px
                    }
                }
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
        &__notes{
            .notes{
                &__items{
                    grid-template-columns: repeat(auto-fill, 100%);
                    .note-item{
                        width: 100%;
                        margin-right: 0;
                        &__delete{
                            top: auto;
                            bottom: 10px;
                        }
                    }
                }
            }
        }
    }
}

@media (max-width: 576px){
    .client-page{
        &__notes{
            .notes-row{
                display: block;
            }
            .row{
                margin-bottom: 10px;
            }
            .notes-title{
                font-size: 16px;
            }
        }
        .add-note-pop-up{
            border-radius: 15px 15px 0 0;
            position: fixed;
            bottom: 0;
            left: 0;
            width: inherit;
            &__title{
                text-align: left;
                font-size: 22px;
            }
            &__button{
                width: 100%;
            }
        }
    }
}
</style>