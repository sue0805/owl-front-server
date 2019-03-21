<template>
    <div class='study-main' v-if="ready">
        <div class='study-contents'>
            <div v-bind:key="content.title + '' + index" v-for="(content, index) in contents" class="study-content" :style="{ transform: 'translateX' + '(' + currentOffset + 'px' + ')'}">
                <a href="#" class='study-content-a' v-on:click="clickContent(content.link, content.title)">
                <div class='study-content-top' v-bind:style="{backgroundImage:'url(' + content.img + ')'}"></div>
                <div class='study-content-mid'>{{content.title}}</div>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    created(){
        this.getYoutube()
        this.$EventBus.$on('logMediaContent', this.logMediaContent)
        this.$EventBus.$on('insertYoutubeData', this.insertYoutubeData)
    },
    data(){
        return{
            currentOffset: 0,
            windowSize: 4.2,
            paginationFactor: 170,
            contents: [],
            ready: false,
            direction: 1
        }
    },
    computed: {
        atEndOfList() {
        return this.currentOffset <= (this.paginationFactor * -1) * (this.contents.length - this.windowSize)
        },
        atHeadOfList() {
        return this.currentOffset === 0
        },
        customKeyword(){
            if((!this.$store.state.koreanKeywords && !this.$store.state.etcKeywords) || this.$store.state.koreanKeywords.length + this.$store.state.etcKeywords.length < 10)
                return ['파이썬', '자바', '자바스크립트', '코틀린', 'c', 'jpa', 'springboot', 'vue', 'node', 'django']
            let customKeywords = []
            for(let i = 0 ; i < 10 ; i++){
                for(let j = 0 ; j < (10-i)/2; j++){
                    if(this.$store.state.koreanKeywords[i]) customKeywords.push(this.$store.state.koreanKeywords[i])
                    if(this.$store.state.etcKeywords[i]) customKeywords.push(this.$store.state.etcKeywords[i])
                }
            }
            customKeywords.sort(()=>{return 0.5-Math.random()})
            return customKeywords
         }
    },
    methods:{
        getYoutube(){
            const query = 
            {"query": {"bool": {"should": [] }}}
            for(let i in this.customKeyword){
                if(i > 20) break
                query.query.bool.should.push({"term":{"title": this.customKeyword[i]}})
            }
            this.$http.get(`http://13.209.160.90:9200/metadata/_search`, {
            params:{
              source: JSON.stringify(query),
              source_content_type: 'application/json',
            }})
            .then(res=>{
                for(let i of res.data.hits.hits){
                    if(!i._source.img||i._source.img.indexOf('.jpg')==-1&&i._source.img.indexOf('.png')==-1) continue
                    this.contents.push({title:i._source.title, link:i._source.link , img:i._source.img })
                }
                this.ready = true;                
            })
            .finally(() => {
            clearInterval(this.youtubeMoving)
            this.youtubeMoving = setInterval(()=>{
            this.direction = this.direction === 1 && this.atEndOfList ? -1 : this.atHeadOfList ? 1 : this.direction
            this.currentOffset += this.direction === 1 && !this.atEndOfList ? -1 : !this.atHeadOfList ? 1 : 0
          }, 30)
        })
        },
        clickContent(link, title){
            this.logMediaContent(link, title)
            window.open(link)
        },
        logMediaContent(link, title){
            const data = new FormData()
            data.append("title", title)
            data.append("link", link)
            data.append("div", "youtube")
            data.append("user", this.$store.state.email)
            this.$http.post(`http://localhost:8095/log/mediacontent/insert`, data)
        },
        insertYoutubeData(keywords){
            const getYoutubeData = keyword => {
             this.$http.get(`http://localhost:8095/search/youtube/${keyword}`).then(res =>{
                 let youtubeData = {}
                 for(let j in res.data){
                    const i = res.data[j]
                    if(!i.img || !i.title || !i.link) continue
                    const img = i.img ? i.img : null
                    const title = i.title
                    const link = i.link
                    youtubeData[j]=[title, link, img]
                 }
                this.$http({
                    method: 'POST',
                    url: `http://localhost:8095/log/metadata/youtube/insert?keyword=${keyword}`,
                    data: youtubeData,
                    headers: {'content-type': 'application/json'}
                    })
             })
            }
            for(let i of keywords){
                getYoutubeData(i)
            }
        },
    },
}
</script>