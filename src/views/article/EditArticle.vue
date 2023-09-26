<template>
  <div class="edit-view">
    <h2 class="view-title">发布文章</h2>
    <el-form :model="article" label-position="left">
      <el-form-item label="文章标题：">
        <el-input v-model="article.title" placeholder="请输入文章标题" style="width: 100%" />
      </el-form-item>
      <el-form-item>
        <mavon-editor
          ref="editor"
          v-model="article.content"
          @imgAdd="uploadImage"
          @imgDel="deleteImage"
          @change="changeEditorContent"
          style="width: 100%; height: 600px"
        />
      </el-form-item>
      <el-form-item label="文章分类：">
        <el-select v-model="article.type" placeholder="请选择文章分类" style="width: 394px">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="文章标签：">
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
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="文章封面：">
        <div class="upload-box">
          <input class="upload-input" type="file" @change="uploadCover" />
          <el-icon v-if="article.coverImage == ''" class="upload-icon"><Plus /></el-icon>
          <img v-else :src="showCover" alt="文章封面" class="cover-image" />
        </div>
      </el-form-item>
      <el-form-item>
        <el-button class="form-submit" size="large">发布文章</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import config from '@/config'
export default {
  data() {
    return {
      article: {
        title: '',
        type: '',
        label: '',
        content: '',
        coverImage: ''
      },
      showCover: '',
      labelOptions: [
        {
          value: 'HTML',
          label: 'HTML'
        },
        {
          value: 'CSS',
          label: 'CSS'
        },
        {
          value: 'JavaScript',
          label: 'JavaScript'
        },
        {
          value: 'NodeJS',
          label: 'NodeJS'
        }
      ],
      typeOptions: [
        {
          value: '前端基础',
          label: '前端基础'
        }
      ]
    }
  },
  methods: {
    async uploadImage(filename, imageFile) {
      let formData = new FormData()
      formData.append('articleImage', imageFile)
      let { data } = await this.$api.uploadImage(formData)
      let imageUrl = config.imageBaseUrl + data.articleImage
      this.$refs.editor.$img2Url(filename, imageUrl)
    },
    async deleteImage(filename) {
      let deleteFile = filename[0]
      let articleImage = deleteFile.replace(config.imageBaseUrl, '')
      let { data } = await this.$api.deleteImage({ articleImage })
      this.$message.success({ message: data.message })
    },
    changeEditorContent(value, render) {
      this.article.content = render
    },
    uploadCover(event) {
      let file = event.target.files[0]
      this.article.coverImage = file
      let reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        this.showCover = reader.result
      }
      reader.onerror = function (error) {
        throw new Error(error)
      }
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
