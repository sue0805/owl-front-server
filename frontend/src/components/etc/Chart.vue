<template>
    <div class="hot-chart-wrap">
        <apexcharts type=bar class="hot-chart" height='200px' width='100%' :options="chartOptions" :series="series"></apexcharts>
    </div>
</template>

<script>
import store from '../../store'
import VueApexCharts from 'vue-apexcharts'

export default {
    created() {
        this.setChartData()
        window.chart = this
    },
    components: {
      apexcharts: VueApexCharts,
    },
    data() {
        return {
             chartOptions: {
                chart: {
                    height: '200px',
                    width: '300px',
                    type: 'bar',
                    id: 'Hot-Keywords',
                    events: {
                        dataPointSelection(event, chartContext, config) {
                            const label = chartContext.w.globals.labels[config.dataPointIndex]
                            store.dispatch('SET_SEARCH_KEYWORD', label)
                            chart.$EventBus.$emit('goLoadingPage');
                        }
                    },
                },
                theme: {
                    palette: 'palette3'
                },
                plotOptions: {
                    bar: {
                        columnWidth: '80%',
                        distributed: true,
                        dataLabels: {
                            position: 'top'
                        }
                    }
                },
                animations: {
                    enabled: false,
                    dynamicAnimation: {
                        enabled: true,
                        speed: 2000
                    }
                },
                dataLabels: {
                    enabled: true,
                    formatter(val, opt){
                        return opt.w.globals.labels[opt.dataPointIndex];
                    },
                    textAnchor: 'middle',
                    dropShadow: {
                        enabled: true,
                        left: 1,
                        top: 1,
                        opacity: 0.3
                    },
                    style: {
                        colors: ['#eee']
                    }
                },
                xaxis: {  
                    categories: [''],
                    labels:{
                        show: false,
                        style:{
                            fontSize: '8px'
                        }
                    }
                },
                yaxis: {
                    labels:{
                        show: false
                    }
                }
            },
            series: [{
                name: '검색',
                data: [10],
            }],
            title: {
                text: "Line with Annotations",
                align: "left"
            },
        }
    },
    methods: {
        setChartData(){
            let dataList = []
            const query = 
                {
                "query": {
                    "match_all": {}
                },
                "aggregations": {
                    "keyword": {
                    "terms": {
                        "field": "keyword",
                        "size": 10
                       }
                    }
                   }
                }
            this.$http.get(`http://13.209.160.90:9200/koreankeyword/_search`, {
                params:{
                    source: JSON.stringify(query),
                    source_content_type: 'application/json',
                }, 
            }).then( reskor => {
                dataList = reskor.data.aggregations.keyword.buckets
                this.$http.get(`http://13.209.160.90:9200/etckeyword/_search`, {
                    params:{
                        source: JSON.stringify(query),
                        source_content_type: 'application/json',
                    }, 
                }).then( resetc => {
                    dataList=[...dataList, ...resetc.data.aggregations.keyword.buckets]
                    dataList.sort((a, b) => {return b.doc_count-a.doc_count})
                    let seriesData = []
                    let categories = []
                    let fullCount=0
                    for(let i of dataList.slice(0, 5)){
                        seriesData.push(i.doc_count)
                        categories.push(i.key)
                        fullCount+=i.doc_count
                    }
                    seriesData = seriesData.map(num => { return (num / fullCount * 100).toFixed(2)})
                    this.series = [{
                     data: seriesData
                     }]
                    this.chartOptions = {...this.chartOptions, ...{
                        xaxis: {
                            categories: categories
                        }
                    }}
                })
            })

        }
    },
}
</script>