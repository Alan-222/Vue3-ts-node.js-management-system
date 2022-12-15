<script lang="ts" setup>
import { onMounted, h } from 'vue';
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
onMounted(() => {
  const { params, query } = route
  const { path } = params
  router.replace({ path: '/' + path, query })
})
render: () => {
  return h("template") // 要用template标签包裹重定向页面避免报错
}

</script>
