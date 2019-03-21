<template>
    <div class="write-askbox">
        <div class="write-askbox-wrap">
            <i class="fas fa-times write-close" @click="close"></i>
            <span style="margin-left:-80%;font-size:13px"><input type="checkbox" value="anonymous" id="anonymous-chkbox">익명</span>
            <input class="title" placeholder="제목을 입력해주세요." type="text" :value="question.title">
            <textarea class="write-ask-textarea" placeholder="질문을 작성해주세요." :value="question.content"></textarea>
            <!-- <input class="tags" placeholder="Tags >> (Example => #Java #Spring #IntelliJ) " type="text"> -->
            <i class="far fa-share-square write-send-i" @click="edit"></i>
        </div>
    </div>
</template>

<script>
import animals from '../../data/animals.json'

export default {
    props: ['data'],
    data(){
        return{
            type: this.data.type,
            question: this.data,
        }
    },
    methods : {
        close(){
            this.$EventBus.$emit('closeRead')
        },
        edit(){
            let url = '';

            if(this.type == 0) url = 'http://localhost:8095/question/unsolved'
            else url = 'http://localhost:8095/question/sorted'

            let form = document.querySelectorAll('.write-askbox input, .write-askbox textarea')
            let nickname = document.querySelector('#anonymous-chkbox').checked ? '익명의 ' + animals[Math.floor(Math.random() * animals.length)] : this.$store.state.nickname

            if(form[1].value.length > 0 && form[2].value.length > 0){
                let tags = ''
                const query = 
                    {
                        "analyzer": "nori",
                        "text": form[2].value                      
                    }
                this.$http.get(`http://13.209.160.90:9200/_analyze`, {
                    params:{
                        source: JSON.stringify(query),
                        source_content_type: 'application/json',
                }, 
                }).then(res=>{
                        let list = res.data.tokens.filter((item, idx, array) => {return array.indexOf(item) === idx})
                        tags = ''
                        for(let i of list){
                            if(i.token.length != 1)
                            tags += '#'+i.token
                        }
                }).then(()=>{
                    this.question.title = form[1].value
                    this.question.content = form[2].value
                    this.question.writer = nickname
                    this.question.tags = tags

                    this.$http({
                        method: 'post',
                        url: url,
                        data: this.question,
                        params:{
                            mem_idx : this.$store.state.mem_idx
                        }
                    }).then(response => {
                        this.showEdit = false;
                        document.querySelectorAll('.sorted-askbox input, textarea').value = "";
                        this.question = response.data
                        this.question.type = 0
                        this.close()
                        this.$EventBus.$emit('showQuestion', this.question)
                    });
                })
            } else {
                alert('제목이나 내용을 입력하세요.');
            }
        }
    }
}
</script>