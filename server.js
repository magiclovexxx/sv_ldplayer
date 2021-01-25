const express = require('express');
const puppeteer = require('puppeteer');
require('dotenv').config();
var fs = require('fs');
const axios = require('axios').default;
const exec = require('child_process').exec;
var cron = require('node-cron');

const app = express();
const port = 1111;

getDeviceInfo = async (key) => {
    const browser = await puppeteer.launch({
        headless: true,
        devtools: false,
        args: ['--disable-setuid-sandbox', '--no-sandbox']
    });

    width = Math.floor(Math.random() * (1280 - 1000)) + 1000;;
    height = Math.floor(Math.random() * (800 - 600)) + 600;;
    const page = (await browser.pages())[0];

    try {
        await page.goto("http://www.myfakeinfo.com/mobile/get-android-device-information.php")
    
        await page.screenshot({ path: '1.png', fullPage: true })
        
        info = await page.evaluate(() => {
            let info =[]
            title = document.querySelectorAll('.text-right')
            value = document.querySelectorAll('.xiahuaxian')
            value.forEach((keytext) => {
                info.push(keytext.textContent)
            })
            return info
        },)

        console.log("facode: " + info)
        //await page.waitForTimeout(100000)
       
        await browser.close();
        phone = "XXXXXXXX".replace(/X/g, function () {
            return "0123456789".charAt(Math.floor(Math.random() * 10))
        });
        phone = "09" + phone
        deviceInfo=[]
        deviceInfo["resolution"] = info[9]       
        deviceInfo["manufacturer"] = info[2] 
        deviceInfo["model"] = info[0] 
        deviceInfo["pnumber"] = phone 
        deviceInfo["imei"] = info[10] 
        deviceInfo["imsi"] = info[15]         
        deviceInfo["androidid"] = info[8] 
        deviceInfo["mac"] = info[20] 

        return deviceInfo
    } catch (error) {
        console.log(error)
        await browser.close();
        return "Có lỗi gì đó"

    }
}

deviceControl = async (deviceInfo, action) => {
    if (action == "modify") {
        cmd = "dnconsole.exe modify --index " + deviceInfo.index + " --resolution " + deviceInfo.resolution + " --manufacturer " + deviceInfo.manufacturer + " --model " + deviceInfo.model + " --pnumber " + deviceInfo.pnumber + " --imei " + deviceInfo.imei + " --simserial " + deviceInfo.simserial + " --androidid " + deviceInfo.androidid + " --mac " + deviceInfo.mac
    }
    if (action == "launch") {
        cmd = "dnconsole.exe launch --index " + deviceInfo.index
    }
    if (action == "quit") {
        cmd = "dnconsole.exe quit --index " + deviceInfo.index
    }
    if (action == "runapp") {
        cmd = "dnconsole.exe runapp --index " + deviceInfo.index + " --packagename com.startup.shopyyauto"
    }

    const myShellScript = exec(cmd);
    myShellScript.stdout.on('data', (data) => {
        // do whatever you want here with data
    });
    myShellScript.stderr.on('data', (data) => {
        console.error(data);
    });
}

app.get('/done', async (req, res) => {
    try {
        key = req.query.deviceid        
        console.log(key)
        deviceInfo = await getDeviceInfo()
        
        console.log( deviceInfo)

        await res.send(deviceInfo);

    } catch (error) {
        console.log(error)
        await res.send("Có lỗi xảy ra");
    }

})

app.listen(port, function () {
    console.log("Your app running on port " + port);
})