<script >
import { addCost } from "../models/costApi";
export default {
    data() {
        return {
            records: [],
            isLoading: true,
            newInput: {
                cash: 5,
                name: '',
                remark: ''
            }
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
                console.log('成功' + JSON.stringify(response.data));
            } catch (err) {

            }
            // 重設輸入
            this.newInput = {
                cash: 0,
                name: '',
                remark: '',
            }
        }
    }
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
</template>

<style scoped>
</style>
