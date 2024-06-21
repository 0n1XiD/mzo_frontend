<script>
import {Line} from "vue-chartjs";
export default {
    extends: Line,
    props: {
        chartData: {
            type: Object,
            default: () => {}
        },
        chartOptions: {
            type: Object,
            default: () => {}
        }
    },
    mounted(){
        this.renderChart(this.chartData, this.options);
    }
}
</script>

<style lang="scss">

</style>