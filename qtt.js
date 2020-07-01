
/*Cookie登录app签到页获取，第一次获取后可以用;注释掉。


[rewrite_local]
#趣头条
^https://api\.1sapp\.com/(sign/|mission|x/feed|app/re/app/ioscoin/frameReward) url script-request-header qutoutiao_sign2.js

[task_local]
10 O * * * qutoutiao_sign2.js


MITM=api.1sapp.com

*/





//1.需要申明的变量
const $iosrule = iosrule();//声明必须
const  qutoutiao="趣头条";
const  hourname="qtt_skey";
const  dayname="qtt_hkey";
const  readname="qtt_rkey";
const  videoname="qtt_vkey";
const h_key=$iosrule.read(hourname);
const s_key=$iosrule.read(dayname);
const r_key=$iosrule.read(readname);
const v_key=$iosrule.read(videoname);
//++++++++++++++++++++++++++++++++-

const  day_url1="https://api.1sapp.com/sign/sign?OSVersion=12.4&active_method=icon&"+s_key;

const  day_url2="https://api.1sapp.com/sign/info?OSVersion=12.4&active_method=icon&"+s_key;



const  hour_url1="https://api.1sapp.com/mission/intPointReward?&OSVersion=12.4&active_method=icon&"+h_key;

const  hour_url2="https://api.1sapp.com/mission/getIntPointRewardStatus?GUID=58711eba126315ea8ff752d7cf2.41836393&OSVersion=12.4&active_method=icon&"+h_key;



const video_url="https://api.1sapp.com/app/re/app/ioscoin/frameReward?"+v_key;

const read_url="https://api.1sapp.com/x/feed/getReward?"+r_key;


//++++++++++++++++++++++++++++++++




//2.程序主体部分




function day_sign(xurl,yurl)
  {
   var result1="";var result2="";
    const llUrl1 = {url:xurl};
    const llUrl2 = {url:yurl};
        $iosrule.get(llUrl1, function(error, response, data) {
    var obj=JSON.parse(data)
         //console.log("正常日签到1:"+data);

if(obj.code==-132)
{
  result1="日签到:"+obj.message+".";
$iosrule.get(llUrl2, function(error, response, data) {
    var obj=JSON.parse(data);
        //console.log("正常签到2:"+data);
        
          result2="金币:"+obj.data.show_balance_info.coins+",约"+obj.data.show_balance_info.balance+"元";
          
          //console.log(result2);
          papa(qutoutiao,result1,result2);
        
         })
         
 } else
{
  result1=obj.message;
  result2="请重新获取日签到数据❌";
  papa(qutoutiao,result1,result2);
}
})
  }
  
 

//视频奖励vdkey
function video(xurl)
{var result1="";var result2="";
    
    const llUrl1 = {url:xurl};

        $iosrule.get(llUrl1, function(error, response, data) {
    var obj=JSON.parse(data)
         //console.log("视频:"+data);


   if(obj.code==0) {result2="视频签到:本次获得金币:"+obj.data.coin;
   
   if(obj.data.next_time>0)                     
 {var jiange=parseInt(obj.data.next_time-obj.currentTime)+2;
   
   

   
     result1="距下次签到时间:"+cotime(obj.data.next_time)+",还有"+(jiange/60).toFixed()+"分";
  
      papa(qutoutiao,result2,result1);
      
      setTimeout(function(){
              video(video_url)
              }, jiange* 1000 );
                  
   }}
else
         {
           result1=obj.message;
     papa(qutoutiao,"视频签到:"+result1,"请更新视频数据❌");
         }

})
}

//阅读间隔奖励
function read_15(xurl)
{
   var result1="";var result2="";
    
    const llUrl1 = {url:xurl};
        $iosrule.get(llUrl1, function(error, response, data) {
    var obj=JSON.parse(data)
         //console.log("阅读数据:"+data);
if(obj.code==0)
{
 var ntim=cotime(obj.currentTime);
  result1="阅读签到:完成进度"+obj.data.done_times+"/"+obj.data.total_times;
  
  


  
  if(obj.data.done_times==15)
  {  result2="获得阅读金币"+obj.data.cur_amount;
      papa(qutoutiao,result1,result2);
    //console.log("执行完毕");
    
    return;
  }
  else if(obj.data.done_times<15)
  {
       result2="获得阅读金币"+obj.data.cur_amount+","+obj.data.need_time+"秒后进行下次签到";
  papa(qutoutiao,result1,result2);
     setTimeout(function(){
read_15(xurl);
       }, obj.data.need_time* 1000 );
  }
  }
else if(obj.code==-308)
{
  result2="太快了，等哈,"+obj.message;
 papa(qutoutiao,"",result2);
}
else
{
   result1=obj.message;
 papa(qutoutiao,result1,"请更新阅读数据❌");
}



})
}







  

function hour_sign(xurl,yurl)
{var result1="";var result2="";
    
    const llUrl1 = {url:xurl};
    const llUrl2 = {url:yurl};
        $iosrule.post(llUrl1, function(error, response, data) {
    var obj=JSON.parse(data)
         //console.log("整点签到:"+data);
         if(obj.code==-101)
         result1="整点签到:"+obj.message;
      $iosrule.get(llUrl2, function(error, response, data) {
    var obj=JSON.parse(data)
         //console.log(data);
          var obj=JSON.parse(data)
                  //console.log(data);
                 
if(obj.data.next_time>0)                     
 {var jiange=parseInt(obj.data.next_time-obj.currentTime)+2;
                                 result1="整点签到:"+"本次领取金币:"+obj.data.amount;
  result2="距下次签到时间:"+cotime(obj.data.next_time)+",还有"+(jiange/60).toFixed()+"分,已经签到"+obj.data.times+"次.";
                  
                  papa(qutoutiao,result1,result2);

                    setTimeout(function(){
              hour_sign(hour_url1,hour_url2,h_key);
              }, jiange* 1000 );
                  
                
         
         
} })
})
}


//++++++++++++++++++++++++++++++++

//3.需要执行的函数都写这里


function main()
{

day_sign(day_url1,day_url2);


              read_15(read_url);
              


video(video_url);


hour_sign(hour_url1,hour_url2);


}













//++++++++++++++++++++++++++++++++++++
//4.基础模板




if ($iosrule.isRequest) {
  GetCookie(qutoutiao,dayname,hourname,readname,videoname)
  $iosrule.end()
} else {
  main();
  $iosrule.end()
}



function GetCookie(tt,s,h,r,v) {

  if ($request.headers) {

 var urlval = $request.path;
var sval="";var hval="";var rval="";
var vval="";
     //console.log(urlval);
if(urlval.indexOf("sign/info")>=0)
{
  sval=urlval.substring(urlval.indexOf("=icon")+6,urlval.length);
    if ($iosrule.read(s) != (undefined || null)) {
      if ($iosrule.read(s) !=sval ) {
 var sk= $iosrule.write(sval, s);
if (sk==true) 
 papa("更新" + tt + "日签数据成功", "", "");}
} else{
 var sk= $iosrule.write(sval, s);
if (sk==true) 
 papa("首次写入" + tt + "日签数据成功", "", "");}
}

if(urlval.indexOf("mission/intPointReward")>0||urlval.indexOf("mission/getIntPointRewardStatus")>=0)
{
  hval=urlval.substring(urlval.indexOf("=icon")+6,urlval.length);
    if ($iosrule.read(h) != (undefined || null)) {
      if ($iosrule.read(h) !=hval ) {
 var hk= $iosrule.write(hval, h);
if (hk==true) 
 papa("更新" + tt + "整点数据成功", "", "");
}}
else{
 var hk= $iosrule.write(hval, h);
if (hk==true) 
 papa("首次写入" + tt + "整点数据成功", "", "");}

}
if(urlval.indexOf("x/feed/getReward")>=0)
{
  rval=urlval.substring(urlval.indexOf("getReward?")+10,urlval.length);
    if ($iosrule.read(r) != (undefined || null)) {
      if ($iosrule.read(r) !=rval ) {
 var rk= $iosrule.write(rval, r);
if (rk==true) 
 papa("更新" + tt + "阅读数据成功", "", "");
}}
else{
 var rk= $iosrule.write(rval, r);
if (rk==true) 
 papa("首次写入" + tt + "阅读数据成功", "", "");}}
if(urlval.indexOf("ioscoin/frameReward")>=0)
{
  vval=urlval.substring(urlval.indexOf("frameReward?")+12,urlval.length);
    if ($iosrule.read(v) != (undefined || null)) {
      if ($iosrule.read(v) !=vval ) {
 var vk= $iosrule.write(vval, v);
if (vk==true) 
 papa("更新" + tt + "视频数据成功", "", "");
}}
else{
 var vk= $iosrule.write(vval, v);
if (vk==true) 
 papa("首次写入" + tt + "视频数据成功", "", "");}}

}}






function cotime(timestamp) {
  const date = new Date(timestamp * 1000)
  const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  const D = (date.getDate() + 1 < 10 ? '0' + date.getDate() : date.getDate()) + ' '
  const h = date.getHours() + ':'
  const m = (date.getMinutes() + 1 < 10 ? '0' + (date.getMinutes() + 1) : date.getMinutes() + 1) + ''
  return M + D + h + m
}


function papa(x,y,z)
{
 $iosrule.notify(x,y,z);

 
}


function iosrule() {
    const isRequest = typeof $request != "undefined"
    const isSurge = typeof $httpClient != "undefined"
    const isQuanX = typeof $task != "undefined"
    const notify = (title, subtitle, message) => {
        if (isQuanX) $notify(title, subtitle, message)
        if (isSurge) $notification.post(title, subtitle, message)
    }
    const write = (value, key) => {
        if (isQuanX) return $prefs.setValueForKey(value, key)
        if (isSurge) return $persistentStore.write(value, key)
    }
    const read = (key) => {
        if (isQuanX) return $prefs.valueForKey(key)
        if (isSurge) return $persistentStore.read(key)
    }
    const get = (options, callback) => {
        if (isQuanX) {
            if (typeof options == "string") options = { url: options }
            options["method"] = "GET"
            $task.fetch(options).then(response => {
                response["status"] = response.statusCode
                callback(null, response, response.body)
            }, reason => callback(reason.error, null, null))
        }
        if (isSurge) $httpClient.get(options, callback)
    }
    const post = (options, callback) => {
        if (isQuanX) {
            if (typeof options == "string") options = { url: options }
            options["method"] = "POST"
            $task.fetch(options).then(response => {
                response["status"] = response.statusCode
                callback(null, response, response.body)
            }, reason => callback(reason.error, null, null))
        }
        if (isSurge) $httpClient.post(options, callback)
    }
    const end = () => {
        if (isQuanX) isRequest ? $done({}) : ""
        if (isSurge) isRequest ? $done({}) : $done()
    }
    return { isRequest, isQuanX, isSurge, notify, write, read, get, post, end }
};
