<template>
    <div class='MyPage' v-if="ready">
        <div class="compHead">
            MYPAGE
        </div>
        <div class="alert-back-wrap">
            <transition name="slide-fade">
            <i class="fas fa-arrow-left mypage-back-i" @click="showContents(); closeInfo();" v-if="(!edituser && !deluser && !editpw) && (infoshow || scrapshow || questionshow||logshow || alertshow)"></i>
            <i class="fas fa-arrow-left mypage-back-i" @click="closeedit()" v-if="edituser||editpw||deluser"></i>
            </transition>
            <i :class="{'fas fa-bell mypage-alert-i' : alerts.length === 0, 'fas fa-bell mypage-alert-i mypage-red' : alerts.length > 0}"  
                v-if="this.$store.state.mem_idx != null" @click="closeInfo(); showContents(); showAlert();">
                &nbsp;{{alerts.length}}
            </i>
        </div>
        <!-- 로그인 했을 때 mypage -->
            <div class="mypage-contents" v-if="this.$store.state.mem_idx != null && !contentsshow">
                <div @click="showContents(); infoshow = !infoshow;" class="mypage-1 mypage-box">
                    <img v-bind:src="img1" alt="회원정보">
                    <span class="mypage-boxtitle">회원 정보</span>
                </div>
                <div @click="showContents(); $EventBus.$emit('refreshMember'); scrapshow = !scrapshow;" class="mypage-2 mypage-box">
                    <img v-bind:src="img2" alt="스크랩">
                    <span class="mypage-boxtitle">스크랩</span>
                </div>
                <div @click="showContents(); $EventBus.$emit('refreshMember'); questionshow = !questionshow;" class="mypage-3 mypage-box">
                    <img v-bind:src="img3" alt="질문답변">
                    <span class="mypage-boxtitle">질문 &amp; 답변</span>
                </div>
                <div @click="showContents(); $EventBus.$emit('refreshMember'); logshow = !logshow;" class="mypage-4 mypage-box">
                    <img v-bind:src="img4" alt="검색 기록">
                    <span class="mypage-boxtitle">검색 기록</span>
                </div>
            </div>
        <!-- 비회원 mypage -->
            <div class="mypage-contents" v-if="this.$store.state.mem_idx == null && !contentsshow">
                <div class="mypage-anonymousinfo mypage-box" @click="randomNick">
                    <img v-bind:src="img7" alt="비회원">
                    <span class="mypage-boxtitle">Hello!<br>{{this.$store.state.nickname}}</span>
                </div>
                <div class="mypage-1 mypage-box" v-on:click="signInAction">
                    <img v-bind:src="img5" alt="로그인">
                    <span class="mypage-boxtitle">로그인</span>
                </div>
                <div class="mypage-2 mypage-box" v-on:click="signUpAction">
                    <img v-bind:src="img6" alt="회원가입">
                    <span class="mypage-boxtitle">회원가입</span>
                </div>
            </div>

        <!-- 회원 정보 -->
            <transition name="fade"> <!-- 아이콘 눌렀을때 fade효과 -->
                <div class="mypage-info" v-if="infoshow">
                    <ul class="mypage-ul" v-if="!edituser && !deluser && !editpw">
                        <li class="mypage-li"><i class="far fa-envelope"></i>&emsp;{{memberInfo.email}}</li>
                        <li class="mypage-li">
                            <i class="far fa-user"></i>&emsp;{{memberInfo.nickname}}
                            <i class="far fa-edit mypage-i-right" @click="edituser = !edituser"></i>
                        </li>
                        <li class="mypage-li">&nbsp;
                            <i class="fas fa-user-slash mypage-i-right" style="color:orangered" @click="deluser = !deluser"><small>회원 탈퇴</small></i>
                            <i class="fas fa-user-edit mypage-i-right" @click="editpw = !editpw"><small>비밀번호 변경</small></i>
                        </li>
                    </ul>
                    <!-- 회원 정보 수정 및 탈퇴-->
                    <ul class="mypage-ul" v-if="edituser">
                        <li class="mypage-li">닉네임 변경</li>
                        <li class="mypage-li edit-checkmsg" v-if="msg.length != 0">{{msg}}</li>
                        <li class="mypage-li">
                            <input id="mypage-nick" type="text" class="mypage-edit-input" placeholder="Nickname" :value="memberInfo.nickname">
                        </li>
                        <li class="mypage-li"><button @click="editNickname">변경</button></li>
                    </ul>
                    <ul class="mypage-ul" v-if="editpw">
                        <!-- <li class="mypage-li">비밀번호 변경</li> -->
                            <input id="mypage-currPw" type="password" class="mypage-edit-input" placeholder="현재 비밀번호">
                            <input id="mypage-newPw" @keyup="checkPW" type="password" class="mypage-edit-input" placeholder="변경할 비밀번호">
                            <input id="mypage-checkPw" @keyup="checkPW" type="password" class="mypage-edit-input" placeholder="비밀번호 확인">
                        <li class="mypage-li edit-checkmsg" v-if="(msg.length != 0)&&editpw">{{msg}}</li>
                        <li class="mypage-li"><button @click="editPassword">변경</button></li>
                    </ul>
                    <ul class="mypage-ul" v-if="deluser">
                        <li class="mypage-li"><b style="color:orangered">회원 탈퇴</b></li>
                        <li class="mypage-li edit-checkmsg" v-if="(msg.length != 0)&&deluser">{{msg}}</li>
                        <li class="mypage-li">
                            <input id="mypage-del-pw" type="password" class="mypage-edit-input" placeholder="비밀번호 확인">
                        </li>                    
                        <li class="mypage-li"><button @click="delMember">탈퇴하기</button></li>
                    </ul>
                </div>
            </transition>
            <!-- 스크랩 보여주기 -->
            <transition name="fade">
                <div class="mypage-info" v-if="scrapshow">
                    <!-- <p @click="showContents(); scrapshow = false"><b>x</b></p> -->
                    <ul class="mypage-ul">
                        <li class="mypage-li" v-for="scrap in memberInfo.memberScraps" :key="scrap.idx + 'scrap'">
                            <a @click="goscrap(scrap.link)" target="_blank">{{scrap.title}}</a>
                            <i class="fas fa-trash-alt mypage-i-right" @click="removeScrap(scrap)"></i>
                        </li>
                    </ul>
                </div>
            </transition>
            <!-- 회원 질문 보여주기 -->
            <transition name="fade">
                <div class="mypage-info" v-if="questionshow">
                    <!-- <p @click="showContents(); questionshow = false"><b>x</b></p> -->
                    <ul class="mypage-ul">
                        <li class="mypage-unsolved mypage-li" v-for="question in memberInfo.unsolvedQuestions" :key="question.id + 'unsolved'">
                            <a @click="clickSth(question, 0)"><i class="far fa-question-circle"></i>&emsp;<b>{{question.title}}</b></a>
                            <i class="fas fa-trash-alt mypage-i-right" @click="deleteSth(question, 0)"></i>
                            <i class="far fa-edit mypage-i-right" @click="editQ(question, 0)"></i>
                        </li>
                        <li class="mypage-li" v-for="question in memberInfo.sortedQuestions" :key="question.id + 'sorted'">
                            <a @click="clickSth(question, 1)"><i class="far fa-question-circle"></i>&emsp;<b>{{question.title}}</b></a>
                            <i class="fas fa-trash-alt mypage-i-right" @click="deleteSth(question, 1)"></i>
                            <i class="far fa-edit mypage-i-right" @click="editQ(question, 1)"></i>
                        </li>
                        <li class="mypage-li" v-for="(reply, index) in replies" :key="reply.reply_idx + 'reply' + index">
                            <a @click="clickSth(reply, 2)"><i class="fab fa-replyd"></i>&emsp;{{reply.reply_content}}</a>
                            <i class="fas fa-trash-alt mypage-i-right" @click="deleteSth(reply, 2)"></i>
                        </li>
                    </ul>
                </div>
            </transition>
            <!-- 검색 기록 보여주기 -->
            <transition name="fade">
                <div class="mypage-info" v-if="logshow">
                    <!-- <p @click="showContents(); logshow = false"><b>x</b></p> -->
                    <div class="mypage-log">
                        <span class="mypage-log-keyword" v-for="(keyword, index) in keywords" :key="index">
                            <a>{{keyword}}</a>
                        </span>
                    </div>
                </div>
            </transition>
            <!-- 알람 보여주기 -->
            <transition name="fade">
                <div class="mypage-info" v-if="alertshow">
                    <!-- <p @click="showContents(); alertshow = false"><b>x</b></p> -->
                    <ul class="mypage-ul">
                        <li class="mypage-sorted mypage-li" v-if="alerts.length > 0">&nbsp;<span class="mypage-alert-clear" @click="readAlert(alerts)">모두 지우기</span></li>
                        <li class="mypage-sorted mypage-li" v-for="question in alerts" :key="question.id + 'alert'">
                            <a @click="clickSth(question, 0); readAlert(question)"><i class="fas fa-exclamation"></i>&emsp;[<b class="mypage-short-title">{{question.title}}</b>]에 답변이 달렸습니다.</a>
                            <i class="fas fa-check mypage-i-right" @click="readAlert(question)"></i>
                        </li>
                        <li class="mypage-sorted mypage-li" v-if="alerts.length === 0">
                            <a @click="clickSth(question, 0)">알림이 없습니다.</a>
                        </li>
                    </ul>
                </div>
            </transition>
        </div>
</template>

<script>
import animals from '../../data/animals.json'

export default {
    created(){
        this.ready = true
    },
    data(){
        return{
            memberInfo: this.$store.state,
            contentsshow: false,
            scrapshow: false,
            questionshow: false,
            infoshow: false,
            logshow: false,
            alertshow: false,
            edituser: false,
            deluser: false,
            editpw: false,
            ready: false,
            msg: "",
            img1: 'https://image.flaticon.com/icons/svg/1283/1283214.svg',
            img2: 'https://image.flaticon.com/icons/svg/1283/1283222.svg',
            img3: 'https://image.flaticon.com/icons/svg/1283/1283215.svg',
            img4: 'https://image.flaticon.com/icons/svg/1283/1283223.svg',
            img5: 'https://image.flaticon.com/icons/svg/1118/1118907.svg',
            img6: 'https://image.flaticon.com/icons/svg/1118/1118903.svg',
            img7: 'https://image.flaticon.com/icons/svg/1118/1118893.svg'
        }
    },
    computed: {
        keywords(){
            if(this.$store.state.searchHistory == null) return ['최근 검색 기록이 없습니다.']

            let tmp = []

            this.$store.state.searchHistory.forEach(keyword => {
                if(keyword.split(' ').join('').length != 0) tmp.push(keyword)
            })

            return tmp;
        },
        replies(){
            let memberInfo = this.$store.state;

            if(memberInfo.sortedQuestionReplies == null && memberInfo.unsolvedQuestionReplies == null) return [];
            if(memberInfo.sortedQuestionReplies != null && memberInfo.unsolvedQuestionReplies == null) return memberInfo.sortedQuestionReplies;
            if(memberInfo.sortedQuestionReplies == null && memberInfo.unsolvedQuestionReplies != null) return memberInfo.unsolvedQuestionReplies;
            return memberInfo.sortedQuestionReplies.concat(memberInfo.unsolvedQuestionReplies);
        },
        alerts(){
            let memberInfo = this.$store.state
            let tmp = []

            if(memberInfo.unsolvedQuestions != null){
                memberInfo.unsolvedQuestions.forEach(q => {
                    if(q.alert === 1) tmp.push(q)
                })
                return tmp
            } else return []
        }
    },
    methods : {
        closeedit(){
            this.edituser = false
            this.editpw = false
            this.deluser = false
        },
        showContents(){
            this.contentsshow = !this.contentsshow
        },
        showAlert(){
            this.alertshow = true;
        },
        closeInfo(){
            this.contentsshow = false
            this.scrapshow = false
            this.questionshow = false
            this.infoshow = false
            this.logshow = false
            this.alertshow = false
        },
        goscrap(link){
            this.$http.get(link).then(response => {
                if(link.includes('sorted')) this.clickSth(response.data, 1)
                else if(link.includes('unsolved')) this.clickSth(response.data, 0)
            });
        },
        removeScrap(scrap){
            this.$http({
                    method: 'delete',
                    url: `http://52.79.204.244/scrap`,
                    data: scrap,
                    params:{
                        mem_idx : this.memberInfo.mem_idx,
                    }
                }).then(response => {

                }).finally(() => {
                    this.$EventBus.$emit('refreshMember');
                });
        },
        signUpAction(){
            this.$EventBus.$emit('showSignUp')
        },
        signInAction(){
            this.$EventBus.$emit('showSignIn')
        },
        editNickname(){
            if(document.querySelector('#mypage-nick').value.length == 0){
                this.msg = '변경할 닉네임을 입력해주세요.'
                return;
            }
            this.$http({
                method: 'post',
                url: 'http://52.79.204.244/member/edit',
                data: {
                    mem_idx: this.memberInfo.mem_idx,
                    nickname: document.querySelector('#mypage-nick').value
                }
            }).then(res => {
                this.$EventBus.$emit('refreshMember')
                this.edituser = false
                this.msg = ''
            });
        },
        checkPW(){
            let pw = document.querySelector('#mypage-newPw').value
            let check = document.querySelector('#mypage-checkPw').value
            if(pw !== check) this.msg = '변경할 비밀번호를 확인해주세요.'
            else this.msg = ''
        },
        editPassword(){
            let curr = document.querySelector('#mypage-currPw').value
            let newp = document.querySelector('#mypage-newPw').value
            let check = document.querySelector('#mypage-checkPw').value

            if(newp !== check) return

            if(curr == 0 || newp == 0){
                this.msg = '비밀번호를 입력해주세요.'
                return
            }
            this.$http({
                method: 'post',
                url: 'http://52.79.204.244/member/edit',
                data: {
                    mem_idx: this.memberInfo.mem_idx,
                    password: newp,
                    currpwd: curr
                }
            }).then(res => {
                if(res.data.length == 0) this.msg = '현재 비밀번호가 다릅니다.'
                else {
                    this.editpw = false
                    this.msg = ''
                }
            })
        },
        delMember(){
            this.$http({
                method: 'delete',
                url: 'http://52.79.204.244/member/delete',
                data: {
                    mem_idx: this.memberInfo.mem_idx,
                    password: document.querySelector('#mypage-del-pw').value
                }
            }).then(res => {
                if(res.data === 0){
                    this.msg = '비밀번호가 일치하지 않습니다.'
                } else {
                    this.deluser = false
                    this.msg = ''
                    this.$store.dispatch('LOGOUT').then(console.log('로그아웃 완료'))
                }
            });
        },
        randomNick(){
            this.$store.state.nickname = '익명의 ' + animals[Math.floor(Math.random() * animals.length)]
        },
        clickSth(data, type){
            data.type = type
            this.$EventBus.$emit('showQuestion', data)
        },
        deleteSth(sth, type){
            let url = ''
            
            let ok = window.confirm("정말 삭제 하시겠습니까?")

            if(!ok) return;

            if(type === 0) url = 'http://52.79.204.244/question/unsolved'
            else if(type === 1) url = 'http://52.79.204.244/question/sorted'
            else {
                if(sth.sortedQuestion != null) url = 'http://52.79.204.244/question/sorted/reply'
                else url = 'http://52.79.204.244/question/unsolved/reply'
            }

            this.$http({
                method: 'delete',
                url: url,
                data: sth
            }).then(res => {
                if(res.data === 0){
                    console.log('삭제 실패')
                } else {
                    console.log('삭제 성공')
                    this.$EventBus.$emit('refreshMember')
                }
            })
            
        },
        editQ(question, type){
            question.content = question.content.split('<br/>').join('\n');
            question.type = type;
            this.$EventBus.$emit('showWrite', question)
        },
        readAlert(...question){
            if(question[0] instanceof Array){
                let tmp = []
                let iter = question[0].values()
                let i = null
                while((i = iter.next().value) != null){
                    tmp.push(i)
                }
                question = tmp
            }
            this.$http.post('http://52.79.204.244/question/alert', {data : question}).then(res => {
                question.forEach((q) => {
                    if(this.$store.state.unsolvedQuestions.indexOf(q) != -1)
                    this.$store.state.unsolvedQuestions.splice(this.$store.state.unsolvedQuestions.indexOf(q), 1)
                })
            })
        }
    }
}
</script>
