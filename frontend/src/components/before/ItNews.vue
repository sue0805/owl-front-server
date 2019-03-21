<template>
    <div class='ItNews' v-if="ready">
        <div class="compHead">
            ITNEWS
        </div>
        <div class='it-contents'>
            <ul>
                <li v-for="article in news" :key="article.guid">
                    <a :href="article['atom:link'].href" target="_blank">{{article.title}}</a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            news: [],
            ready: false,
        }
    },
    created(){
        this.$http.get("http://52.79.204.244/news").then(response => {
            this.news = response.data;
            this.ready = true;
        });
    }
}
</script>