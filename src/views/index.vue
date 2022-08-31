<template>
  <div class="dashboard-editor-container">
    OA多租户平台租户端    
  </div>
</template>

<script>

export default {
  name: 'Index',
  components: {
  },
  data () {
    return {}
  },
  created () {
    
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  // background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
.followup-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #eee;
}
.followup-table th {
  width: 150px;
}
.followup-table th,
td {
  color: #7e7e7e;
  border: 1px solid #eee;
  text-align: left;
  padding: 10px;
}

.today-updates {
  font-size: 14px;
  padding: 18px 0;
  border-bottom: 1px solid #eee;
}

.today-updates .updates-customer {
  color: blue;
}
.today-updates .content {
  color: #ee8323;
}

.today-followup {
  font-size: 14px;
  padding: 18px 0;
  border-bottom: 1px solid #eee;
}

.time {
  color: #7e7e7e;
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
