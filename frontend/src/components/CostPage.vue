<script >
import { addCost, getCosts } from "../models/costApi";
export default {

    data() {
        return {
            records: [],
            isLoading: false,
            newInput: {
                cash: 5,
                name: '',
                remark: ''
            },
            showCosts: {
                limit: 10,
                offset: 0,
            },
            costs: [],

        }
    },
    methods: {
        async addNewCost() {
            const { cash, name, remark } = this.newInput;
            // 不接受任何一個欄位為空
            if (cash === undefined || name === undefined || remark === undefined) {
                return console.log('不接受空值');
            }
            try {
                const response = await addCost({ cash, name, remark });
                const data = response?.data;
                console.log('成功' + JSON.stringify(data));
                if (!(data?.success === true)) throw new Error('無回傳成功狀態');

                const insertId = data?.dataValues?.id;
                if (insertId === undefined) throw new Error('沒有取得新增ID');

                this.costs.push({ cash, name, remark, id: insertId })
            } catch (err) {
                return alert(`新增失敗，大笨蛋！ ${err}`)
            }
            // 重設輸入
            this.newInput = {
                cash: 0,
                name: '',
                remark: '',
            }
        },
        async refreshCostList() {
            try {
                const { limit, offset } = this.showCosts;
                const response = await getCosts({ limit, offset });
                if (!(response?.data?.success === true)) throw new Error('無回傳成功狀態');
                this.costs = response?.data?.costs ?? [];
            } catch (error) {
                return alert('請求列表失敗，大笨蛋！')
            }
        }
    },
    mounted() {
        this.refreshCostList()
    },
}
</script>

<template>
    <div>
        <h1>日常花費記錄器</h1>
        <div>
            <label for="newName">名目</label>
            <input id="newName" type="text" v-model="newInput.name">
        </div>
        <div>
            <label for="newCash">金額</label>
            <input v-model.number="newInput.cash" min="0" step="1" type="number" />
        </div>
        <div>
            <label for="newRemark">註解</label>
            <input id="newRemark" type="text" v-model="newInput.remark">
        </div>
        <button @click="addNewCost">新增花費</button>
    </div>

    <div>
        <button @click="refreshCostList">刷新列表</button>
        <div>
            <div v-for="cost in costs" :key="cost.id">
                {{ cost.name }}
                {{ cost.cash }}
                {{ cost.remark }}

            </div>
        </div>
    </div>
</template>

<style scoped>
</style>
