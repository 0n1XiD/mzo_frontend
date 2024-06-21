export const strict = false

export const state = () => ({
    statistic: null,
    client_weeks: null,
    photos: null,
    day_index: null,
    week_index: null,
    start_day_index: null,
    htmlPopupContent: null
})

export const mutations = {
    addPainStatistic (state, statistic) {
      state.statistic.pain.push(statistic)
    },
    addConditionStatistic (state, statistic) {
        state.statistic.condition.push(statistic)
    },
    addPhotos (state, photo) {
        state.photos.push(photo)
    },
    setStatistic (state, statistic) {
        state.statistic = statistic
    },
    setClientWeeks (state, week) {
        state.client_weeks = week
    },
    setClientAdvancedWeeks (state, week){
        state.client_advanced_weeks = week
    },
    setPhotos (state, photos) {
        state.photos = photos
    },
    setWeekIndex (state, index) {
        state.week_index = index
    },
    setDayIndex (state, index) {
        state.day_index = index
    },
    setStartDayIndex (state, index) {
        state.start_day_index = index
    },
    setHtmlPopupContent (state, content) {
        state.htmlPopupContent = content
    },
    htmlPopupContentClose (state, popup) {
        for (let i in state.htmlPopupContent){
            if (state.htmlPopupContent[i] == popup){
                state.htmlPopupContent[i].off_popup = true
            }
        }
    },
}
