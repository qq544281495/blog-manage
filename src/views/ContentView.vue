<template>
  <div class="content-view">
    <div class="content-nav" :class="isCollapse ? 'fold' : 'nofold'">
      <div class="nav-title" :class="isCollapse ? 'fold' : 'nofold'">
        <img src="@/assets/images/login_name.png" />
        <span class="content">博客管理系统</span>
      </div>
      <el-menu
        class="nav-menu"
        :default-active="activeMenu"
        :collapse="isCollapse"
        :collapse-transition="false"
      >
        <el-sub-menu index="0">
          <template #title>
            <el-icon><Reading /></el-icon>
            <span>文章</span>
          </template>
          <el-menu-item index="/editArticle" @click="skip('editArticle')">文章编辑</el-menu-item>
          <el-menu-item index="/manageArticle" @click="skip('manageArticle')"
            >文章管理</el-menu-item
          >
        </el-sub-menu>
        <el-menu-item index="/label" @click="skip('label')">
          <el-icon><CollectionTag /></el-icon>
          <span>标签</span>
        </el-menu-item>
        <el-menu-item index="/classify" @click="skip('classify')">
          <el-icon><FolderOpened /></el-icon>
          <span>分类</span>
        </el-menu-item>
        <el-menu-item index="/message" @click="skip('message')">
          <el-icon><ChatDotRound /></el-icon>
          <span>留言</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="content-page">
      <div class="page-title">
        <div class="page-fold">
          <el-icon v-if="!isCollapse" size="24px" @click="changeCollapse(true)"><Fold /></el-icon>
          <el-icon v-else size="24px" @click="changeCollapse(false)"><Expand /></el-icon>
        </div>
        <div class="page-user">
          <el-popover :width="240">
            <template #reference>
              <img :src="imageBaseUrl + '/' + user.portrait" />
            </template>
            <template #default>
              <div>
                <span
                  style="
                    display: inline-block;
                    width: 60px;
                    text-align: justify;
                    letter-spacing: 1px;
                  "
                >
                  用户名：
                </span>
                <span>{{ user.username }}</span>
              </div>
              <div>
                <span
                  style="
                    display: inline-block;
                    width: 60px;
                    text-align: justify;
                    letter-spacing: 1px;
                  "
                >
                  手机号：
                </span>
                <span>{{ user.phone }}</span>
              </div>
              <div>
                <span
                  style="
                    display: inline-block;
                    width: 60px;
                    text-align: justify;
                    letter-spacing: 1px;
                  "
                >
                  邮箱：
                </span>
                <span>{{ user.email }}</span>
              </div>
              <div
                style="text-align: right; margin: 4px 0px; color: #409eff; cursor: pointer"
                @click="logout"
              >
                退出登录
              </div>
            </template>
          </el-popover>
        </div>
      </div>
      <div class="content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import config from '@/config'
export default {
  data() {
    return {
      isCollapse: false,
      imageBaseUrl: config.imageBaseUrl,
      activeMenu: this.$route.path
    }
  },
  watch: {
    $route(route) {
      this.activeMenu = route.path
    }
  },
  methods: {
    skip(path) {
      this.$router.push({ path })
    },
    changeCollapse(data) {
      this.isCollapse = data
    },
    logout() {
      this.$message.success({ message: '退出登录成功' })
      this.$store.commit('user/SET_USER', {})
      this.$router.push({ path: '/' })
    }
  },
  computed: {
    ...mapGetters({
      user: 'user/GET_USER'
    })
  }
}
</script>

<style lang="scss" scoped>
.content-view {
  display: flex;
  position: absolute;
  width: 100vw;
  height: 100%;
  min-width: 992px;
  .content-nav {
    display: flex;
    position: relative;
    flex-direction: column;
    height: 100%;
    background-color: #ffffff;
    color: #001529;
    overflow-y: auto;
    overflow-x: hidden;
    transition: all 0.3s;
    border-right: 1px solid #dcdfe6;

    .nav-title {
      display: flex;
      align-items: center;
      font-size: 22px;
      letter-spacing: 1px;
      color: #999;
      margin: 20px 0px;
      white-space: nowrap;
      transition: all 0.3s;

      img {
        width: auto;
        height: 24px;
        margin: 4px;
      }

      &.fold {
        transform: translateX(0px);
      }

      &.nofold {
        transform: translateX(28px);
      }
    }

    .nav-menu {
      flex: 1;
    }

    .el-menu {
      border-right: 0px;
    }

    &.fold {
      width: 64px;
    }

    &.nofold {
      width: 256px;
    }
  }
  .content-page {
    display: flex;
    flex-direction: column;
    flex: 1;

    .page-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      width: 100%;
      height: 72px;
      padding: 0px 20px;
      border-bottom: 1px solid #dcdfe6;

      .page-fold {
        cursor: pointer;
      }

      .page-user {
        display: flex;
        align-items: center;
        img {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          box-shadow: #ccc 1px 1px 10px;
        }
      }
    }

    .content {
      flex: 1;
      width: 100%;
      overflow: auto;
    }
  }
}
</style>
