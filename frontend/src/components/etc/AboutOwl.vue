<template>
        <div class="mapper-wrap">
            <h2 class="mapper-maintxt"></h2>
            <hr class="mapper-hr-grow">
            <div class="mapper-content" v-if="show">
                <transition enter-active-class="animated pulse">
                    <p v-if="show_sub1">개발자의, 개발자에 의한, 개발자를 위한 <u>'사용자 맞춤형 검색 어플리케이션'</u></p>
                </transition>
                <transition enter-active-class="animated fadeIn">
                    <ul v-if="show_sub2">
                        <li>개발자를 대상으로 하여 필요한 정보를 제공</li>
                        <li>마이크로서비스 모듈 중 첫 번째 어플리케이션</li>
                        <li>사용자가 쉽게 이용할 수 있도록 직관적 인터페이스를 구현</li>
                        <li>SPA로써 한정된 윈도우 내에서 원하는 모든 정보를 동적으로 제공</li>
                        <li>머신러닝을 통해 개인별 맞춤 정보 제공 <span class="mapper-shy">예정</span></li>
                    </ul>
                </transition>
                <transition enter-active-class="animated fadeIn">
                    <ul v-if="show_sub3">
                        <li>공식 홈페이지 내 정리된 문서, 영상, 사용법, 다운로드 링크 등 제공 <span class="mapper-shy">예정</span></li>
                        <li>유용한 비공식 문서(블로그, 강좌, 관련 도서 등) 정보 제공</li>
                        <li>키워드 별 연관 정보(프레임워크, 라이브러리, 플러그인 등) 제공 <span class="mapper-shy">예정</span></li>
                        <li>에러 코드 및 예외에 대한  해설과 리뷰 정보 제공 <span class="mapper-shy">예정</span></li>
                        <li>사용자간에 직접 연결되는 질문 및 답변기능 제공 <span class="mapper-shy">예정</span></li>
                        <li>검색 포털(구글, 네이버 등)의 검색 결과를 분류해서 제공</li>
                        <li>모든 키워드에 대한 사용자 리뷰 공유</li>
                    </ul>
                </transition>
            </div>
        </div>
</template>

<script>

export default {
    mounted(){
        let i = 0
        this.typing = setInterval(this.type, 100)
    },
    data(){
        return{
            txt : 'O|W|L|?|',
            typing : null,
            pos : 0,
            show : false,
            show_sub1 : false,
            show_sub2: false,
            show_sub3: false,
        }
    },
    methods: {
        type(){
            let maintxt = document.querySelector('.mapper-maintxt')
            if(this.pos % 2 == 0 && this.pos != 0) maintxt.textContent = maintxt.textContent.substr(0, maintxt.textContent.length - 1)            
            maintxt.textContent += this.txt.charAt(this.pos++)
            if(this.pos === this.txt.length - 1) {
                clearInterval(this.typing)
                setTimeout(() => {
                    document.querySelector('.mapper-hr-grow').className += ' mapper-hr-grow-go'
                    setTimeout(() => {
                        this.show = true
                        setTimeout(() => {
                            this.show_sub1 = true
                            setTimeout(() => {
                                this.show_sub2 = true
                                setTimeout(() => {
                                    this.show_sub3 = true
                                }, 700)
                            }, 700)
                        }, 700)
                    }, 700)
                }, 200)
            }
        }
    }
}
</script>