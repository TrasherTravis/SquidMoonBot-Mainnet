require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
const schedule = require('node-schedule');
// const initializeApp = require('firebase/app')
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set, onValue} = require("firebase/database");
const BigNumber = require('bignumber.js')
const BN = require('bn.js');
const { async } = require('@firebase/util');

const TOKEN = '2128393447:AAGbwKo3kQbk9kQaNftPn3YWcljRd__MGfw'
const SERVER_URL = 'https://squidmoonbot.herokuapp.com'
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`
const URI = `/webhook/${TOKEN}`
const WEBHOOK_URL = SERVER_URL+URI
// const unixTime = Math.floor(Date.now() / 1000);
const app = express()
app.use(bodyParser.json())

const firebaseConfig = {
    apiKey: "AIzaSyCfrlT4u8pnkifpwHYwkJLshiGmPEwJXoo",
    authDomain: "squidmoonbot.firebaseapp.com",
    databaseURL: "https://squidmoonbot-default-rtdb.firebaseio.com",
    projectId: "squidmoonbot",
    storageBucket: "squidmoonbot.appspot.com",
    messagingSenderId: "107816009720",
    appId: "1:107816009720:web:c6ded1b62992defc09600d",
    measurementId: "G-TLNDTVNKX5"
  };

  const firebaseApp = initializeApp(firebaseConfig);
  const database = getDatabase(firebaseApp);

const init = async() => {
    const res = await axios.get(`${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`)
    console.log(res.data)
    const theNewScheduledJob = schedule.scheduleJob({hour: 4, minute: 0}, () => {
        runScanAcrossDB();
    });
    // writeUserData('anpe', 'fa');
    //******Empty Read*/
    const starCountRef = ref(database, 'users/');
    onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        // console.log(data);
        for (const user in data) {
            if (Object.hasOwnProperty.call(data, user)) {
                const element = data[user];
                // console.log(user,element.wallet_ID)
            }
        }
    });
}

function web3BNToFloatString(
    bn,
    divideBy,
    decimals,
    roundingMode = BigNumber.ROUND_DOWN
  ) {
    const converted = new BigNumber(bn.toString())
    const divided = converted.div(divideBy)
    return divided.toFixed(decimals, roundingMode)
}

function getBalance(userAddress) {
    return new Promise((resolve) => {
    const Web3 = require('web3');
    // const rpcURL = 'https://goerli.infura.io/v3/b59d4b02df3048fe93746803df57b44d'; // Your RCP URL goes here
    const rpcURL = 'https://bsc-dataseed1.binance.org'; // Your RCP URL goes here
    const web3 = new Web3(rpcURL);
    const abi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]
    const address = '0x2766cc2537538ac68816b6b5a393fa978a4a8931';
    const contract = new web3.eth.Contract(abi, address);
    contract.methods.balanceOf(userAddress).call()
            .then((value) => {
                console.log('balanceOf', value)
                console.log('new BN(value)', new BN(value))
                // alert(value+'val')
              resolve(new BN(value))
            })
            .catch((error) => {
              console.log('error in balance')
              resolve(new BN('0'))
            })
            console.log('getBalance finished')
    })
    
}
      

async function run(address,chatId) {
    const bigNum = await getBalance(address) ;
    console.log('bigNum', bigNum)
    const pow = new BigNumber('10').pow(new BigNumber(18))
    console.log('pow', pow)
    //   setBalance(web3BNToFloatString(bn, pow, 4, BigNumber.ROUND_DOWN))
    // console.log(Number(rawVal)+' pow');
    // alert(bigNum)
    var finalBalance = web3BNToFloatString(bigNum, pow, 2, BigNumber.ROUND_DOWN);
    // console.log (finalBalance+' found mae bbbyy')
        // document.getElementById('balance').textContent = finalBalance+'';
    console.log('finalBalance', finalBalance, finalBalance>=1, +finalBalance>=1);
    if(+finalBalance>=1){
        await inviteUser(chatId)
        await sendMessage(chatId,'Voila! Here is your invite link to join the Squid Moon Whales\'s Private Group.')
    }else{
        await sendMessage(chatId,'Insufficient Balance')
    }
}

async function runScanAcrossDB(){
    const starCountRef = ref(database, 'users/');
    onValue(starCountRef, async(snapshot) => {
        const data = snapshot.val();
        // console.log(data);
        for (const user in data) {
            if (Object.hasOwnProperty.call(data, user)) {
                const element = data[user];
                // console.log(element.wallet_ID);
                const bigNum = await getBalance(element.wallet_ID) ;
                const pow = new BigNumber('10').pow(new BigNumber(18))
                var finalBalance = web3BNToFloatString(bigNum, pow, 2, BigNumber.ROUND_DOWN);
                console.log(finalBalance,user);
                if(finalBalance>=1){
                    // if(element.in_group == false){
                    //     await sendMessage(user,'Your balance is now sufficient to join the group back')
                    //     await sendMessage(user,'Enter /join')
                    // }
                }else{
                    await removeUser(user)
                }
            }
        }
    });
}

const removeUser = async(user)=>{
    const unixTime = Math.floor(Date.now() / 1000)+35;
    const res = await axios.post(`${TELEGRAM_API}/banChatMember`,{
        chat_id: -631921327,
        user_id: user,
        until_date: unixTime
    })
    // writeUserData(user,wallet_ID,false);
    sendMessage(user,'Hi, Sorry, you have been removed from the Squid Moon Whales Private Chat group. Please maintain SQM Token balance above 15000 SQM to rejoin and stay in the group.')
    sendMessage(user,'You can join again using /join')
    console.log(res);
}

const sendMessage = async(chatId,text)=>{
    const res = await axios.post(`${TELEGRAM_API}/sendMessage`,{
        chat_id: chatId,
        text: text
    })
    // console.log(res.data);
}

const inviteUser = async(chatId)=>{
    const unixTime = Math.floor(Date.now() / 1000)+25;
    const inviteLink = await axios.post(`${TELEGRAM_API}/createChatInviteLink`,{
        chat_id:-631921327,
        member_limit: 1
        // ,
        // expire_date: unixTime
    })
    const telgLink = inviteLink.data.result.invite_link;
    console.log(telgLink);
    await sendMessage(chatId,telgLink);
}

function writeUserData(userId,wallet,boolVal) {
    const db = getDatabase();
    var utc = new Date().toJSON().slice(0,10).replace(/-/g,'/');
    set(ref(db, 'users/' + userId), {
        wallet_ID: wallet,
        date_joined: utc,
        in_group: boolVal
    });
    console.log('done dude');
}

app.get('/',(req,res)=>{
    res.send('This is a server')
})

app.post(URI,async (req,res)=>{
    console.log('##############################')
    console.log(req.body);
    console.log('##############################')
    if(req.body.message){
        const type = req.body.message.chat.type;
        if(type==='private'){
            const chatId = req.body.message.chat.id 
            const text = req.body.message.text
            if(text){
                if(text==='/start'){
                    await sendMessage(chatId,'Welcome to SquidMoon!')
                    await sendMessage(chatId,'Here is your ID')
                    await sendMessage(chatId,chatId)
                    await sendMessage(chatId,'Please paste this in the SquidMoon website.')
                    await sendMessage(chatId,'After that enter /join here')
                }else if(text==='/join'){
                    const starCountRef = ref(database, 'users/');
                    var flag = false
                    var account_ID
                    onValue(starCountRef, (snapshot) => {
                        const data = snapshot.val();
                        // console.log(data);
                        for (const user in data) {
                            if (Object.hasOwnProperty.call(data, user)) {
                                const element = data[user];
                                if(user==chatId){
                                    account_ID = element
                                    flag=true;
                                    break;
                                }
                                // console.log(user,element.wallet_ID)
                            }
                        }
                    });
                    if(flag){
                        await sendMessage(chatId,'Checking your balance')
                        await run(account_ID.wallet_ID,chatId)
                    }else{
                        await sendMessage(chatId,'User not registered')
                    }
                }else{
                    await sendMessage(chatId,'This is SquidMoon Bot')
                }
            }
        }
    }

    // console.log('ID is',req.body.message.chat.id);
    
    

    res.send()
})

app.listen(process.env.PORT || 5000, async()=>{
    console.log('App running on port:',process.env.PORT || 5000)
    await init()
    // removeUser(1242525482)
})
