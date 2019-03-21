<template>

    <div class="after">
        <transition enter-active-class="animated fadeIn faster">
        <MyPage class="compGrid mypage"/>
        </transition>
        <transition enter-active-class="animated fadeIn faster">
        <Wiki class="compGrid official"/>        
        </transition>
        <transition enter-active-class="animated fadeIn faster">
        <AfterQuestion class="compGrid sorted"/>
        </transition>
        <transition enter-active-class="animated fadeIn faster">
        <AfterYoutube class="compGrid data"/>
        </transition>
        <transition enter-active-class="animated fadeIn faster">
        <SearchResult class="compGrid others"/>
        </transition>
    </div>
</template>

<script>
import MyPage from '../before/MyPage'
import Wiki from '../after/Wiki'
import AfterQuestion from '../after/AfterQuestion'
import AfterYoutube from '../after/AfterYoutube'
import SearchResult from '../after/SearchResult'

export default{
  name: 'MainPanel',
  components: {
    'Wiki' : Wiki,
    'AfterQuestion' : AfterQuestion,
    'AfterYoutube' : AfterYoutube,
    'SearchResult' : SearchResult,
    'MyPage' : MyPage,
  },
  render(component) { 
    return component(this.ViewComponent)
  }
}
</script>