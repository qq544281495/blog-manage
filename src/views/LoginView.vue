<template>
  <div class="login-view">
    <div class="login-image"></div>
    <div class="login-form">
      <div class="form-title">
        <img src="@/assets/images/login_name.png" />
        <span class="content">博客管理系统</span>
      </div>
      <el-form class="form-content" label-position="top" label-width="100px" :model="loginForm">
        <el-form-item label="邮箱">
          <el-input v-model="loginForm.email" type="text" placeholder="请输入邮箱" size="large" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            v-model="loginForm.password"
            type="password"
            show-password
            placeholder="请输入密码"
            size="large"
          />
        </el-form-item>
        <el-form-item>
          <el-button class="form-submit" size="large">立即登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        email: '',
        password: ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login-view {
  display: flex;
  position: absolute;
  width: 100vw;
  height: 100%;
  min-width: 768px;
  min-height: 384px;
  overflow: auto;

  .login-image {
    flex: 1;
    background: url('@/assets/images/login_image.jpg') no-repeat center center;
    background-size: 100% 100%;
  }

  .login-form {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 512px;
    padding: 20px 40px;
    background: #fff;

    .form-title {
      display: flex;
      align-items: center;
      font-size: 24px;
      letter-spacing: 1px;
      color: #999;
      margin-bottom: 20px;

      img {
        width: auto;
        height: 28px;
        margin: 4px;
      }
    }

    .form-content {
      width: 100%;

      .form-submit {
        width: 100%;
        background: #cf6764;
        color: #fff;
      }

      .el-button {
        --el-button-active-text-color: #cf6764;
        --el-button-active-border-color: #cf6764;
      }

      .el-input {
        --el-input-focus-border: #e4997b;
        --el-input-focus-border-color: #e4997b;
      }
    }
  }
}

@media screen and (min-width: 992px) {
  .login-view {
    .login-form {
      position: relative;
      top: 0;
      left: 0;
      transform: translate(0, 0);
      width: 384px;
    }
  }
}

@media screen and (min-width: 1200px) {
  .login-view {
    .login-form {
      width: 512px;
    }
  }
}
</style>
