<template>
    <div class="before">
        <transition enter-active-class="animated fadeIn fast">
        <MyPage class="compGrid mypage"/>
        </transition>
        <transition enter-active-class="animated fadeIn fast">
        <Reply class="compGrid reply"/>
        </transition>
        <transition enter-active-class="animated fadeIn fast">
        <Notice class="compGrid notice"/>
        </transition>
        <transition enter-active-class="animated fadeIn fast">
        <Hot class="compGrid hot"/>
        </transition>
        <transition enter-active-class="animated fadeIn fast">
        <BeforeYoutube class="compGrid study"/>
        </transition>
        <transition enter-active-class="animated fadeIn fast">
        <ItNews class="compGrid itnews"/>
        </transition>
        <transition enter-active-class="animated fadeIn fast">
        <Etc class="compGrid etc"/>
        </transition> 
    </div>
</template>

<script>
import MyPage from '../before/MyPage'
import Hot from '../before/Hot'
import Reply from '../before/Reply'
import BeforeYoutube from '../before/BeforeYoutube'
import ItNews from '../before/ItNews'
import Notice from '../before/Notice'
import Etc from '../before/Etc'    

export default {
  name: 'before',
  components: {
    'MyPage' : MyPage,
    'Reply' : Reply,
    'BeforeYoutube' : BeforeYoutube,
    'ItNews' : ItNews,
    'Notice' : Notice,
    'Etc' : Etc,
    'Hot' : Hot,
  },
  render(component) { 
    return component(this.ViewComponent)
  }
}
</script>