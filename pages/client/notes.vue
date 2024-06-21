<template>
    <div class="note-page">
        <div class="_container">
            <div class="note-page__notes">
                <div class="notes-row row jsb">
                    <div class="note-page__block-title notes-title">{{$t('notes.title')}}</div>
                    <Btn @click="isAddNote = true" blueBorder :name="$t('notes.createNote')"/>
                </div>
                <div class="notes" :class="{'notes_zero': notes.length == 0}">
                    <div @click="isAddNote = true" class="notes__empty" v-if="notes.length == 0">
                        <img width="46" height="46" src="@/assets/img/svg/note.svg" alt="note" class="icon">
                        <div class="title">{{$t('notes.clearTitle')}}</div>
                        <div class="subtitle">{{$t('notes.clearSubtitle')}}</div>
                    </div>
                    <div class="notes__items" v-if="notes.length > 0">
                        <div class="note-item" v-for="(note, index) in notes" :key="note.id">
                            <!-- <btn delete @click="removeNote(note.id, index)" class="note-item__delete"/> -->
                            <div 
                                class="note-item__edit-note"
                                @click="openEditNotePopup(note, index)"
                            ></div>
                            <div class="row note-item__header">
                                <div class="note-item__title">{{$t('notes.note')}}{{ index + 1 }}</div>
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
                <div class="add-note-pop-up__title" v-if="isAddNote">{{$t('notes.createNote')}}</div>
                <div class="add-note-pop-up__title" v-if="isEditNote">{{$t('notes.editNote')}}</div>
                <textarea 
                    maxlength='200'
                    class="add-note-pop-up__textarea" 
                    :placeholder="$t('notes.placeholder')"
                    v-model="noteText"
                />
                <btn v-if="isAddNote" @click="addNote()" blueBorder :name="$t('notes.createBtn')" class="add-note-pop-up__button"/>
                <btn v-if="isEditNote" @click="editNote()" blueBorder :name="$t('notes.editBtn')" class="add-note-pop-up__button"/>
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
    }),
    async asyncData({ store }) {
        let token = store.state.userInfo.token
        let client = store.state.userInfo
        let notes = client.notes.filter(function (n) {
            if (n.visible_to_client){
                return n.visible_to_client
            }
        })
        return {client, token, notes}
    },
    methods: {
        addNote(){
            let params = {
                client_id: this.client.id,
                text: this.noteText, 
                day: null,
                week: null
            }
            this.$axios.$post('/api/v1/user/add-client-note/', params, { 
                headers: { Authorization: `Token ${this.token}` } 
            }).then(response => {
                this.notes.push({id: response.id, created_at: response.created_at, text: response.text})
            }).catch(e => {
                console.log(e.response);
            })
            this.isAddNote = false
            this.noteText = ''
        },
        removeNote(id, index){
            this.$axios.$delete(`/api/v1/user/delete-client-note/?note_id=${id}`, { 
                headers: { Authorization: `Token ${this.token}` },
                data: { client_id: this.client.id }
            })
            this.notes.splice(index, 1)
        },
        closeNotePopUp(){
            this.isAddNote = false
            this.isEditNote = false
            this.noteText = ''
            this.editNoteItem = null
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
                    this.notes[this.editNoteItem.index].text = response.text
                    this.notes[this.editNoteItem.index].created_at = response.created_at
                    this.notes[this.editNoteItem.index].id = response.id
                }).catch(e => {
                    console.log(e.response)
                })
                this.isEditNote = false
                this.noteText = ''
                this.editNoteItem = null
            }
        },
    },
    components: {
        Btn: () => import('@/components/controls/Btn.vue'),
        InputFields: () => import('@/components/controls/Input-fields.vue'),
        PopupResendCode: () => import('@/components/popups/PopupResendCode.vue')
    }
}
</script>

<style lang="scss">
.note-page{
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
    .note-page{
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
    .note-page{
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
    .note-page{
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
    .note-page{
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