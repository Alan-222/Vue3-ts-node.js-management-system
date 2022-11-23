<template>
  <div class="essayPreview">
    <div class="previewTitle">{{ title }}</div>
    <div class="previewAuthor">
      <!-- <img class="authorAvatar" :src="authorInfo.user_pic" /> -->
      <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-user" width="24" height="24"
        viewBox="0 0 24 24" stroke-width="1.5" stroke="#409eff" fill="none" stroke-linecap="round"
        stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <circle cx="12" cy="7" r="4" />
        <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
      </svg>
      <div class="authorInfoBox">
        <div class="authorName">
          <span class="name">{{ authorInfo.username }}</span>
          <span class="email">{{ authorInfo.email }}</span>
        </div>
        <div class="creatTime">{{ creatTime }}</div>
      </div>
    </div>
    <div class="coverContainer">
      <el-image :src="cover" :alt="title" class="cover" />
    </div>
    <v-md-preview :text="text" ref="preview" id="preview"></v-md-preview>
  </div>

  <div class="navigation">
    <div class="navigation-content" id="permiss">
      <div class="nav-title">目录</div>
      <div v-for="(anchor, index) in titleAnchors" :key="index + 'art'"
        :style="{ padding: `10px 0 10px ${anchor.indent * 10}px` }" class="title-link"
        @click="handleAnchorClick(anchor, index, anchor.indent)">
        <a :class="activeIndex === index ? 'active' : ''">{{
            anchor.title
        }}</a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default { name: 'Post' };
</script>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { getArticleById } from '@/utils/API/article/article'
import { useRoute } from 'vue-router'
import { getUserInfoById } from '@/utils/API/user/user'

const route = useRoute()
let id = ref(Number(route.params.id))
const preview = ref()
const essayPreview = ref()
// 文章参数
let title = ref<string>('')
const titleAnchors = ref([{} as titleAnchors])
let text = ref<string>('');
let cover = ref<string>('')
let creatTime = ref<string>('')
let activeIndex = ref<number>(-1)
const authorInfo = ref({} as authorInfo)


const handleAnchorClick = (anchor: titleAnchors, index: number, indent: number) => {
  activeIndex.value = index
  const { lineIndex } = anchor;
  const heading = preview.value.$el.querySelector(`[data-v-md-line="${lineIndex}"]`);
  console.log(heading);

  if (heading) {
    preview.value.scrollToTarget({
      target: heading,
      scrollContainer: window,
      top: 40,
    });
  }
}
//获取锚点数组 获取完接口后调用
const getTitle = () => {
  nextTick(() => {
    //获取所有的标题
    const anchors = preview.value.$el.querySelectorAll('h1,h2,h3,h4,h5,h6');
    console.log(anchors);

    const titles = Array.from(anchors).filter(title => !!title.innerText.trim());
    if (!titles.length) {
      titleAnchors.value = [];
      return;
    }

    const hTags = Array.from(new Set(titles.map(title => title.tagName))).sort();
    //给每一个加样式
    titleAnchors.value = titles.map((el) => ({
      title: el.innerText,
      lineIndex: el.getAttribute('data-v-md-line'),
      indent: hTags.indexOf(el.tagName)
    }));
  });
}
// 获取作者信息
const getUserInfo = (id: number) => {
  getUserInfoById(id).then(res => {
    authorInfo.value = res.data
    authorInfo.value.user_pic = `http://127.0.0.1:3007/${res.data.user_pic}`
  })
}
onMounted(() => {
  getArticleById(id.value).then(res => {
    document.title = res.data.title
    text.value = res.data.content
    title.value = res.data.title
    cover.value = res.data.cover_img
    creatTime.value = res.data.create_time
    getTitle()
    getUserInfo(res.data.author_id)
  })
})
</script>

<style lang="scss" scoped>
.essayPreview {
  width: 55%;
  margin-left: 40px;
  border-radius: 4px 4px 0 0;
  padding: 28px;
  background-color: #fff;



  .previewTitle {
    margin: 0 0 32px 32px;
    font-size: 32px;
    font-weight: 600;
    line-height: 1.31;
    color: #252933;
  }

  .coverContainer {
    width: 60%;
    margin: 20px auto;
    // min-height: 400px;

    .cover {
      display: block;
      object-fit: cover;
      // max-height: 200px;

    }
  }

  .previewAuthor {
    display: flex;
    align-items: center;
    margin-left: 24px;
    padding-left: 12px;
    background-color: #f6f8fa;

    .authorAvatar {
      flex: 0 0 auto;
      margin-right: 16px;
      width: 48px;
      height: 48px;
      border-radius: 50%;
    }

    .authorInfoBox {
      min-width: 0;
      flex: 1;
      min-height: 43px;
      margin-left: 16px;

      .authorName {
        height: 20px;
        display: flex;

        .name {
          display: inline-block;
          vertical-align: top;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .email {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-top: 2px;
          margin-left: 20px;
          font-size: 13px;
          color: #8a919f;
        }
      }

      .creatTime {
        font-size: 14px;
        color: #8a919f;
        margin-top: 2px;
        line-height: 20px;
        letter-spacing: 1px;
      }
    }
  }
}

.navigation {
  padding: 30px;
  width: 18%;
  max-height: 60%;
  background-color: #fff;
  border-radius: 5px;
  position: fixed;
  top: 102px;
  right: 10%;
  overflow-y: auto;
  overflow-x: hidden;

  .nav-title {
    font-weight: 500;
    font-size: 16px;
    line-height: 2rem;
    color: #1d2129;
    border-bottom: 1px solid #e4e6eb;
  }

  .navigation-content {
    width: 100%;


    .title-link {
      cursor: pointer;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 14px;
      font-weight: 500;
    }

    .title-link:hover {
      background-color: #f8f8f8;
    }

  }
}

.active {
  color: #409eff;
}

@media screen and (max-width:900px) {
  .navigation {
    display: none;
  }
}
</style>