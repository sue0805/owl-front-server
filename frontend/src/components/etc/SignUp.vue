<template>
    <div class="sign-up-panel" @click="popupDown()">
        <div class="sign-up-wrap" @click.stop="()=>{}">
            <div class="sign-up-title">
                회원가입
            </div>
            <div class="sign-up-main">
                <form @submit.prevent="onSubmit(email, nickname, password)">
                <input type="email" placeholder="E-mail" v-model="email">
                <input placeholder="NickName" v-model="nickname">
                <input type="password" placeholder="Password" v-model="password">
                <input type="password" placeholder="Check Password" v-model="passwordchk">
                <input type="submit" value="Sign Up">
                </form>
            </div>
            <div class="sign-up-api">
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
            message: '',
            email: '',
            nickname: '',
            password: '',
            passwordchk: '',
        }
    },
     computed:{
        naverLoginURL(){return `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${this.$store.getters.apis.naver[0]}&redirect_uri=http%3a%2f%2f52.79.204.244%2fapi%2fnaver%2fcallback&state=123`},
        kakaoLoginURL(){return `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${this.$store.getters.apis.kakao[0]}&redirect_uri=http%3a%2f%2f52.79.204.244%2fapi%2fkakao%2fcallback`},
        githubLoginURL(){return `https://github.com/login/oauth/authorize?client_id=${this.$store.getters.apis.github[0]}&redirect_uri=http://52.79.204.244/api/github/callback`}
    },
    methods:{
        onSubmit(){

            /*
            TODO 유효성 검사 해야함!!!!!!
            */

            let form = new FormData();
            form.append('email', this.email);
            form.append('nickname', this.nickname);
            form.append('password', this.password);
            const uri = 'http://52.79.204.244/member/signup/' 
            this.$http.post(`${uri}`, form)
            .then(res => {
                alert(res.data);
                this.$EventBus.$emit('allPopupDown')
                })
        },
        popupDown(){
            this.$EventBus.$emit('allPopupDown')
        }
    },
    
}
</script>

