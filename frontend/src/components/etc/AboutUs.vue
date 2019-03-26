<template>
    <div class="aboutus-wrap">
            <h2 class="aboutus-maintxt">TEAM SPIDER</h2>
            <hr class="aboutus-hr-grow">
            <div class="aboutus-content">
                    <div class="aboutus-members">
                        <div class="aboutus-member" v-for="member in members_random" :key="member.name">
                            <img src="../../img/sue.jpg" alt="member-photo" v-if="member.name === '강수정'">
                            <img src="../../img/1.jpg" alt="member-photo" v-if="member.name === '권용재'">
                            <img src="../../img/2.jpg" alt="member-photo" v-if="member.name === '이양헌'">
                            <img src="../../img/3.jpg" alt="member-photo" v-if="member.name === '최철웅'">
                            <div class="aboutus-vr"></div>
                            <div class="aboutus-member-info">
                                <span class="aboutus-name">{{member.name}}</span>
                                <hr>
                                <div class="aboutus-tagCt">
                                    <span class="aboutus-tag" v-for="(role, index) in member.role" :key="role + member.name + index">
                                        {{role}}
                                    </span>
                                    <span class="aboutus-tag aboutus-say">{{member.say}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
        </div>
</template>

<script>
export default {
    data(){
        return{
            show: false,
            next: true,
            members: [{name:'강수정', role: ['백엔드/프론트엔드 개발', 'DB(MariaDB, JPA)', '게시판', '회원 관리'], say:'뽑아주세요'}
                    , {name:'권용재', role: ['백엔드 개발', '이것저것', '테스트'], say:'열심히하겠습니다'}
                    , {name:'이양헌', role: ['백엔드 개발', '검색엔진구현', '땡땡떙'], say: '화이팅'}
                    , {name:'최철웅', role: ['프론트엔드 개발', '디자인', '테마', '하드코딩'], say: '더 잘하고 싶다'}],

        }
    },
    computed: {
        members_random(){
            return this.members.sort((a, b) => Math.random() -0.5)
        }
    }
}
</script>