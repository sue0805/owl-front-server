<template>
    <div class="hot" v-if="ready">
        <div class="compHead">
            POPULAR
        </div>
        <div class="hot-wrap">
            <div class="hot-board">
                <div v-for="(hot, index) in hots" :key="hot.id" class="hot-content" :id="'hot'+index">
                    <div class="hot-content-writer-wrap" @click="showhot(index, hot)" >
                        <div class="hot-content-writer">
                            <i class="fas fa-comment" v-if="index % 2 == 0"></i>
                            <i class="far fa-comment" v-else></i>
                            <span class="hot-writer">{{hot.writer}}</span>
                        </div>
                        <span class="hot-tags" v-if="hot.tags">{{hot.tags.toUpperCase()}}</span>
                    </div>
                    <div class="hot-content-title-wrap" @click="showhot(index, hot)" >
                        <p class="hot-title">{{hot.title}}</p>
                        <span class="hot-replynum">{{hot.replies.length}}</span>
                    </div>
                    <hr>
                    <div class="hot-content-div">
                        <i :class="{ 'far fa-star' : !hot.isScrap, 'fas fa-star' : hot.isScrap }" @click="scrap(hot, index)"></i>
                        <pre><code>{{hot.content}}</code></pre>
                        <div class="hot-content-tags">
                            <span class v-for="(tag, index) in hot.tagList" :key="tag + '' + index">
                                <a v-if="tag.length != 0" @click="$EventBus.$emit('search', tag)">{{'#' + tag}}</a>
                            </span>
                        </div>
                    </div>
                    <hr>
                    <div class="hot-content-reply-wrap" v-if="show">
                        <div class="hot-content-reply" v-for="reply in hot.replies" :key="reply.reply_idx">
                            <span class="hot-reply-writer">{{reply.reply_writer}}</span>
                            <span class="hot-reply-date">{{new Date(reply.replyDate).toLocaleString()}}</span>
                            <span class="hot-reply-content"><pre><code>{{reply.reply_content}}</code></pre></span>
                        </div>
                    </div>
                    <input type="text" placeholder="악성 댓글은 상처를 남깁니다." @keyup.enter="sendReply(hot)" v-model="reply">
                </div>
            </div>
        <HotChart/>
        </div>    
    </div>  

</template>

<script>
import Chart from '../etc/Chart'

export default {
    created(){
        this.setHot()
    },
    components: {
        HotChart: Chart,
    },
    data() {
        return{
            hots:[],
            scraps: [],
            reply: '',
            ready: false,
            show: false,
        }
    },
    methods: {
        setHot(){
            this.$http.get('http://localhost:8095/question/sorted/hot').then(response => {
            this.hots = response.data;
            
            if(this.$store.state.memberScraps != null){
                this.$store.state.memberScraps.forEach(q => {
                    this.scraps.push(q.link.replace("http://localhost:8095/question/sorted?id=", ''))
                })
            }
            response.data.forEach((hot, index) => {
                hot.content = hot.content.split('<br/>').join('\n')
                hot.isScrap = this.scraps.includes(hot.id + '')
                if (hot.tags)
                hot.tagList = hot.tags.split('#')
            })

            this.ready = true

            setTimeout(() => {
                document.querySelectorAll('pre code').forEach((block) => {
                    hljs.highlightBlock(block)
                })
            }, 200)

        })
        },
        showhot(index, hot){
            let hotC = document.getElementById('hot'+index);
            if(hotC.className.indexOf('show') === -1) {
                this.show = true;
                hotC.className += ' hot-showcontent';
                this.$http.post(`http://localhost:8095/question/sorted/views/${hot.id}`)
            }
            else {
                hotC.className = 'hot-content';
                this.show = false;
            }
            this.scraps = [];
            if(this.$store.state.memberScraps != null){
                this.$store.state.memberScraps.forEach(q => {
                    this.scraps.push(q.link.replace("http://localhost:8095/question/sorted?id=", ''));
                });
            }
            hot.isScrap = this.scraps.includes(hot.id + '');
        },
        scrap(hot, index){
            if(this.$store.state.memberScraps == null){
                alert('로그인이 필요한 서비스입니다.');
                return;
            }
            if(hot.isScrap){
                this.$http({
                    method: 'delete',
                    url: `http://localhost:8095/scrap`,
                    data: {
                        link: 'http://localhost:8095/question/sorted?id=' + hot.id,
                        title: hot.title
                    },
                    params:{
                        mem_idx : this.$store.state.mem_idx
                    }
                }).then(response => {
                    hot.isScrap = false;
                    document.querySelectorAll('#hot' + index + ' i')[1].className = 'far fa-star';
                }).finally(() => {
                    this.$EventBus.$emit('refreshMember')
                });
            } else {
                this.$http({
                    method: 'post',
                    url: `http://localhost:8095/scrap`,
                    data: {
                        link: 'http://localhost:8095/question/sorted?id=' + hot.id,
                        title: hot.title
                    },
                    params:{
                        mem_idx : this.$store.state.mem_idx
                    }
                }).then(response => {
                    hot.isScrap = true;
                    document.querySelectorAll('#hot' + index + ' i')[1].className = 'fas fa-star';
                }).finally(() => {
                    this.$EventBus.$emit('refreshMember')
                });              
            }
        },
        sendReply(hot){
            if(this.$store.state.mem_idx != null){
                this.$http({
                    method: 'post',
                    url: `http://localhost:8095/question/sorted/reply`,
                    data: {
                        reply_content : this.reply,
                        reply_writer : this.$store.state.nickname,
                    },
                    params:{
                        mem_idx : this.$store.state.mem_idx,
                        id : hot.id
                    }
                }).then(response => {
                    hot.replies.push(response.data);
                    this.reply = '';
                });
            } else {
                alert('비회원은 댓글을 달 수 없습니다.');
            }
        },
    },
}
</script>