<template>
    <div class="data-main" v-if="ready">        
        <div class='data-contents'>  
            <div v-bind:key="content + '' +index" v-for="(content, index) in lectures" class="data-content" :style="{ transform: 'translateX' + '(' + currentOffset + 'px' + ')'}">
                <a href="#" class='data-content-a' v-on:click="clickContent(content.link, content._source.title)">
                <div class='data-content-top' v-bind:style="{backgroundImage:'url(' + content.img + ')'}"></div>
                <div class='data-content-mid'>{{content.title}}</div>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    created(){
        this.getYoutube();
    },
    data(){
        return{
            /* 유튜브 움직임 구현 구간 */
            currentOffset: 0,
            windowSize: 4.2,
            paginationFactor: 170,
            direction: 1,

            lectures: [], // 유튜브 데이터 리스트
            ready: false, // 데이터가 준비되면 true로 전환해서 화면에 표시
        }
    },
    computed: {
        atEndOfList() {
            return this.currentOffset <= (this.paginationFactor * -1) * (this.lectures.length - this.windowSize);
        },
        atHeadOfList() {
            return this.currentOffset === 0;
        }
    },
    methods: {
        getYoutube(){
            const query = 
            {
                "query": {
                    "match": {
                    "title": this.$store.state.searchKeyword
                    }
                }
            }
            this.$http.get(`http://13.209.160.90:9200/metadata/_search`, {
                params:{
                    source: JSON.stringify(query),
                    source_content_type: 'application/json',
                }, 
            }).then(res => {
                if(res.data.hits.total < 10){ // 자체 데이터의 결과가 10개 미만일 경우 유튜브 크롤링
                    this.YoutubeCrawling()
                } else {
                    for(let i of res.data.hits.hits){
                        if(!i._source.img||i._source.img.indexOf('.jpg')==-1&&i._source.img.indexOf('.png')==-1) continue
                        this.lectures.push({title:i._source.title, link:i._source.link , img:i._source.img })
                    }
                    this.ready = true;
                }
            }).finally(() => {
            clearInterval(this.youtubeMoving)
            this.youtubeMoving = setInterval(()=>{
            this.direction = this.direction === 1 && this.atEndOfList ? -1 : this.atHeadOfList ? 1 : this.direction
            this.currentOffset += this.direction === 1 && !this.atEndOfList ? -1 : !this.atHeadOfList ? 1 : 0
          }, 30)
        })
        },
        YoutubeCrawling(){
            this.$http.get(`http://localhost:8095/search/youtube/${this.$store.state.searchKeyword}`).then(res => {
                this.lectures = res.data;
                this.ready = true;
        })
        },
        clickContent(link, title){
            this.$EventBus.$emit('logMediaContent', link, title)
            window.open(link)
        },
    },
}
</script>
