<template>
  <div class="edit-view">
    <h2 class="title">项目编辑</h2>
    <el-form
      ref="projectForm"
      :model="projectParams"
      label-position="left"
      :hide-required-asterisk="true"
      :rules="rules"
    >
      <el-form-item label="项目名称：" prop="name">
        <el-input v-model="projectParams.name" placeholder="请输入项目名称：" style="width: 100%" />
      </el-form-item>
      <el-form-item label="项目技术栈：" prop="technology">
        <el-input
          v-model="projectParams.technology"
          placeholder="请输入项目技术栈："
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item prop="content">
        <mavon-editor
          ref="editor"
          v-model="projectParams.editContent"
          @imgAdd="uploadImage"
          @imgDel="deleteImage"
          @change="changeEditorContent"
          style="width: 100%; height: 600px"
        />
      </el-form-item>
      <el-form-item label="项目描述：" prop="description">
        <el-input
          v-model="projectParams.description"
          :rows="4"
          type="textarea"
          placeholder="请输入项目描述"
          resize="none"
          style="width: 394px"
        />
      </el-form-item>
      <el-form-item label="文章封面：" prop="cover">
        <div class="upload-box">
          <input class="upload-input" type="file" @change="uploadCover" />
          <el-icon v-if="projectParams.cover == ''" class="upload-icon"><Plus /></el-icon>
          <img v-else :src="showCover" alt="文章封面" class="cover-image" />
        </div>
      </el-form-item>
      <el-form-item label="发布状态：" prop="publish">
        <el-switch v-model="projectParams.publish" :active-value="1" :inactive-value="0" />
      </el-form-item>
      <el-form-item>
        <el-button class="form-submit" size="large" @click="publishProject">{{
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
      typeTitle: '发布项目',
      imageBaseUrl: config.imageBaseUrl,
      projectParams: {
        name: '',
        technology: '',
        content: '',
        editContent: '',
        description: '',
        cover: '',
        publish: 1
      },
      showCover: '',
      rules: {
        name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
        technology: [{ required: true, message: '请输入项目技术栈', trigger: 'blur' }],
        content: [{ required: true, message: '请编辑项目内容', trigger: 'blur' }],
        description: [{ required: true, message: '请输入项目描述', trigger: 'blur' }],
        cover: [{ required: true, message: '请上传项目封面', trigger: 'blur' }]
      }
    }
  },
  methods: {
    async publishProject() {
      this.$refs['projectForm'].validate(async (valid) => {
        if (valid) {
          let formData = new FormData()
          formData.append('name', this.projectParams.name)
          formData.append('technology', this.projectParams.technology)
          formData.append('content', this.projectParams.content)
          formData.append('editContent', this.projectParams.editContent)
          formData.append('description', this.projectParams.description)
          formData.append('cover', this.projectParams.cover)
          formData.append('publish', this.projectParams.publish)

          if (this.type === 'create') {
            let { data } = await this.$api.createProject(formData)
            this.$message.success(data.message)
          } else if (this.type === 'edit') {
            formData.append('id', this.projectParams._id)
            let { data } = await this.$api.updateProject(formData)
            this.$message.success(data.message)
          }
          this.$refs['projectForm'].resetFields()
          this.$router.push({ path: '/manageProject' })
        } else {
          return false
        }
      })
    },
    async uploadImage(filename, imageFile) {
      let formData = new FormData()
      formData.append('image', imageFile)
      let { data } = await this.$api.uploadImage(formData)
      let imageUrl = this.imageBaseUrl + data.image
      this.$refs.editor.$img2Url(filename, imageUrl)
    },
    async deleteImage(filename) {
      let deleteFile = filename[0]
      let image = deleteFile.replace(this.imageBaseUrl, '')
      let { data } = await this.$api.deleteImage({ image })
      this.$message.success({ message: data.message })
    },
    changeEditorContent(value, render) {
      this.projectParams.content = render
    },
    uploadCover(event) {
      let file = event.target.files[0]
      this.projectParams.cover = file
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
    async getProjectDetail(id) {
      let { data } = await this.$api.projectDetail({ id })
      this.projectParams = data
      this.showCover = this.imageBaseUrl + this.projectParams.cover
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.type = 'edit'
      this.typeTitle = '更新项目'
      this.getProjectDetail(this.$route.query.id)
    } else {
      this.type = 'create'
      this.typeTitle = '发布项目'
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-view {
  box-sizing: border-box;
  padding: 20px;

  .title {
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
