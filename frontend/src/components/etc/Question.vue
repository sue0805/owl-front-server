<template>
    <div class="question-askbox" v-if="ready">
    <i class="fas fa-times question-close" @click="close"></i>
    <div class="question-askbox-wrap">
        <div class='question-view'>
            <input type="hidden" id="question-question-id"/>
            <i class="far fa-star" v-if="!this.isScrap" @click="scrap"></i>
            <i class="fas fa-star" v-if="this.isScrap" @click="scrap"></i>
            <span class='question-comp-info-writer'>
                {{question.writer}}
            </span>
            <i v-if="question.member !== null && $store.state.mem_idx == question.member.idx" class="fas fa-trash-alt" @click="deleteSth(question)"></i>
            <span class='question-comp-info-date'>
                {{new Date(question.date).toLocaleString()}}
            </span>
            <p class='question-comp-title'>
                {{question.title}}
            </p>
            <div class='question-comp-content'>
                <pre><code>{{question.content}}</code></pre>
            </div>
            <span class='question-comp-tags'>
                <span v-for="(tag, index) in tags" :key="tag +''+ index" @click="$EventBus.$emit('search', tag.replace('#', '')); close();">
                    {{tag}}    
                </span>    
            </span>      
        </div>
         <div class="question-content-reply-wrap">
            <div class="question-reply-wrap">
                <div :class='{"question-content-reply" : reply.selected === 0, "question-content-reply question-selected" : reply.selected === 1}' v-for="(reply, index) in replies" :key="reply.reply_idx + 'rep'">
                    <span class="question-reply-writer">{{reply.reply_writer}}</span>
                    <i v-if="$store.state.mem_idx == reply.member.idx" class="far fa-edit question-reply-i" @click="edit(index)"></i>
                    <i v-if="$store.state.mem_idx == reply.member.idx" class="fas fa-trash-alt question-reply-i" @click="deleteSth(reply)"></i>
                    <i class="far fa-check-circle question-reply-i question-green" 
                     v-if="question.member.idx === $store.state.mem_idx && typeCode === 0 && reply.member.idx !== $store.state.mem_idx "><!--  && reply.member.idx !== $store.state.mem_idx -->
                        <span class="question-check" @click="selectReply(reply)"> 채택하기 </span>
                    </i>
                    <span class="question-reply-date">{{new Date(reply.replyDate).toLocaleString()}}</span>
                    <span class="question-reply-content"><pre><code>{{reply.reply_content}}</code></pre></span>
                    <div class="question-hidden question-reply-content" :id="'question-' + index">
                        <textarea class="question-reply-content question-reply-textarea" :value="reply.reply_content" :id="'question-reply-' + index"></textarea>
                        <i class="far fa-paper-plane question-send-sub" @click="sendReply(reply, index)"></i>
                    </div>
                </div>
            </div>
            <textarea class="question-reply-input" placeholder="악성 댓글은 상처를 남깁니다." v-model="reply_new"></textarea>
            <i class="far fa-paper-plane question-send-main" @click="sendReply()"></i>
        </div>
    </div>
</div>
</template>

<script>
export default {
        created(){
        if(this.typeCode === 0 || this.typeCode === 1){
            this.question =  this.data
            this.question.content = this.question.content.split('<br/>').join('\n')
            this.checkScrap()
            this.goReady()
        }
        else if(this.typeCode === 2){
            if(this.data.unsolvedQuestion != null) {
                this.$http.get(`http://localhost:8095/question/unsolved/find/${this.data.unsolvedQuestion.id}`).then(res => {
                    this.typeCode = 0
                    res.data.type = 0
                    this.question = res.data
                    this.question.content = this.question.content.split('<br/>').join('\n')
                    this.checkScrap()
                    this.goReady()
                })
            } else if(this.data.sortedQuestion != null) {
                this.$http.get(`http://localhost:8095/question/sorted?id=${this.data.sortedQuestion.id}`).then(res => {
                    this.typeCode = 1
                    res.data.type = 1
                    this.question = res.data
                    this.question.content = this.question.content.split('<br/>').join('\n')
                    this.checkScrap()
                    this.goReady()
                })
            }
        }
        window.replies = this.replies 
    },
    props: ['data'],
    data(){
        return{
            typeCode: this.data.type,
            reply_new: '',
            isScrap: false,
            question: null,
            ready: false,
        }
    },
    computed: {
        tags(){
            let tmp = []
            if(this.question.tags == null) return tmp
            this.question.tags.split('#').forEach(tag => {
                if(tag.trim().length != 0){
                    tmp.push('#' + tag)
                }
            })
            return tmp
        },
        replies(){
            if(this.question == null) return []
            if(this.question.replies == null || this.question.replies.length == 0) return []
            
            this.question.replies.forEach((reply, index) => {
                reply.reply_content = reply.reply_content.split('<br/>').join('\n')
                if(reply.selected === 1){
                    this.question.replies.splice(index, 1)
                    this.question.replies.unshift(reply)
                }
            })
            return this.question.replies
        }
    },
    methods: {
        close(){
            this.ready = false
            this.$EventBus.$emit('closeRead')
        },
        checkScrap(){
            let url = ''
            if (this.typeCode === 0) url ='http://localhost:8095/question/unsolved/find/'
            else if(this.typeCode === 1) url= 'http://localhost:8095/question/sorted?id='
            else {
                if(this.data.unsolvedQuestion != null) url ='http://localhost:8095/question/unsolved/find/'
                else if(this.data.sortedQuestion != null) url= 'http://localhost:8095/question/sorted?id='
            }
            let scraps = []
            if(this.$store.state.memberScraps != null){
                this.$store.state.memberScraps.forEach(q => {
                    scraps.push(q.link.replace(url, ''))
                })
            }
            this.isScrap = scraps.includes(this.question.id + '')
        },
        goReady(){
            this.ready = true
            setTimeout(() => {
                document.querySelectorAll('pre code').forEach((block) => {
                    hljs.highlightBlock(block)
                })
            }, 100)
        },
        edit(index){
            let re = document.querySelector('#question-' + index)
            if(re.style.display.indexOf('inline-block') == -1){
                re.style.display = 'inline-block'
                re.previousElementSibling.style.display = "none"
            } else {
                re.style.display = 'none'
                re.previousElementSibling.style.display = "inline-block"
            }
        },
        scrap(){
            if(this.$store.state.memberScraps == null){
                alert('로그인이 필요한 서비스입니다.')
                return
            }
            let url = ''
            if (this.typeCode === 0) url ='http://localhost:8095/question/unsolved/find/'
            else if(this.typeCode === 1) url= 'http://localhost:8095/question/sorted?id='

            if(this.isScrap){                
                this.$http({
                    method: 'delete',
                    url: `http://localhost:8095/scrap`,
                    data: {
                        link: url + this.question.id,
                        title: this.question.title
                    },
                    params:{
                        mem_idx : this.$store.state.mem_idx
                    }
                }).then(response => {
                    this.isScrap = false
                }).finally(() => {
                    this.$EventBus.$emit('refreshMember')
                });

            } else {
                this.$http({
                    method: 'post',
                    url: `http://localhost:8095/scrap`,
                    data: {
                        link: url + this.question.id,
                        title: this.question.title
                    },
                    params:{
                        mem_idx : this.$store.state.mem_idx
                    }
                }).then(response => {
                    this.isScrap = true
                }).finally(() => {
                    this.$EventBus.$emit('refreshMember')
                });
                
            }
        },
        deleteSth(sth){
            let url = ''          
            let ok = window.confirm("정말 삭제 하시겠습니까?")
            if(!ok) return;

            if(sth.sortedQuestion != null) url = 'http://localhost:8095/question/sorted/reply'
            else if(sth.unsolvedQuestion != null) url = 'http://localhost:8095/question/unsolved/reply'
            else if(this.typeCode === 0) url = 'http://localhost:8095/question/unsolved'
            else if(this.typeCode === 1) url = 'http://localhost:8095/question/sorted'
            this.$http({
                method: 'delete',
                url: url,
                data: sth
            }).then(res => {
                if(res.data === 0){
                    console.log('삭제 실패')
                } else {
                    console.log('삭제 성공')
                    if(sth.sortedQuestion != null) {
                        this.$store.state.sortedQuestionReplies.splice(this.$store.state.sortedQuestionReplies.indexOf(sth), 1)
                        this.question.replies.splice(this.question.replies.indexOf(sth), 1)
                    } else if(sth.unsolvedQuestion != null) {
                        this.$store.state.unsolvedQuestionReplies.splice(this.$store.state.unsolvedQuestionReplies.indexOf(sth), 1)
                        this.question.replies.splice(this.question.replies.indexOf(sth), 1)
                    } else {
                        if(this.typeCode === 0) this.$store.state.unsolvedQuestions.splice(this.$store.state.unsolvedQuestions.indexOf(sth), 1)
                        else if(this.typeCode === 1) this.$store.state.sortedQuestions.splice(this.$store.state.sortedQuestions.indexOf(sth), 1)
                        this.close()
                    }      
                }
            })
        },
        sendReply(reply, index){
            let url = ''
            let repTmp = {reply_content : this.reply_new, reply_writer : this.$store.state.nickname}
            let re = null
            let pos = -1
            if(reply != null){
                repTmp = reply
                repTmp.reply_content = document.querySelector('#question-reply-'+index).value
                re = document.querySelector('#question-' + index)
                pos = this.replies.indexOf(reply)
            }

            if(this.typeCode === 0) url = 'http://localhost:8095/question/unsolved/reply'
            else url = 'http://localhost:8095/question/sorted/reply'


            this.$http({
                method: 'post',
                url: url,
                data: repTmp,
                params:{
                    mem_idx : this.$store.state.mem_idx,
                    id : this.question.id
                }
            }).then(response => {
                if(reply != null){
                    document.querySelectorAll('.question-askbox textarea').forEach(el => {
                        el.value = ''
                    })
                    this.question.replies.splice(pos, 1, response.data)
                    re.style.display = "none"
                    re.previousElementSibling.style.display = 'inline-block'
                    re.previousElementSibling.children[0].children[0].innerText = response.data.reply_content
                    this.ready = false
                } else {
                    if(this.question.replies == null) this.question.replies = []
                    this.question.replies.push(response.data)
                }
                this.reply_new = ''
                this.goReady()
            })
        },
        selectReply(reply){
            this.ready = false
            this.$http.get('http://localhost:8095/question/unsolved/select', {params: {id : this.question.id, reply_id : reply.reply_idx}}).then(res => {
                this.question = res.data
                this.typeCode = 1
                this.goReady()
            }).finally(() => {
                this.$EventBus.$emit('refreshMember')
            })
        }
    },
}
</script>