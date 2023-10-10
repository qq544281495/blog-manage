<template>
  <div class="manage-project">
    <h2 class="title">项目管理</h2>
    <el-form :inline="true" :model="searchForm">
      <el-form-item label="项目名称：" prop="name">
        <el-input v-model="searchForm.name" placeholder="请输入查询项目名称" />
      </el-form-item>
      <el-form-item label="发布状态：" prop="publish">
        <el-select v-model="searchForm.publish" placeholder="请选择发布状态">
          <el-option label="全部" value="" />
          <el-option label="已发布" :value="1" />
          <el-option label="未发布" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
      </el-form-item>
    </el-form>
    <div style="margin-bottom: 20px">
      <el-button type="danger" @click="deleteMore">批量删除</el-button>
    </div>
    <div class="table-container">
      <el-table
        :data="tableData"
        height="600px"
        @selection-change="selectionProject"
        style="position: absolute; left: 0; top: 0"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="项目名称" />
        <el-table-column prop="cover" label="项目封面">
          <template #default="scope">
            <img :src="imageBaseUrl + scope.row.cover" style="width: 120px; height: 46px" />
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
        <el-table-column label="操作">
          <template #default="scope">
            <el-button link type="primary" @click="edit(scope.row)">编辑</el-button>
            <el-button link type="danger" @click="deleteArticle(scope.row)">删除</el-button>
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
  </div>
</template>

<script>
import config from '@/config'
export default {
  data() {
    return {
      searchForm: {
        name: '',
        publish: '',
        pageNumber: 1,
        pageSize: 10
      },
      tableData: [],
      deleteArray: [],
      tableTotal: 0,
      imageBaseUrl: config.imageBaseUrl
    }
  },
  methods: {
    async changePublish(item) {
      let formData = new FormData()
      formData.append('id', item._id)
      formData.append('publish', item.publish)
      await this.$api.updateProject(formData)
      this.$message.success('发布状态修改成功')
      this.search()
    },
    async deleteMore() {
      if (this.deleteArray.length === 0) {
        this.$message.warning('请选择需要删除的文章')
      } else {
        let { data } = await this.$api.deleteProject({ id: this.deleteArray })
        this.$message.success(data.message)
        this.search()
      }
    },
    async deleteArticle(item) {
      let params = { id: item._id }
      let { data } = await this.$api.deleteProject(params)
      this.$message.success(data.message)
      this.search()
    },
    async search() {
      let { data } = await this.$api.searchProject(this.searchForm)
      this.tableData = data.list
      this.tableTotal = data.page.count
    },
    selectionProject(value) {
      for (let item of value) {
        this.deleteArray.push(item._id)
      }
    },
    async changeCurrentPage(number) {
      this.searchForm.pageNumber = number
      this.search()
    },
    edit(item) {
      this.$router.push({
        path: '/editProject',
        query: {
          id: item._id
        }
      })
    },
    filterLabel(labelArray) {
      let str = ''
      if (Array.isArray(labelArray)) {
        let array = []
        for (let item of labelArray) {
          array.push(item.label)
        }
        str = array.toString()
      }
      return str
    }
  },
  mounted() {
    this.search()
  }
}
</script>

<style lang="scss" scoped>
.manage-project {
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
}
</style>
