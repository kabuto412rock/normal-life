<script >
import { addCost, getCosts, deleteCost, updateCost } from "../models/costApi";
import { debounce } from "lodash";
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

                this.costs.push({ cash, name, remark, id: insertId, checked: false })
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
        },
        async deleteSelected() {
            const deletePromises = this.costs.filter((cost) => cost.checked === true).map((cost) => deleteCost(cost.id));
            const results = await Promise.allSettled(deletePromises);

            // TODO:偷吃步的方式直接去跟Server要最新的資料，刷新costs
            // this.refreshCostList()
            const deletedIds = results.filter((result) => (result.status === 'fulfilled' && result.value?.data?.success === 1)).map(result => result.value?.data)
            console.log(`deletedIds: ${deletedIds}`);
            // console.log(`deletedIds = ${JSON.stringify(deletedIds)}`)
            // const aliveCosts = this.costs.filter((cost) => !(deletedIds.includes(cost.id)));
            // this.costs = aliveCosts;
        },
        updateSingleCost: debounce(async function (cost) {
            let costData = { id: cost.id, name: cost.name, cash: cost.cash, remark: cost.remark };
            const result = await updateCost(costData);
            console.log(result?.data?.success === 1 ? '更新成功' : '更新失敗')
        }, 500)
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
            <input id="newName" type="text" v-model="newInput.name" @keyup="updateSingleCost">
        </div>
        <div>
            <label for="newCash">金額</label>
            <input v-model.number="newInput.cash" min="0" step="1" type="number" @keyup="updateSingleCost" />
        </div>
        <div>
            <label for="newRemark">註解</label>
            <input id="newRemark" type="text" v-model="newInput.remark" @keyup="updateSingleCost">
        </div>
        <button @click="addNewCost">新增花費</button>
    </div>

    <div>
        <div>
            <button @click="refreshCostList">刷新列表</button>
            <button @click="deleteSelected">刪除勾選項目</button>
        </div>
        <table>
            <thead>
                <th>選取</th>
                <th>項目</th>
                <th>花費</th>
                <th>備註</th>
            </thead>
            <tbody>
                <tr v-for="cost in costs" :key="cost.id">
                    <td>
                        <input type="checkbox" v-model="cost.checked">
                        <button @click="updateSingleCost(cost)">更新</button>
                    </td>
                    <td>
                        <input type="text" v-model="cost.name" />
                    </td>
                    <td>
                        <input v-model.number="cost.cash" min="0" step="1" type="number" />
                    </td>
                    <td>
                        <input type="text" v-model="cost.remark" />
                    </td>
                </tr>
            </tbody>


        </table>
    </div>
</template>

<style scoped>
thead th {
    border: 1px solid black;
}

tbody td {
    box-shadow: 1px 1px grey;

}
</style>
