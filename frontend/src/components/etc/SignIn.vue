<template>
    <div class="sign-in-panel" @click="popupDown()">
        <div class="sign-in-wrap" @click.stop="()=>{}">
            <div class="sign-in-title">
            로그인
            </div>
            <div class="sign-in-main">
            <form @submit.prevent="onSubmit(email, password)">
                <input type="email" placeholder="E-mail" v-model="email">
                <input type="password" placeholder="Password" v-model="password">
                <input type="submit" value="Sign In">
            </form>
            </div>
            <div class="sign-in-api">
                <a :href=kakaoLoginURL><img src="../../../static/kakao.png" alt="" class="icon-image"></a>
                <a :href=naverLoginURL><img src="../../../static/naver.png" alt="" class="icon-image"></a>
                <a :href=githubLoginURL><img src="../../../static/github.png" alt="" class="icon-image"></a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            email: '',
            password: ''
        }
    },
    computed:{
        naverLoginURL(){return `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${this.$store.getters.apis.naver[0]}&redirect_uri=http%3a%2f%2flocalhost%3a8095%2fapi%2fnaver%2fcallback&state=123`},
        kakaoLoginURL(){return `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${this.$store.getters.apis.kakao[0]}&redirect_uri=http%3a%2f%2f13.209.213.138%2fapi%2fkakao%2fcallback`},
        githubLoginURL(){return `https://github.com/login/oauth/authorize?client_id=${this.$store.getters.apis.github[0]}&redirect_uri=http://52.79.204.244/api/github/callback`}
    },
    methods:{
        onSubmit(email, password){
            this.$store.dispatch('LOGIN', {email, password})
                .then(() => {this.$EventBus.$emit('allPopupDown')})
        },
        popupDown(){
            this.$EventBus.$emit('allPopupDown')
        }
    },
    
}
</script>
