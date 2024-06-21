<template>
    <div class="faq-page">
        <div class="_container">
            <div class="faq-page__content">
                <div class="title">{{$t('faq.title')}}</div>
                <div class="info-tip">
                    {{$t('faq.tip')}}
                    <a v-if="supportLink" :href="supportLink.name" target="_blank">
                        <img src="@/assets/img/whatsapp.png" alt="whats_app">
                    </a>
                </div>
                <div class="help">
                    <div class="help__title help-item">{{$t('faq.helpTitle')}}</div>
                    <div class="help__content">
                        <div 
                            v-for="(topic, topicIndex) in topics" 
                            :key="`topic-${topic.id}`"
                            class="topic help-item"
                            :class="{'topic_active': topicIndex == activeTopicIndex}"
                        >
                            <div class="topic__name" @click="switchTopic(topicIndex)">{{ topic.name }}</div>
                            <Btn 
                                drop 
                                class="topic__button" 
                                :class="{'btn_drop_open': topicIndex == activeTopicIndex}"
                                @click="switchTopic(topicIndex)"
                            />
                            <div 
                                v-for="(question, questionIndex) in topic.faq_questions" 
                                :key="`question-${question.id}`"
                                class="questions"
                            >
                                <div 
                                    v-if="topicIndex == activeTopicIndex"
                                    class="question"
                                    :class="{'question_active': questionIndex == activeQuestionIndex}"
                                >
                                    <div class="question__row row" @click="switchQuestion(questionIndex)">
                                        <div class="question__name">{{ question.question }}</div>
                                        <img 
                                            class="question__drop" 
                                            src="@/assets/img/svg/drop-btn.svg" 
                                            alt="drop-btn"
                                            :class="{'question__drop_open': questionIndex == activeQuestionIndex}"
                                        >
                                    </div>
                                    <div 
                                        class="question__answer" 
                                        v-if="questionIndex == activeQuestionIndex" 
                                        v-html="question.answer"
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data: () => ({
      activeTopicIndex: -1,
      activeQuestionIndex: -1
    }),
    async asyncData({ store, $axios }) {
        let token = store.state.userInfo.token
        let client = store.state.userInfo
        let rate_line = client.rate.id ? `?rate_id=${client.rate.id}` : ''
        let topics = await $axios.$get(`/api/v1/site_content/get-all-topics/${rate_line}`, { 
            headers: { Authorization: `Token ${token}` }
        })
        let supportLink = await $axios.$get(`/api/v1/site_content/get-support-link/`, { 
            headers: { Authorization: `Token ${token}` }
        }).catch(e => {
            console.log(e.response)
        })
        console.log(supportLink)
        return {client, token, topics, supportLink}
    },
    methods: {
        switchTopic(index){
            this.activeQuestionIndex = -1
            if (this.activeTopicIndex != index) {
                this.activeTopicIndex = index
            } else {
                this.activeTopicIndex = -1
            }
        },
        switchQuestion(index){
            if (this.activeQuestionIndex != index) {
                this.activeQuestionIndex = index
            } else {
                this.activeQuestionIndex = -1
            }
        }
    },
    components: {
        Btn: () => import(`@/components/controls/Btn.vue`)
    }
}
</script>

<style lang="scss">
.faq-page{
    
    &__content{
        .title{
            margin-bottom: 30px;
            font-weight: 700;
            font-size: 36px;
            line-height: 44px;
        }
        .info-tip{
            display: flex;
            align-items: center;
            margin-bottom: 30px;
            padding: 15px 20px;
            background: #d1ebfd;
            border-radius: 12px;
            font-weight: 500;
            font-size: 20px;
            line-height: 150%;
            a{
                margin-left: 15px;
            }
        }
        .help{
            &-item{
                padding-bottom: 14px;
                border-bottom: 1px solid #d6dae4;
            }
            &__title{
                margin-bottom: 13px;
                font-weight: 700;
                font-size: 24px;
                line-height: 29px;
            }
            &__content{
                .topic{
                    position: relative;
                    &:not(:last-child){
                        margin-bottom: 15px;
                    }
                    &_active{
                        .topic__name{
                            padding-bottom: 10px;
                        }
                    }
                    &__button{
                        right: 0;
                        top: 0;
                        position: absolute;
                    }
                    &__name{
                        cursor: pointer;
                        font-weight: 700;
                        font-size: 22px;
                        line-height: 27px;
                    }
                    .questions{
                        margin-left: 25px;
                        .question{
                            all: revert;
                            &__drop{
                                transform: rotateX(180deg);
                                &_open{
                                    transform: rotateX(0);
                                }
                            }
                            &__row{
                                margin-bottom: 18px;
                                display: flex;
                            }
                            &__name{
                                margin-right: 10px;
                                cursor: pointer;
                                font-weight: 700;
                                font-size: 18px;
                                line-height: 22px;
                                color: #565e72;
                            }
                            &__answer{
                                width: 100%;
                                overflow: hidden;
                                img{
                                    margin-top: 10px;
                                    padding-bottom: 10px;
                                    max-width: 100% ;
                                }
                                p{
                                    margin-bottom: 25px;
                                    font-size: 16px;
                                    line-height: 130%;
                                }
                                a{
                                    cursor: pointer;
                                    color: $blue;
                                    font-size: 16px;
                                    line-height: 130%;
                                }
                            }
                            &__answer *{
                                all: revert;
                                video{
                                    width: 100%;
                                    height: 100%;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
video{
    width: 100%;
    height: 100%;
}
</style>