<template>
  <div class="classify-view">
    <div class="title">分类管理</div>
    <el-form :inline="true" :model="searchForm">
      <el-form-item label="分类：" prop="label">
        <el-input v-model="searchForm.classify" placeholder="请输入查询分类" />
      </el-form-item>
      <el-form-item label="发布状态：" prop="publish">
        <el-select v-model="searchForm.publish" placeholder="请选择发布状态">
          <el-option label="全部" value="" />
          <el-option label="已发布" :value="1" />
          <el-option label="未发布" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchClassify">查询</el-button>
      </el-form-item>
    </el-form>
    <div style="margin-bottom: 20px">
      <el-button type="success" @click="openCreateDialog">创建分类</el-button>
      <el-button type="danger" @click="deleteMore">批量删除</el-button>
    </div>
    <div class="table-container">
      <el-table
        v-loading="loading"
        ref="classifyTable"
        :data="classifyTable"
        height="600px"
        @selection-change="selectionClassify"
        style="position: absolute; left: 0; top: 0"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="classify" label="分类" />
        <el-table-column prop="cover" label="默认封面">
          <template #default="scope">
            <img :src="imageBaseUrl + scope.row.cover" style="width: 120px; height: auto" />
          </template>
        </el-table-column>
        <el-table-column prop="publish" label="发布状态">
          <template #default="scope">
            <el-switch
              v-model="scope.row.publish"
              :active-value="1"
              :inactive-value="0"
              @change="changePublish(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button link type="primary" @click="openEidtDialog(scope.row)">编辑</el-button>
            <el-button link type="danger" @click="deleteClassify(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-container">
      <el-pagination
        layout="total, prev, pager, next"
        :total="tableTotal"
        @current-change="changeCurrentPage"
      />
    </div>
    <el-dialog
      v-model="dialogClassify"
      :show-close="false"
      :close-on-click-modal="false"
      :title="dialogTitle"
      width="600px"
    >
      <el-form
        ref="classifyForm"
        :model="classifyForm"
        :rules="rules"
        label-width="100px"
        :hide-required-asterisk="true"
      >
        <el-form-item label="分类：" prop="classify">
          <el-input v-model="classifyForm.classify" placeholder="请输入分类名" />
        </el-form-item>
        <el-form-item label="默认封面：" prop="cover">
          <div class="upload-box">
            <input class="upload-input" type="file" @change="uploadCover" />
            <el-icon v-if="classifyForm.cover == ''" class="upload-icon"><Plus /></el-icon>
            <img v-else :src="showCover" alt="默认封面" class="cover-image" />
          </div>
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input
            v-model="classifyForm.remark"
            :rows="4"
            type="textarea"
            placeholder="请输入备注"
            resize="none"
          />
        </el-form-item>
        <el-form-item label="发布状态：" prop="publish">
          <el-switch v-model="classifyForm.publish" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="affirm">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import config from '@/config'
export default {
  data() {
    return {
      type: 'create',
      loading: false,
      dialogClassify: false,
      dialogTitle: '创建分类',
      deleteArray: [],
      showCover: '',
      tableTotal: 0,
      imageBaseUrl: config.imageBaseUrl,
      classifyForm: {
        classify: '',
        cover: '',
        remark: '',
        publish: 1
      },
      searchForm: {
        classify: '',
        publish: '',
        pageNumber: 1,
        pageSize: 10
      },
      classifyTable: [],
      rules: {
        classify: [{ required: true, message: '请输入分类名', trigger: 'blur' }],
        cover: [{ required: true, message: '请上传默认封面', trigger: 'blur' }]
      }
    }
  },
  methods: {
    async searchClassify() {
      this.loading = true
      let { data } = await this.$api.searchClassify(this.searchForm)
      this.tableTotal = data.page.count
      this.classifyTable = data.list
      this.loading = false
    },
    cancel() {
      this.$nextTick(() => {
        this.dialogClassify = false
        this.type = 'create'
        this.dialogTitle = '创建分类'
        this.$refs['classifyForm'].resetFields()
      })
    },
    async changePublish(item) {
      let formData = new FormData()
      formData.append('id', item._id)
      formData.append('publish', item.publish)
      await this.$api.editClassify(formData)
      this.$message.success('发布状态修改成功')
      this.searchClassify()
    },
    uploadCover(event) {
      let file = event.target.files[0]
      this.classifyForm.cover = file
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
    async openEidtDialog(item) {
      this.type = 'edit'
      this.dialogClassify = true
      this.dialogTitle = '编辑分类'
      this.classifyForm = JSON.parse(JSON.stringify(item))
      this.showCover = this.imageBaseUrl + this.classifyForm.cover
    },
    async openCreateDialog() {
      this.dialogClassify = true
      this.type = 'create'
    },
    async affirm() {
      this.$refs['classifyForm'].validate(async (valid) => {
        if (valid) {
          let formData = new FormData()
          formData.append('id', this.classifyForm._id)
          formData.append('classify', this.classifyForm.classify)
          formData.append('cover', this.classifyForm.cover)
          formData.append('remark', this.classifyForm.remark)
          formData.append('publish', this.classifyForm.publish)
          if (this.type === 'create') {
            let { data } = await this.$api.createClassify(formData)
            this.$message.success(data.message)
          } else if (this.type === 'edit') {
            let { data } = await this.$api.editClassify(formData)
            this.$message.success(data.message)
          }
          this.dialogClassify = false
          this.showCover = ''
          this.$refs['classifyForm'].resetFields()
          this.classifyForm.cover = ''
          this.searchClassify()
        } else {
          return false
        }
      })
    },
    async changeCurrentPage(number) {
      this.searchForm.pageNumber = number
      this.searchClassify()
    },
    async deleteClassify(item) {
      let params = { id: item._id }
      let { data } = await this.$api.deleteClassify(params)
      this.$message.success(data.message)
      this.searchClassify()
    },
    async selectionClassify(value) {
      for (let item of value) {
        this.deleteArray.push(item._id)
      }
    },
    async deleteMore() {
      if (this.deleteArray.length === 0) {
        this.$message.warning('请选择需要删除的分类')
      } else {
        let { data } = await this.$api.deleteClassify({ id: this.deleteArray })
        this.$message.success(data.message)
        this.searchClassify()
      }
    }
  },
  mounted() {
    this.searchClassify()
  }
}
</script>

<style lang="scss" scoped>
.classify-view {
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 20px;

  .title {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 20px;
  }

  .table-container {
    position: relative;
    width: 100%;
    height: 600px;
  }

  .page-container {
    display: flex;
    justify-content: end;
    padding: 20px 0px;
  }

  .upload-box {
    position: relative;
    width: 178px;
    height: 89px;
    border: 1px dashed #d9d9d9;
    z-index: 1;
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
  .el-form--inline .el-form-item {
    margin-right: 16px !important;
  }
  .el-dialog__footer {
    padding-top: 0px !important;
  }
}
</style>
