<template>
    <div class="centering_parent">
        <h1>暗号通貨（ERC20トークン）の送金</h1>
        <ui-alert
            @dismiss="showAlert1 = false"
            type="error"
            v-show="showAlert1"
        >
            Something is wrong!!
        </ui-alert>
        <div class="box">
            <div class="innerBox">
                <h3>
                    enpit実験用に作成した暗号通貨の送金ができるクライアントです。
                    QRコードをかざすと送金先が自動で入力されます。その後、送金額を入力しTRANSFERボタンを押してください。
                    "Something is
                    wrong!!"と表示された場合はページを更新してみてください。
                </h3>
            </div>
        </div>
        <ui-progress-linear
            color="black"
            v-show="isLoading"
        ></ui-progress-linear>

        <div class="box">
            <h2>{{ tokenBalance + " " + tokenName }}</h2>
            <div class="innerBox" v-if="!isLoading">
                <qrcode-stream
                    class="fullscreen"
                    @decode="inputData"
                    v-if="showCamera"
                >
                </qrcode-stream>
                <ui-textbox
                    v-model="toAddress"
                    label="送金先アドレス"
                    v-if="!showCamera"
                ></ui-textbox>
                <ui-textbox
                    v-model="transferValue"
                    label="送金額(整数)"
                ></ui-textbox>
                <ui-textbox
                    v-model="address"
                    label="送金元アドレス"
                    readonly
                ></ui-textbox>
                <ui-button @click="transfer">Transfer</ui-button>
            </div>
            <loading v-if="isLoading" :height="300" :width="300" />
        </div>
        <div class="box">
            <h2>{{ etherBalance + " ETH (Ether)" }}</h2>
        </div>
    </div>
</template>

<script>
import Erc20Token from "./erc20token.js";
const erc20Token = new Erc20Token();
import Loading from "./loading.vue";

export default {
    components: {
        Loading
    },
    data() {
        return {
            tokenAddress: "0x3776d2930DC3A7fEd95aaA40dd5A11c9cf189317",
            privateKey:
                "0x5DF94F253908A243F9E88702F7100F93736923D3654980814A13FFAB1F42B3BF",
            address: "",
            tokenName: "",
            tokenDecimals: 0,
            tokenBalance: 0,
            etherBalance: 0,
            toAddress: "",
            transferValue: "",
            showAlert1: false,
            isLoading: false,
            showCamera: true
        };
    },
    mounted: async function() {
        this.address = erc20Token.privateKeyToAddress(this.privateKey);
        await erc20Token.setTokenAddress(this.tokenAddress);
        let tokenInfo = await erc20Token.getTokenInfo();
        this.tokenName = tokenInfo.symbol + " (" + tokenInfo.name + ")";
        this.tokenDecimals = tokenInfo.decimals;
        await this.getBalance();
    },
    methods: {
        async getBalance() {
            this.tokenBalance = await erc20Token.tokenBalanceOf(this.address);
            this.tokenBalance = Math.floor(
                this.tokenBalance / 10 ** this.tokenDecimals
            );
            this.etherBalance = await erc20Token.etherBalancOf(this.address);
            this.etherBalance =
                Math.floor(this.etherBalance * 10 ** 4) / 10 ** 4;
        },
        async transfer() {
            try {
                this.isLoading = true;
                await erc20Token.transferERC20Token(
                    this.toAddress,
                    this.transferValue
                );
                await this.getBalance();
                this.toAddress = "";
                this.transferValue = "";
                this.isLoading = false;
            } catch (e) {
                this.showAlert1 = true;
                this.isLoading = false;
            }
            this.showCamera = true;
        },
        inputData(result) {
            this.toAddress = result;
            this.showCamera = false;
        }
    }
};
</script>
