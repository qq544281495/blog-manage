<template>
  <div class="label-view">
    <div class="title">标签管理</div>
    <el-form :inline="true" :model="searchForm">
      <el-form-item label="标签：" prop="label">
        <el-input v-model="searchForm.label" placeholder="请输入查询标签名" />
      </el-form-item>
      <el-form-item label="发布状态：" prop="publish">
        <el-select v-model="searchForm.publish" placeholder="请选择发布状态">
          <el-option label="全部" value="" />
          <el-option label="已发布" :value="1" />
          <el-option label="未发布" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchLabel">查询</el-button>
      </el-form-item>
    </el-form>
    <div style="margin-bottom: 20px">
      <el-button type="success" @click="openDialog">创建标签</el-button>
      <el-button type="danger" @click="deleteMore">批量删除</el-button>
    </div>
    <!-- 标签表格 -->
    <div class="table-container">
      <el-table
        v-loading="loading"
        ref="labelTable"
        :data="labelData"
        height="600px"
        @selection-change="selectionLabel"
        style="position: absolute; left: 0; top: 0"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="label" label="标签" />
        <el-table-column prop="classify" label="所属分类">
          <template #default="scope">
            <div>{{ scope.row.classify.classify }}</div>
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
            <el-button link type="primary" @click="editLabel(scope.row)">编辑</el-button>
            <el-button link type="danger" @click="deleteLabel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="page-container">
      <el-pagination
        layout="total, prev, pager, next"
        :total="tableTotal"
        @current-change="changeCurrentPage"
      />
    </div>
    <!-- 标签弹窗 -->
    <el-dialog
      v-model="dialogLabel"
      :show-close="false"
      :close-on-click-modal="false"
      :title="dialogTitle"
      width="600px"
    >
      <el-form
        ref="createForm"
        :model="createForm"
        :rules="rules"
        label-width="100px"
        :hide-required-asterisk="true"
      >
        <el-form-item label="标签：" prop="label">
          <el-input v-model="createForm.label" placeholder="请输入标签名" />
        </el-form-item>
        <el-form-item label="所属分类：" prop="classify">
          <el-select v-model="createForm.classify" placeholder="请选择所属分类" style="width: 100%">
            <el-option
              v-for="item of classifyList"
              :key="item._id"
              :label="item.classify"
              :value="item._id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input
            v-model="createForm.remark"
            :rows="4"
            type="textarea"
            placeholder="请输入备注"
            resize="none"
          />
        </el-form-item>
        <el-form-item label="发布状态：" prop="publish">
          <el-switch v-model="createForm.publish" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cancelDialog">取消</el-button>
        <el-button type="primary" @click="createLabel">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchForm: {
        label: '',
        publish: '',
        pageNumber: 1,
        pageSize: 10
      },
      createForm: {
        label: '',
        classify: '',
        remark: '',
        publish: 1
      },
      type: 'create',
      loading: false,
      classifyList: [],
      dialogLabel: false,
      dialogTitle: '创建标签',
      labelData: [],
      deleteArray: [],
      tableTotal: 0,
      rules: {
        label: [{ required: true, message: '请输入标签名', trigger: 'blur' }],
        classify: [{ required: true, message: '请选择分类', trigger: 'change' }]
      }
    }
  },
  methods: {
    // 查询表单
    async searchLabel() {
      this.loading = true
      let { data } = await this.$api.searchLabel(this.searchForm)
      this.tableTotal = data.page.count
      this.labelData = data.list
      this.loading = false
    },
    // 批量删除
    async deleteMore() {
      if (this.deleteArray.length === 0) {
        this.$message.warning('请选择需要删除的标签')
      } else {
        let { data } = await this.$api.deleteLabel({ id: this.deleteArray })
        this.$message.success(data.message)
        this.searchLabel()
      }
    },
    selectionLabel(value) {
      for (let item of value) {
        this.deleteArray.push(item._id)
      }
    },
    // 创建标签
    async openDialog() {
      this.dialogLabel = true
      this.type = 'create'
    },
    // 关闭弹窗
    cancelDialog() {
      this.$nextTick(() => {
        this.dialogLabel = false
        this.type = 'create'
        this.dialogTitle = '创建标签'
        this.$refs['createForm'].resetFields()
      })
    },
    // 编辑标签
    async editLabel(item) {
      this.dialogLabel = true
      this.type = 'edit'
      this.dialogTitle = '编辑标签'
      this.createForm = JSON.parse(JSON.stringify(item))
      this.createForm.classify = this.createForm.classify.classify
    },
    // 删除标签
    async deleteLabel(item) {
      let params = { id: item._id }
      let { data } = await this.$api.deleteLabel(params)
      this.$message.success(data.message)
      this.searchLabel()
    },
    // 切换发布状态
    async changePublish(item) {
      let params = {
        _id: item._id,
        publish: item.publish
      }
      await this.$api.updateLabel(params)
      this.$message.success('发布状态修改成功')
      this.searchLabel()
    },
    // 创建 | 编辑标签
    async createLabel() {
      this.$refs['createForm'].validate(async (valid) => {
        if (valid) {
          if (this.type === 'create') {
            let { data } = await this.$api.createLabel(this.createForm)
            this.$message.success(data.message)
          } else if (this.type === 'edit') {
            let { data } = await this.$api.updateLabel(this.createForm)
            this.$message.success(data.message)
          }
          this.dialogLabel = false
          this.$refs['createForm'].resetFields()
          this.searchLabel()
        } else {
          return false
        }
      })
    },
    // 切换分页
    async changeCurrentPage(number) {
      this.searchForm.pageNumber = number
      this.searchLabel()
    },
    // 获取分类列表
    async getClassifyList() {
      let { data } = await this.$api.searchClassify()
      this.classifyList = data.list
    }
  },
  mounted() {
    this.searchLabel()
    this.getClassifyList()
  }
}
</script>

<style lang="scss" scoped>
.label-view {
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
  .el-form--inline .el-form-item {
    margin-right: 16px !important;
  }
  .el-dialog__footer {
    padding-top: 0px !important;
  }
}
</style>
