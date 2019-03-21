<template>
    <div class="contact-wrap">
            <h2 class="contact-maintxt">CONTACT</h2>
            <hr class="contact-hr-grow">
            <div class="contact-content" v-if="show">
                <transition enter-active-class="animated fadeIn">
                    <div class="contact-members">
                        <div class="contact-member" v-for="member in members_random" :key="member.name">
                            <span>{{member.name}}</span>
                            <hr>
                            <ul>
                                <li v-if="member.email != null" @click="copy">
                                    <i class="far fa-envelope"></i>&emsp;{{member.email}}
                                    <i style="color:red;font-size:9px;display:none"> copied!</i>
                                </li>
                                <li v-if="member.github != null" @click="go(member.github)"><i class="fab fa-github"></i>&emsp;{{member.github}}</li>
                                <li v-if="member.blog != null" @click="go(member.blog)"><i class="fas fa-blog"></i>&emsp;{{member.blog}}</li>
                            </ul>
                        </div>
                        <hr style="visibility:hidden; clear:both;">
                        <Credits class="contact-credits"/>
                        <input class="contact-hidden" type="text" v-model="mail">
                    </div>
                </transition>
            </div>
        </div>
</template>

<script>
import Credits from './Credits'

export default {
    data(){
        return{
            show: true,
            members: [{name:'강수정', email:'luckiness0805@gmail.com', github: 'https://github.com/sue0805', blog: null}
                    , {name:'권용재', email: 'rnjs1227@naver.com', github: 'https://github.com/yong1227', blog: null}
                    , {name:'이양헌', email: 'maaseik2292@gmail.com', github: 'https://github.com/WickiesLee', blog: 'https://wickies.tistory.com/'}
                    , {name:'최철웅', email: 'endnd28@gmail.com', github: 'https://github.com/ristretto-code', blog: null}],
            mail: ''
        }
    },
    methods: {
        go(link){
            window.open(link, '_blank')
        },
        copy(e){
            this.mail = e.target.innerText.split('copied!')[0].trim()
            setTimeout(() => {
                document.querySelector('.contact-hidden').select()
                document.execCommand('copy')
                e.target.lastElementChild.style.display = "inline"
                setTimeout(() => {
                    e.target.lastElementChild.style.display = "none"
                }, 300)
            }, 1)
        }
    },
    computed: {
        members_random(){
            return this.members.sort((a, b) => Math.random() - 0.5)
        }
    },
    components:{
        'Credits' : Credits
    }
}
</script>