<template>
  <div class="edit-view">
    <h2 class="view-title">文章编辑</h2>
    <el-form
      ref="articleForm"
      :model="article"
      label-position="left"
      :rules="rules"
      :hide-required-asterisk="true"
    >
      <el-form-item label="文章标题：" prop="title">
        <el-input v-model="article.title" placeholder="请输入文章标题" style="width: 100%" />
      </el-form-item>
      <el-form-item prop="content">
        <mavon-editor
          ref="editor"
          v-model="article.content"
          @imgAdd="uploadImage"
          @imgDel="deleteImage"
          @change="changeEditorContent"
          style="width: 100%; height: 600px"
        />
      </el-form-item>
      <el-form-item label="文章分类：" prop="classify">
        <el-select
          v-model="article.classify"
          @change="selectClassify"
          placeholder="请选择文章分类"
          style="width: 394px"
        >
          <el-option
            v-for="item in classifyOptions"
            :key="item._id"
            :label="item.classify"
            :value="item._id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="文章标签：" prop="label">
        <el-select
          v-model="article.label"
          multiple
          collapse-tags
          collapse-tags-tooltip
          :max-collapse-tags="3"
          placeholder="请选择文章标签"
          style="width: 394px"
        >
          <el-option
            v-for="item in labelOptions"
            :key="item._id"
            :label="item.label"
            :value="item._id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="文章封面：" prop="cover">
        <div class="upload-box">
          <input class="upload-input" type="file" @change="uploadCover" />
          <el-icon v-if="article.cover == ''" class="upload-icon"><Plus /></el-icon>
          <img v-else :src="showCover" alt="文章封面" class="cover-image" />
        </div>
      </el-form-item>
      <el-form-item label="发布状态：" prop="publish">
        <el-switch v-model="article.publish" :active-value="1" :inactive-value="0" />
      </el-form-item>
      <el-form-item>
        <el-button class="form-submit" size="large" @click="publishArticle">{{
          typeTitle
        }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import config from '@/config'
export default {
  data() {
    return {
      type: 'create',
      typeTitle: '发布文章',
      article: {
        title: '',
        classify: '',
        label: [],
        content: '',
        cover: '',
        publish: 1
      },
      imageBaseUrl: config.imageBaseUrl,
      showCover: '',
      labelOptions: [],
      classifyOptions: [],
      rules: {
        title: [{ required: true, message: '请输入文章标签', trigger: 'blur' }],
        content: [{ required: true, message: '请编辑文章内容', trigger: 'blur' }],
        classify: [{ required: true, message: '请选择文章分类', trigger: 'change' }]
      }
    }
  },
  methods: {
    async uploadImage(filename, imageFile) {
      let formData = new FormData()
      formData.append('articleImage', imageFile)
      let { data } = await this.$api.uploadImage(formData)
      let imageUrl = this.imageBaseUrl + data.articleImage
      this.$refs.editor.$img2Url(filename, imageUrl)
    },
    async deleteImage(filename) {
      let deleteFile = filename[0]
      let articleImage = deleteFile.replace(this.imageBaseUrl, '')
      let { data } = await this.$api.deleteImage({ articleImage })
      this.$message.success({ message: data.message })
    },
    changeEditorContent(value, render) {
      this.article.content = render
    },
    uploadCover(event) {
      let file = event.target.files[0]
      this.article.cover = file
      let reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        this.showCover = reader.result
      }
      reader.onerror = function (error) {
        throw new Error(error)
      }
      event.target.value = ''
    },
    async getClassify() {
      let { data } = await this.$api.searchClassify()
      this.classifyOptions = data.list
    },
    async selectClassify() {
      if (this.article.classify) {
        let params = { classify: this.article.classify }
        let { data } = await this.$api.searchLabel(params)
        this.labelOptions = data.list
      }
    },
    async publishArticle() {
      this.$refs['articleForm'].validate(async (valid) => {
        if (valid) {
          let formData = new FormData()
          formData.append('title', this.article.title)
          formData.append('content', this.article.content)
          formData.append('classify', this.article.classify)
          formData.append('label', this.article.label)
          formData.append('cover', this.article.cover)
          formData.append('publish', this.article.publish)
          if (this.type === 'create') {
            let { data } = await this.$api.uploadArticle(formData)
            this.$message.success(data.message)
          } else if (this.type === 'edit') {
            formData.append('id', this.article._id)
            let { data } = await this.$api.updateArticle(formData)
            this.$message.success(data.message)
          }
          this.$refs['articleForm'].resetFields()
          this.$router.push({ path: '/manageArticle' })
        } else {
          return false
        }
      })
    },
    async getArticleDetail(id) {
      let { data } = await this.$api.articleDetail({ id })
      data.classify = data.classify._id
      data.label = data.label.map((item) => item._id)
      this.article = data
      this.selectClassify()
      this.showCover = this.imageBaseUrl + this.article.cover
    }
  },
  mounted() {
    this.getClassify()
    if (this.$route.query.id) {
      this.type = 'edit'
      this.typeTitle = '更新文章'
      this.getArticleDetail(this.$route.query.id)
    } else {
      this.type = 'create'
      this.typeTitle = '发布文章'
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-view {
  box-sizing: border-box;
  padding: 20px;

  .view-title {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 20px;
  }

  .upload-box {
    position: relative;
    width: 178px;
    height: 89px;
    border: 1px dashed #d9d9d9;
    .upload-input {
      width: 178px;
      height: 89px;
      display: inline-block;
      opacity: 0;
      cursor: pointer;
    }

    .upload-icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: -1;
    }

    .cover-image {
      position: absolute;
      z-index: -1;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }

    &:hover {
      border: 1px dashed #cf6764;
    }
  }

  .form-submit {
    width: 477px;
    background: #cf6764;
    color: #fff;
  }
}
</style>
