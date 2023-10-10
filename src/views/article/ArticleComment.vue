<template>
  <div class="article-comment">
    <h2 class="title">文章评论</h2>
    <el-form :inline="true" :model="searchForm">
      <el-form-item label="留言署名：" prop="name">
        <el-input v-model="searchForm.name" placeholder="请输入查询署名" />
      </el-form-item>
      <el-form-item label="发布状态：" prop="publish">
        <el-select v-model="searchForm.publish" placeholder="请选择发布状态">
          <el-option label="全部" value="" />
          <el-option label="已发布" :value="1" />
          <el-option label="未发布" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchComment">查询</el-button>
      </el-form-item>
    </el-form>
    <div style="margin-bottom: 20px">
      <el-button type="danger" @click="deleteMore">批量删除</el-button>
    </div>
    <div class="table-container">
      <el-table
        ref="commentTable"
        :data="commentList"
        height="600px"
        style="position: absolute; left: 0; top: 0"
        @selection-change="selectionComment"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="title" label="文章名称">
          <template #default="scope">
            {{ scope.row.article.title }}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="评论署名" />
        <el-table-column prop="content" label="评论内容" />
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
            <el-button link type="danger" @click="deleteComment(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-container">
      <el-pagination
        layout="total, prev, pager, next"
        :total="commentTotal"
        @current-change="changeCurrentPage"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchForm: {
        name: '',
        publish: '',
        pageNumber: 1,
        pageSize: 10
      },
      commentList: [],
      commentTotal: 0,
      deleteArray: []
    }
  },
  methods: {
    async searchComment() {
      let { data } = await this.$api.getArticleComment(this.searchForm)
      this.commentList = data.list
      this.commentTotal = data.page.count
      console.log(this.commentList)
    },
    async changePublish(item) {
      let params = {
        id: item._id,
        publish: item.publish
      }
      await this.$api.updateArticleComment(params)
      this.$message.success('发布状态修改成功')
      this.searchComment()
    },
    async deleteComment(item) {
      let params = { id: item._id }
      let { data } = await this.$api.deleteArticleComment(params)
      this.$message.success(data.message)
      this.searchComment()
    },
    async deleteMore() {
      if (this.deleteArray.length === 0) {
        this.$message.warning('请选择需要删除的文章评论')
      } else {
        let { data } = await this.$api.deleteArticleComment({ id: this.deleteArray })
        this.$message.success(data.message)
        this.searchComment()
      }
    },
    selectionComment(value) {
      for (let item of value) {
        this.deleteArray.push(item._id)
      }
    },
    changeCurrentPage(number) {
      this.searchForm.pageNumber = number
      this.searchComment()
    }
  },
  mounted() {
    this.searchComment()
  }
}
</script>

<style lang="scss" scoped>
.article-comment {
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
