# normal-life
## 啟動此SideProject原因 

新工作開始後，開始寫的第一個Side Project
目前計畫這個normal-life會是一個大雜燴，
也就是我想做什麼功能就都會丟進來，這是一個沒有目標的Project。

雖然這樣說，因為目前工作是偏Node.js後端的工作，沒有在接觸前端，
但看大家在用Vue.js感覺蠻酷的，也想拿來試試看是否真的有那麼簡單上手。

工作日開發規則(假日不受此限):
- 早上不能寫Side Project
- 不能超過1小時半在寫Side Project
- 都要寫code並增加功能，重構不算新功能
- 都要push到Github
- 程式技術相關學習推到網路上(YT、Blog、小Demo)都可以算寫code，此舉是為了增加學習的多樣性！
## Develop Log
2022/07/31
今天第一步就是先把前後端環境初始化一下，至少前後端兩邊都可以跑起來這樣...

2022/08/01
引入Sequalize，並且實做日常花費的REST API(Daily Cost)
目前只做了新增、列出全部的API

2022/08/02
DONE:查詢的API增加limit、offset參數功能
DONE:刪除單筆、更新單筆的API

2022/08/03
目前陷入困境，哈哈竟然忘記axios的API，但想先休息，明天在思考為什麼前端傳了body，也沒出現cors，
為什麼後端收不到req.body，但後端有收到request
2022/08/04
使用Vue請求更新日常花費列表

2022/08/05
刪除勾選日常花費的功能

2022/08/08
使用按鈕點擊更新一筆日常花費

2022/08/09
調整刪除的機制，便得比較有效率，非整頁資料重整
TODO:學習如何使用Vue-Router分配頁面，列表也可以做單頁顯示筆數,換頁

2022/08/10 跑去練習Node.JS後端 singleton
2022/08/11 認為現在這樣強迫下班一邊學又一邊做，固定推動一個計畫比較沒效率，畢竟Vue.JS也很難學的扎實，至少初階知識都還沒上手，
現在情況有點像一直出招、但沒時間好好想想變招、學新招、融合招式，或許寫部落格其他程式相關學習產出也算是一個推動，所以特地加了一個新規則。
## 程式碼架構
- backend 
- frontend
> 前後端拆成兩個資料夾，但存放於同一個Repo

## 啟動方式(開發環境)
```bash
# 啟動後端Server(NestJS框架)
$ (cd ./nest-backend;  npm run start:dev) 

# 啟動前端Server
$ (cd ./frontend; npm run dev)
```