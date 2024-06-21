export const strict = false

export const state = () => ({
    clients: [],
    current_client: null,
    client_weeks: null
})

export const mutations = {
    addPainStatistic (state, statistic) {
      state.statistic.push(statistic)
    },
    addConditionStatistic (state, statistic) {
        state.statistic.push(statistic)
    },
    setClientWeeks (state, week) {
        state.client_weeks = week
    },
    setClientAdvancedWeeks (state, week){
        state.client_advanced_weeks = week
    },
    setClientInfo (state, client) {
        state.current_client = client
    },
    resetClientinfo(state){
        state.current_client = null
        state.client_weeks = null
    },
    addTrainerNoteToClient(state, note) {
        if (state.current_client) {
            state.current_client.notes.push(note)
        }
    },
    deleteTrainerNoteToClient(state, note_index) {
        if (state.current_client) {
            state.current_client.notes.splice(note_index, 1)
        }
    },
    editTrainerNoteToClient(state, data) {
        if (state.current_client) {
            state.current_client.notes[data.index] = data.note
        }
    }
}